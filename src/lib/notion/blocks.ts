import { Client, isFullBlock } from '@notionhq/client';
import type { BlockObjectResponse, ListBlockChildrenResponse } from '@notionhq/client';
import { richTextToHtml } from './rich-text';
import { escapeHtml } from './escape';

async function listAllChildren(
	client: Client,
	blockId: string
): Promise<BlockObjectResponse[]> {
	const out: BlockObjectResponse[] = [];
	let cursor: string | undefined;
	for (;;) {
		const res: ListBlockChildrenResponse = await client.blocks.children.list({
			block_id: blockId,
			start_cursor: cursor
		});
		for (const b of res.results) {
			if (isFullBlock(b)) out.push(b);
		}
		if (!res.has_more) break;
		cursor = res.next_cursor ?? undefined;
	}
	return out;
}

/** Group adjacent list blocks; used for page body and nested list children. */
async function renderGroupedBlocks(client: Client, blocks: BlockObjectResponse[]): Promise<string> {
	let html = '';
	let i = 0;
	while (i < blocks.length) {
		const b = blocks[i];
		if (b.type === 'bulleted_list_item') {
			const items: string[] = [];
			while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
				items.push(await renderBlockHtml(client, blocks[i]));
				i++;
			}
			html += `<ul>${items.join('')}</ul>`;
			continue;
		}
		if (b.type === 'numbered_list_item') {
			const items: string[] = [];
			while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
				items.push(await renderBlockHtml(client, blocks[i]));
				i++;
			}
			html += `<ol>${items.join('')}</ol>`;
			continue;
		}
		html += await renderBlockHtml(client, b);
		i++;
	}
	return html;
}

async function renderBlockHtml(client: Client, block: BlockObjectResponse): Promise<string> {
	const kids =
		block.has_children && block.type !== 'column_list'
			? await listAllChildren(client, block.id)
			: [];

	switch (block.type) {
		case 'paragraph': {
			const html = richTextToHtml(block.paragraph.rich_text);
			return html ? `<p>${html}</p>` : '<p></p>';
		}
		case 'heading_1':
			return `<h2>${richTextToHtml(block.heading_1.rich_text)}</h2>`;
		case 'heading_2':
			return `<h3>${richTextToHtml(block.heading_2.rich_text)}</h3>`;
		case 'heading_3':
			return `<h4>${richTextToHtml(block.heading_3.rich_text)}</h4>`;
		case 'divider':
			return '<hr />';
		case 'bulleted_list_item': {
			const inner = richTextToHtml(block.bulleted_list_item.rich_text);
			const nestedHtml = kids.length
				? `<div class="nested-blocks">${await renderGroupedBlocks(client, kids)}</div>`
				: '';
			return `<li>${inner}${nestedHtml}</li>`;
		}
		case 'numbered_list_item': {
			const inner = richTextToHtml(block.numbered_list_item.rich_text);
			const nestedHtml = kids.length
				? `<div class="nested-blocks">${await renderGroupedBlocks(client, kids)}</div>`
				: '';
			return `<li>${inner}${nestedHtml}</li>`;
		}
		case 'image': {
			const src =
				block.image.type === 'external'
					? block.image.external.url
					: block.image.file.url;
			const cap =
				block.image.caption?.length ? richTextToHtml(block.image.caption) : '';
			return `<figure class="intro-figure"><img src="${escapeHtml(src)}" alt="" loading="lazy" />${
				cap ? `<figcaption>${cap}</figcaption>` : ''
			}</figure>`;
		}
		case 'quote':
			return `<blockquote>${richTextToHtml(block.quote.rich_text)}</blockquote>`;
		case 'code':
			return `<pre><code>${escapeHtml(block.code.rich_text.map((t) => t.plain_text).join(''))}</code></pre>`;
		default:
			return '';
	}
}

/** Render top-level blocks for a Notion page (intro / footer content). */
export async function renderPageBlocksToHtml(client: Client, pageId: string): Promise<string> {
	const blocks = await listAllChildren(client, pageId);
	return renderGroupedBlocks(client, blocks);
}
