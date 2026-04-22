import { env } from '$env/dynamic/private';
import { loadPortfolio } from '$lib/notion/load';

export const prerender = true;

export async function load() {
	const data = await loadPortfolio({
		token: env.NOTION_TOKEN,
		databaseId: env.NOTION_PROJECTS_DATABASE_ID,
		dataSourceId: env.NOTION_DATA_SOURCE_ID,
		introPageId: env.NOTION_INTRO_PAGE_ID,
		outroPageId: env.NOTION_OUTRO_PAGE_ID
	});

	return data;
}
