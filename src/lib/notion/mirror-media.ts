import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import type { PortfolioLoad } from './types';

const NOTION_HOSTS = [
	'prod-files-secure.s3.us-west-2.amazonaws.com',
	'secure.notion-static.com'
];

export function isNotionHostedUrl(url: string): boolean {
	try {
		return NOTION_HOSTS.some((host) => new URL(url).hostname === host);
	} catch {
		return false;
	}
}

/** Stable path segment from a Notion S3 URL (ignores expiring query string). */
export function stableMediaKey(url: string): string | null {
	try {
		const { hostname, pathname } = new URL(url);
		if (!NOTION_HOSTS.includes(hostname)) return null;

		const parts = pathname.split('/').filter(Boolean);
		if (parts.length < 2) return null;

		const fileId = parts[parts.length - 2];
		const filename = decodeURIComponent(parts[parts.length - 1]);
		const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'asset';
		return `${fileId}/${safeName}`;
	} catch {
		return null;
	}
}

/**
 * Vite copies `static/` before prerender. Mirroring runs during prerender in `load()`,
 * so files must also be written into the client output that adapter-static deploys.
 */
function mirrorOutDirs(): string[] {
	const root = process.cwd();
	const dirs = [join(root, 'static/media')];
	const clientOut = join(root, '.svelte-kit/output/client');
	if (existsSync(clientOut)) {
		dirs.push(join(clientOut, 'media'));
	}
	return dirs;
}

type MirrorOptions = {
	outDirs: string[];
	/** Skip download when the file already exists in static/media (local dev). */
	useCache: boolean;
};

async function writeToDirs(data: Buffer, destPaths: string[]): Promise<void> {
	for (const destPath of destPaths) {
		await mkdir(dirname(destPath), { recursive: true });
		await writeFile(destPath, data);
	}
}

async function downloadToDirs(url: string, destPaths: string[]): Promise<void> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	await writeToDirs(Buffer.from(await res.arrayBuffer()), destPaths);
}

async function mirrorNotionUrl(
	url: string,
	opts: MirrorOptions,
	cache: Map<string, string>
): Promise<string> {
	if (!isNotionHostedUrl(url)) return url;

	const cached = cache.get(url);
	if (cached) return cached;

	const key = stableMediaKey(url);
	if (!key) return url;

	const publicPath = `/media/${key}`;
	const cachePath = `${opts.outDirs[0]}/${key}`;
	const destPaths = opts.outDirs.map((dir) => `${dir}/${key}`);

	if (opts.useCache && existsSync(cachePath)) {
		cache.set(url, publicPath);
		return publicPath;
	}

	try {
		await downloadToDirs(url, destPaths);
		cache.set(url, publicPath);
		return publicPath;
	} catch (err) {
		console.warn(`[mirror-media] Failed to mirror ${key}:`, err);
		return url;
	}
}

async function mirrorHtml(
	html: string,
	opts: MirrorOptions,
	cache: Map<string, string>
): Promise<string> {
	if (!html) return html;

	const matches = html.match(/https:\/\/[^\s"'<>]+/g) ?? [];
	const notionUrls = [...new Set(matches.map((m) => m.replace(/&amp;/g, '&')).filter(isNotionHostedUrl))];

	let out = html;
	for (const url of notionUrls) {
		const mirrored = await mirrorNotionUrl(url, opts, cache);
		if (mirrored === url) continue;
		out = out.replaceAll(url, mirrored);
		out = out.replaceAll(url.replace(/&/g, '&amp;'), mirrored);
	}
	return out;
}

/** Download Notion-hosted media and rewrite URLs to local paths. */
export async function mirrorPortfolioMedia(data: PortfolioLoad): Promise<PortfolioLoad> {
	const useCache = process.env.NODE_ENV !== 'production';
	const opts: MirrorOptions = { outDirs: mirrorOutDirs(), useCache };
	const cache = new Map<string, string>();

	const projects = await Promise.all(
		data.projects.map(async (project) => ({
			...project,
			coverUrls: await Promise.all(
				project.coverUrls.map((url) => mirrorNotionUrl(url, opts, cache))
			),
			descriptionHtml: await mirrorHtml(project.descriptionHtml, opts, cache),
			awardHtml: project.awardHtml
				? await mirrorHtml(project.awardHtml, opts, cache)
				: null,
			creditsHtml: project.creditsHtml
				? await mirrorHtml(project.creditsHtml, opts, cache)
				: null
		}))
	);

	return {
		...data,
		projects,
		introHtml: await mirrorHtml(data.introHtml, opts, cache),
		outroHtml: await mirrorHtml(data.outroHtml, opts, cache)
	};
}
