import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Mirrored Notion media is written during load(); skip link checks until static copy.
				if (path.startsWith('/media/')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
