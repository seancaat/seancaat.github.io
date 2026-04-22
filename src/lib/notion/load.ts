import {
	Client,
	isFullDatabase,
	isFullDataSource,
	isFullPage
} from '@notionhq/client';
import type {
	DatabaseObjectResponse,
	DataSourceObjectResponse,
	PageObjectResponse
} from '@notionhq/client';
import { renderPageBlocksToHtml } from './blocks';
import {
	getAwardHtml,
	getCoverMediaUrls,
	getNumber,
	getRichTextHtml,
	getTitle,
	shouldIncludeRow,
	getUrl
} from './properties';
import { parseNotionId } from './ids';
import type { PortfolioLoad, Project } from './types';

function emptyPortfolio(siteNotice: string | null): PortfolioLoad {
	return {
		projects: [],
		introHtml: '',
		outroHtml: '',
		siteNotice
	};
}

/** Sort key is the Notion property *name* (API 2025+ uses data sources). */
function pickNumberSortKey(ds: DataSourceObjectResponse): string | undefined {
	const props = Object.values(ds.properties);
	const candidates = ['Order', 'order', '#', 'Number', 'Sort', 'Index'];
	for (const c of candidates) {
		const entry = props.find((p) => p.name === c && p.type === 'number');
		if (entry) return entry.name;
	}
	const num = props.find((p) => p.type === 'number');
	return num?.name;
}

function mapPageToProject(page: PageObjectResponse, index: number): Project {
	const order =
		getNumber(page, ['Order', 'order', '#', 'Number', 'Sort', 'Index']) ?? index;
	const description =
		getRichTextHtml(page, ['Description', 'description', 'Body', 'Summary']) ?? '';
	const credits = getRichTextHtml(page, ['Credits', 'credits', 'With', 'Collaborators']);
	const awardHtml = getAwardHtml(page, ['Award', 'award', 'Recognition', 'Accolade']);
	const projectUrl = getUrl(page, [
		'URL',
		'Url',
		'Link',
		'External URL',
		'Project URL',
		'Link URL'
	]);
	const coverUrls = getCoverMediaUrls(
		page,
		[
			'coverUrl',
			'CoverUrl',
			'Cover URL',
			'cover url',
			'Cover',
			'Image URL',
			'Image',
			'Thumbnail URL',
			'Thumbnail'
		],
		['Files', 'File', 'coverUrl', 'Cover image', 'cover', 'Image']
	);

	return {
		order,
		title: getTitle(page),
		url: projectUrl,
		coverUrls,
		descriptionHtml: description,
		awardHtml,
		creditsHtml: credits
	};
}

export async function loadPortfolio(options: {
	token: string | undefined;
	databaseId: string | undefined;
	/** Optional override; defaults to first data source on the database. */
	dataSourceId: string | undefined;
	introPageId: string | undefined;
	outroPageId: string | undefined;
}): Promise<PortfolioLoad> {
	const token = options.token?.trim();
	const rawDb = options.databaseId?.trim();
	const rawDs = options.dataSourceId?.trim();
	const introPageId = options.introPageId?.trim();
	const outroPageId = options.outroPageId?.trim();

	if (!token || !rawDb) {
		return emptyPortfolio(
			'Add NOTION_TOKEN and NOTION_PROJECTS_DATABASE_ID to your environment (see .env.example).'
		);
	}

	const databaseIdParsed = parseNotionId(rawDb);
	if (!databaseIdParsed) {
		return emptyPortfolio(
			'NOTION_PROJECTS_DATABASE_ID must be a UUID or a Notion URL (copy from the browser address bar).'
		);
	}

	const notion = new Client({ auth: token });
	const databaseId = databaseIdParsed;

	let dbMeta: DatabaseObjectResponse;
	try {
		const raw = await notion.databases.retrieve({
			database_id: databaseId
		});
		if (!isFullDatabase(raw)) {
			return emptyPortfolio(
				'Notion returned a partial database response. Recheck integration permissions.'
			);
		}
		dbMeta = raw;
	} catch {
		return emptyPortfolio(
			'Could not load the Notion database. Check NOTION_PROJECTS_DATABASE_ID and integration access.'
		);
	}

	const dsRef =
		rawDs ??
		(dbMeta.data_sources?.length ? dbMeta.data_sources[0].id : undefined);

	if (!dsRef) {
		return emptyPortfolio(
			'No data source found on this database. Create a board/table or set NOTION_DATA_SOURCE_ID.'
		);
	}

	const dataSourceIdParsed = parseNotionId(dsRef);
	const dataSourceId = dataSourceIdParsed ?? dsRef;

	let dsMeta: DataSourceObjectResponse;
	try {
		const rawDsMeta = await notion.dataSources.retrieve({
			data_source_id: dataSourceId
		});
		if (!isFullDataSource(rawDsMeta)) {
			return emptyPortfolio(
				'Could not load the Notion data source schema. Recheck NOTION_DATA_SOURCE_ID.'
			);
		}
		dsMeta = rawDsMeta;
	} catch {
		return emptyPortfolio(
			'Could not retrieve the data source. Verify NOTION_DATA_SOURCE_ID or database access.'
		);
	}

	const sortKey = pickNumberSortKey(dsMeta);

	const introParsed = introPageId ? parseNotionId(introPageId) : null;
	let introHtml = '';
	if (introParsed) {
		try {
			introHtml = await renderPageBlocksToHtml(notion, introParsed);
		} catch {
			introHtml = '';
		}
	}

	const outroParsed = outroPageId ? parseNotionId(outroPageId) : null;
	let outroHtml = '';
	if (outroParsed) {
		try {
			outroHtml = await renderPageBlocksToHtml(notion, outroParsed);
		} catch {
			outroHtml = '';
		}
	}

	const projects: Project[] = [];
	let cursor: string | undefined;

	for (;;) {
		const res = await notion.dataSources.query({
			data_source_id: dataSourceId,
			start_cursor: cursor,
			sorts: sortKey
				? [{ property: sortKey, direction: 'ascending' }]
				: [{ timestamp: 'created_time', direction: 'ascending' }]
		});

		for (const row of res.results) {
			if (!isFullPage(row)) continue;
			if (!shouldIncludeRow(row)) continue;
			projects.push(mapPageToProject(row, projects.length));
		}

		if (!res.has_more) break;
		cursor = res.next_cursor ?? undefined;
	}

	projects.sort((a, b) => a.order - b.order);

	const notices: string[] = [];
	if (introPageId && !introParsed) {
		notices.push(
			'NOTION_INTRO_PAGE_ID must be a UUID or Notion URL (use the link from your browser — the id is the last 32 letters/numbers after the title).'
		);
	}
	if (outroPageId && !outroParsed) {
		notices.push(
			'NOTION_OUTRO_PAGE_ID must be a UUID or Notion URL (same format as the intro page).'
		);
	}

	return {
		projects,
		introHtml,
		outroHtml,
		siteNotice: notices.length ? notices.join(' ') : null
	};
}
