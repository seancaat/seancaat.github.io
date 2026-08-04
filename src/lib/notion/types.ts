export type Project = {
	/** Notion Order column value; null when unset (sort/display fall back to list position). */
	order: number | null;
	title: string;
	url: string | null;
	/** Ordered cover assets (files column can supply many). */
	coverUrls: string[];
	descriptionHtml: string;
	/** Optional award / recognition line (below description). */
	awardHtml: string | null;
	creditsHtml: string | null;
};

export type PortfolioLoad = {
	projects: Project[];
	/** Content above projects from optional Notion page. */
	introHtml: string;
	/** Content below projects from optional Notion page (e.g. teaching, press, awards). */
	outroHtml: string;
	/** Shown when env is missing (local dev). */
	siteNotice: string | null;
};
