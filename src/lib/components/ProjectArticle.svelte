<script lang="ts">
	import CoverMedia from '$lib/components/CoverMedia.svelte';
	import type { Project } from '$lib/notion/types';

	let { project, index, totalCount }: { project: Project; index: number; totalCount: number } =
		$props();
</script>

<article class="project">
	<div class="project-info">
		<h2 class="project-title">
			<span class="project-num">
				{typeof project.order === 'number' ? project.order + 1 : index + 1}.
			</span>
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
	</div>
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
		padding-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-top: 0.75px solid var(--rule);
	}

	.project-info {
		font-family: var(--serif);
		color: var(--fg);
		font-weight: 400;
		line-height: 1.3;
		max-width: var(--body-copy-max-width);
		text-align: left;
		margin-right: auto
	}

	.project-covers {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0 auto;
	}

	.project-title {
		margin: 0;
		font-size: inherit;
		font-style: italic;
		font-weight: 400;
	}

	.project-title a {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
	}

	.project-description {
		width: 100%;
		margin: 0 auto;
	}

	.project-copy {
		margin: 0;
		text-indent: 2.75em;
	}

	.project-copy :global(a) {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.project-award {
		margin-top: 0.25em;
		margin-bottom: 0;
		font-size: 0.95rem;
		font-family: var(--sans);
		font-weight: 500;
		line-height: 1.45;
		color: var(--muted);
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
	}
</style>
