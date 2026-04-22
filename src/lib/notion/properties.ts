import type { PageObjectResponse, RichTextItemResponse } from '@notionhq/client';
import { escapeHtml } from './escape';
import { firstHrefFromRichText, richTextToHtml } from './rich-text';

function isFullPage(page: PageObjectResponse | { archived?: boolean }): page is PageObjectResponse {
	return 'properties' in page && !page.archived;
}

/** Plain text from first title property on a database row. */
export function getTitle(page: PageObjectResponse): string {
	for (const [, prop] of Object.entries(page.properties)) {
		if (prop.type === 'title') {
			return prop.title.map((t) => t.plain_text).join('') || 'Untitled';
		}
	}
	return 'Untitled';
}

export function getRichTextHtml(page: PageObjectResponse, names: string[]): string | null {
	for (const name of names) {
		const prop = page.properties[name];
		if (!prop) continue;
		if (prop.type === 'rich_text' && prop.rich_text.length) {
			return richTextToHtml(prop.rich_text as RichTextItemResponse[]);
		}
	}
	return null;
}

/** Short label fields: Rich text, Select, Status, or Formula string → safe HTML snippet. */
export function getAwardHtml(page: PageObjectResponse, names: string[]): string | null {
	for (const name of names) {
		const prop = page.properties[name];
		if (!prop) continue;

		switch (prop.type) {
			case 'rich_text':
				if (!prop.rich_text.length) continue;
				return richTextToHtml(prop.rich_text as RichTextItemResponse[]);
			case 'select':
				if (!prop.select?.name) continue;
				return escapeHtml(prop.select.name);
			case 'status':
				if (!prop.status?.name) continue;
				return escapeHtml(prop.status.name);
			case 'formula': {
				const f = prop.formula;
				if (f.type === 'string' && f.string) return escapeHtml(f.string);
				continue;
			}
			default:
				continue;
		}
	}
	return null;
}

export function getUrl(page: PageObjectResponse, names: string[]): string | null {
	for (const name of names) {
		const prop = page.properties[name];
		if (!prop) continue;
		if (prop.type === 'url' && prop.url) return prop.url;
	}
	return null;
}

export function getNumber(page: PageObjectResponse, names: string[]): number | null {
	for (const name of names) {
		const prop = page.properties[name];
		if (!prop) continue;
		if (prop.type === 'number' && prop.number !== null && prop.number !== undefined) {
			return prop.number;
		}
	}
	return null;
}

export function getCheckbox(page: PageObjectResponse, names: string[]): boolean | null {
	for (const name of names) {
		const prop = page.properties[name];
		if (!prop) continue;
		if (prop.type === 'checkbox') return prop.checkbox;
	}
	return null;
}

/**
 * Cover media URLs (ordered). **Files & media** columns first: every attachment in the
 * first matching column is included. Then single URL / rich-text cover fallbacks (one URL each).
 */
export function getCoverMediaUrls(
	page: PageObjectResponse,
	urlNames: string[],
	fileNames: string[]
): string[] {
	for (const name of fileNames) {
		const prop = page.properties[name];
		if (!prop || prop.type !== 'files' || !prop.files.length) continue;

		const urls: string[] = [];
		for (const f of prop.files) {
			if (f.type === 'external') urls.push(f.external.url);
			else if (f.type === 'file') urls.push(f.file.url);
		}
		if (urls.length) return urls;
	}

	const url = getUrl(page, urlNames);
	if (url) return [url];

	for (const name of urlNames) {
		const prop = page.properties[name];
		if (!prop || prop.type !== 'rich_text' || !prop.rich_text.length) continue;
		const href = firstHrefFromRichText(prop.rich_text as RichTextItemResponse[]);
		if (href) return [href];
	}

	for (const [name, prop] of Object.entries(page.properties)) {
		if (prop.type === 'url' && prop.url) {
			const lower = name.toLowerCase().replace(/\s+/g, '');
			if (
				lower === 'coverurl' ||
				lower.includes('cover') ||
				(lower.includes('thumb') && lower.includes('image'))
			) {
				return [prop.url];
			}
		}
		if (prop.type === 'rich_text' && prop.rich_text.length) {
			const lower = name.toLowerCase().replace(/\s+/g, '');
			const looksCover =
				lower === 'coverurl' || lower.includes('cover') || lower.includes('thumbnail');
			if (!looksCover) continue;
			const href = firstHrefFromRichText(prop.rich_text as RichTextItemResponse[]);
			if (href) return [href];
		}
	}

	return [];
}

export function shouldIncludeRow(page: PageObjectResponse): boolean {
	if (!isFullPage(page)) return false;
	const pub = getCheckbox(page, ['Published', 'published', 'Live', 'live']);
	if (pub === null) return true;
	return pub;
}
