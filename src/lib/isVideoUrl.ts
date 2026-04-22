/** Treat common video extensions in path or URL string (works with CDNs and query strings). */
export function isVideoUrl(url: string): boolean {
	try {
		const path = new URL(url).pathname.toLowerCase();
		return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(path);
	} catch {
		return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
	}
}
