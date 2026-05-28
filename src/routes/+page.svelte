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
		{#if data.outroHtml}
			<OutroSection content={data.outroHtml} />
		{/if}
	</section>

	

</div>

<style>
	.site-wrap {
		width: 100%;
		margin-top: 1rem;
		padding: 0 1.25rem;
		display: grid;
		grid-template-columns: 10rem 1fr 1fr 1fr 1fr 1fr;
		gap: 1rem;
	}

	.projects {
		display: flex;
		flex-direction: column;
		gap: 5.25rem;
		grid-column: 3 / 7;
	}

	@media (max-width: 700px) {
		.site-wrap {
			margin-top: 0;
			gap: 2rem;
		}

		.projects {
			grid-column: 1 / -1;	
		}
	}
</style>
