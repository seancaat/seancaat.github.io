# Portfolio (SvelteKit + Notion)

Static site generated at build time from a Notion database (with optional intro and outro pages). Deploy on **Vercel** (recommended) or any host that serves the `build/` folder.

## Quick start

1. **Notion integration:** [My integrations](https://www.notion.so/my-integrations) → New integration → copy the **internal integration secret**.
2. **Share content** with that integration:
   - Your **projects database** (full database, not only one row).
   - Optionally separate **intro** and/or **outro** pages (rich text blocks — e.g. bio above projects, teaching/press/awards below).
3. Copy [`.env.example`](.env.example) to `.env` and set:
   - `NOTION_TOKEN`
   - `NOTION_PROJECTS_DATABASE_ID` — from the database URL (`…/DATABASE_ID?v=…`).
   - Optionally `NOTION_INTRO_PAGE_ID`, `NOTION_OUTRO_PAGE_ID`, and `NOTION_DATA_SOURCE_ID` (see below).

```bash
npm install
npm run dev
```

Edit content in Notion, then **redeploy** (Vercel → Redeploy, or trigger a Deploy Hook).

## Database properties

The UI reads common property **names** (you can rename in Notion; aliases are listed):

| Purpose        | Property types | Names tried (in order) |
|----------------|----------------|------------------------|
| Title          | Title          | *(first Title column)* |
| Sort order     | Number         | Order, #, Number, Sort, Index |
| Link           | URL            | URL, Link, External URL, … |
| Cover          | **Files & media** (checked first — **all** attachments in that column, in order), then URL or Rich text (link) | `Files`, `File`, then `coverUrl`, `Cover`, … |
| Description    | Rich text      | Description, Body, Summary |
| Award          | Rich text, Select, Status, or Formula (string) | Award, Recognition, … |
| Credits        | Rich text      | Credits, With, Collaborators |
| Hide row       | Checkbox       | Published / Live — if present, unchecked rows are hidden |

**Cover images / video:** A **Files & media** column (e.g. `Files`) wins over URL columns. Uploads use Notion-hosted URLs that **expire** after ~1 hour in the raw API response. At **build time**, the site downloads those files into `static/media/` and serves them from your domain (Vercel’s CDN). External URLs in a URL column are left as-is. Paths ending in `.mp4`, `.mov`, `.m4v`, `.webm`, or `.ogg` render as inline video (muted, looping, no controls; plays in view only). Other URLs render as images.

**Note:** Some Notion file URLs omit the file extension in the path; if a video is treated as an image, use a URL field with a clear `.mov` / `.mp4` path or rename the asset so the link includes the extension.

## Intro page (`NOTION_INTRO_PAGE_ID`)

Optional. Paste the **full page URL** from your browser (preferred), or the hyphenated UUID, or the **32-character id** at the end of the public link (after the page title and final `-`). Notion URLs look like `…/My-page-title-abc123…f34` — you can paste that whole slug; the app extracts the UUID for the API.

Blocks above the project list use headings, paragraphs, bullets, horizontal rules, and images supported by [`src/lib/notion/blocks.ts`](src/lib/notion/blocks.ts).

## Outro page (`NOTION_OUTRO_PAGE_ID`)

Optional. Same URL / UUID rules as the intro page. Renders **below** the project list and **above** the site footer (good for TEACHING / PRESS / AWARDS columns or any closing copy). Uses the same block renderer as the intro.

## Data source (`NOTION_DATA_SOURCE_ID`)

Notion’s API (2025+) attaches schema to **data sources**. This project loads the database, then uses the **first** data source by default (typical single-table databases). Override if you manage multiple sources on one database.

## Deploy (Vercel)

1. Import this GitHub repo → Framework Preset: **SvelteKit**.
2. Add the same variables under **Environment Variables** (Production + Preview).
3. Connect **catangui.com** (or your domain) in Project → Domains.

If you previously published `catangui.com` via GitHub Pages and a `CNAME` file, point DNS at **Vercel** instead so only one host claims the apex domain.

Optional: **Deploy Hooks** → paste the URL into a shortcut or Zapier/Make to rebuild after Notion edits without a git push.

## Scripts

| Command       | Purpose |
|---------------|---------|
| `npm run dev` | Local dev with `.env` |
| `npm run build` | Static export to `build/` |
| `npm run preview` | Preview production build |

## Legacy

The old single-file Paper.js splash lived in git history (`index.html`, canvas). The new homepage is CMS-driven content.
