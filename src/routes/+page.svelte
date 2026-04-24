<script lang="ts">
	import IntroSection from '$lib/components/IntroSection.svelte';
	import ProjectArticle from '$lib/components/ProjectArticle.svelte';
	import OutroSection from '$lib/components/OutroSection.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="site-wrap">
	{#if data.siteNotice}
		<p class="site-notice" role="status">{data.siteNotice}</p>
	{/if}

	{#if data.introHtml}
		<IntroSection content={data.introHtml} />
	{/if}

	<section class="projects" aria-label="Selected work">
		{#each data.projects as project, i (project.title + i)}
			<ProjectArticle {project} index={i} totalCount={data.projects.length} />
		{:else}
			{#if !data.siteNotice}
				<p>No projects loaded. Add rows in your Notion database, or connect your integration and environment variables.</p>
			{/if}
		{/each}
	</section>

	{#if data.outroHtml}
		<OutroSection content={data.outroHtml} />
	{/if}

</div>
