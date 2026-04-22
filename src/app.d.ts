// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { PortfolioLoad } from '$lib/notion/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData extends PortfolioLoad {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
