import type { RichTextItemResponse } from '@notionhq/client';
import { escapeHtml } from './escape';

/** First hyperlink (Notion Rich text columns often hold links instead of URL-type fields). */
export function firstHrefFromRichText(rich: RichTextItemResponse[]): string | null {
	for (const item of rich) {
		if (item.href) return item.href;
	}
	return null;
}

/** Serialize Notion rich text to minimal HTML (paragraph use wraps elsewhere). */
export function richTextToHtml(rich: RichTextItemResponse[]): string {
	let out = '';
	for (const item of rich) {
		const { annotations, plain_text: plain, href } = item;
		let chunk = escapeHtml(plain);
		if (annotations.code) chunk = `<code>${chunk}</code>`;
		if (annotations.bold) chunk = `<strong>${chunk}</strong>`;
		if (annotations.italic) chunk = `<em>${chunk}</em>`;
		if (annotations.strikethrough) chunk = `<s>${chunk}</s>`;
		if (href)
			chunk = `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${chunk}</a>`;
		out += chunk;
	}
	return out;
}
