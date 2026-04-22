const DASHED_UUID =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 32 hex digits → RFC-style id (Notion accepts this form in API paths). */
export function formatNotionUuid(hex32: string): string {
	const h = hex32.toLowerCase();
	if (h.length !== 32) return h;
	return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * Parse a Notion ID from env or copied text:
 * - hyphenated UUID
 * - 32 hex chars only
 * - public URL / slug ending in `-` + 32 hex (e.g. `My-page-abc…f34`)
 * - full `notion.so` / `notion.site` URLs (`?v=` or path suffix)
 */
export function parseNotionId(raw: string): string | null {
	const s = raw.trim();
	if (!s) return null;

	if (DASHED_UUID.test(s)) return s.toLowerCase();

	const vParam = s.match(/[?&]v=([0-9a-f]{32})\b/i);
	if (vParam) return formatNotionUuid(vParam[1]);

	const pathPart = s.split('?')[0].split('#')[0];
	const tail = pathPart.match(/([0-9a-f]{32})$/i);
	if (tail) return formatNotionUuid(tail[1]);

	const compact = s.replace(/-/g, '');
	if (/^[0-9a-f]{32}$/i.test(compact)) return formatNotionUuid(compact);

	return null;
}
