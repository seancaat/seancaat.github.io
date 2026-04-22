<script lang="ts">
	import CoverMedia from '$lib/components/CoverMedia.svelte';
	import IntroSection from '$lib/components/IntroSection.svelte';
	import OutroSection from '$lib/components/OutroSection.svelte';
	import type { PageProps } from './$types';
	import face from '$lib/assets/face.webp';

	let { data }: PageProps = $props();
</script>

<div class="site-wrap">
	{#if data.siteNotice}
		<p class="site-notice" role="status">{data.siteNotice}</p>
	{/if}

	<img src={face} alt="Sean Catangui" class="face-thumbnail"/>

	{#if data.introHtml}
		<IntroSection content={data.introHtml} />
	{/if}

	<section class="projects" aria-label="Selected work">
		{#each data.projects as project, i (project.title + i)}
			<article class="project">
				<p class="project-num">({typeof project.order === 'number' ? project.order + 1 : i + 1})</p>
				<h2 class="project-title">
					{#if project.url}
						<a href={project.url}>{project.title}</a>
					{:else}
						{project.title}
					{/if}
				</h2>
				{#if project.coverUrls.length}
					<div class="project-covers">
						{#each project.coverUrls as url, k (`${project.title}-${i}-${k}`)}
							<CoverMedia {url} />
						{/each}
					</div>
				{/if}
				{#if project.descriptionHtml}
					<div class="project-copy">
						{@html project.descriptionHtml}
					</div>
				{/if}
				{#if project.awardHtml}
					<p class="project-award">{@html project.awardHtml}</p>
				{/if}
				{#if project.creditsHtml}
					<div class="project-credits">
						{@html project.creditsHtml}
					</div>
				{/if}
			</article>
		{:else}
			{#if !data.siteNotice}
				<p>No projects loaded. Add rows in your Notion database, or connect your integration and environment variables.</p>
			{/if}
		{/each}
	</section>

	{#if data.outroHtml}
		<OutroSection content={data.outroHtml} />
	{/if}

	<footer class="site-footer">
		<ul class="footer-links">
			<li><a href="https://www.are.na/sean-catangui/channels" target="_blank" rel="noreferrer">are.na</a></li>
			<li><a href="https://github.com/seancaat" target="_blank" rel="noreferrer">GitHub</a></li>
			<li>
				<a class="footer-email" href="mailto:seancaat@gmail.com">Email</a>
			</li>
		</ul>
	</footer>
</div>
