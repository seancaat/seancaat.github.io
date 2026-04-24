<script lang="ts">
	import CoverMedia from '$lib/components/CoverMedia.svelte';
	import type { Project } from '$lib/notion/types';

	let { project, index, totalCount }: { project: Project; index: number; totalCount: number } =
		$props();
</script>

<article class="project">
	<p class="project-num">
		{typeof project.order === 'number' ? project.order + 1 : index + 1} of {totalCount}
	</p>
	<h2 class="project-title">
		{#if project.url}
			<a href={project.url} target="_blank" rel="noreferrer">{project.title}</a>
		{:else}
			{project.title}
		{/if}
	</h2>
	{#if project.descriptionHtml}
		<div class="project-description">
			{#if project.descriptionHtml}
				<p class="project-copy">{@html project.descriptionHtml}</p>
			{/if}
			{#if project.awardHtml}
				<p class="project-award">{@html project.awardHtml}</p>
			{/if}
			{#if project.creditsHtml}
				<p class="project-credits">{@html project.creditsHtml}</p>
			{/if}
		</div>
	{/if}
	{#if project.coverUrls.length}
		<div class="project-covers">
			{#each project.coverUrls as url, k (`${project.title}-${index}-${k}`)}
				<CoverMedia {url} />
			{/each}
		</div>
	{/if}
</article>

<style>
	.project {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.project-num {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 0.875rem;
		letter-spacing: 0.06em;
		width: min(var(--body-copy-max-width), 100%);
		text-align: left;
		margin: 0 auto;
	}

	.project-title {
		text-align: left;
		font-size: 36px;
		width: var(--body-copy-max-width);
		max-width: 100%;
		margin: 0 auto;
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.05rem;
	}

	.project-title a {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
	}

	.project-covers {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: calc(var(--body-copy-max-width) + var(--media-br));
		margin: 0 auto;
	}

	.project-description {
		width: 100%;
		max-width: var(--body-copy-max-width);
		margin: 0 auto;
	}

	.project-copy {
		margin: 0;
		color: var(--fg);
	}

	.project-copy :global(a) {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.project-award {
		margin: 1rem 0 0.5rem;
		font-size: 0.95rem;
		font-family: var(--sans);
		line-height: 1.45;
	}

	.project-credits {
		margin: 0.5rem 0 0;
		font-size: 0.95rem;
		color: var(--muted);
	}

	@media (max-width: 560px) {
		.project-covers {
			flex-direction: column;
			gap: 1rem;
		}

		.project-title {
			font-size: 24px;
		}
	}
</style>
