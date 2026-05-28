<script lang="ts">
	let { content }: { content: string } = $props();
	import Canvas from '$lib/components/Canvas/index.svelte';
</script>

<section class="intro" aria-label="Introduction">
	<!-- <div class="intro-canvas">
		<Canvas />
	</div> -->
	<div class="intro-body">
		<div class="intro-content">
			{@html content}
			<ul class="footer-links">
				<li><a href="https://www.are.na/sean-catangui/channels" target="_blank" rel="noreferrer">are.na</a></li>
				<li><a href="https://github.com/seancaat" target="_blank" rel="noreferrer">GitHub</a></li>
				<li>
					<a class="footer-email" href="mailto:seancaat@gmail.com" rel="noreferrer">Email</a>
				</li>
			</ul>
		</div>
	</div>
</section>

<hr class="intro-divider" />

<style>
	.intro {
		position: relative;
		z-index: 999;
		line-height: 1.3;
		grid-column: 1 / 3;

	}

	@media (max-width: 700px) {
		.intro {
			grid-column: 1 / -1;
		}

		.intro-divider {
			display: block;
		}
	}

	.intro-body {
		position: sticky;
		top: 1rem;
		border-top: 0.75px solid var(--rule);
		z-index: 1;
		max-width: var(--body-copy-max-width);
		padding-top: 0.75rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	@media (max-width: 700px) {
		.intro-body {
			position: relative;
		}
	}

	.intro-body :global(a) {
		pointer-events: auto;
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.intro-body :global(h2) {
		font-size: 0.72rem;
		text-transform: uppercase;
		font-family: var(--sans);
		font-weight: 300;
		color: var(--label);
	}

	.intro-body :global(h3),
	.intro-body :global(h4) {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 0.875rem;
		text-transform: uppercase;
		margin: 0.25rem 0;
		letter-spacing: 0.02em;
	}

	.intro-body :global(p) {
		margin: 0 0 1rem;
	}

	.intro-body :global(ul),
	.intro-body :global(ol) {
		margin: 0 0 1rem;
		padding-left: 0;
		list-style-type: none;
	}

	.intro-body :global(hr) {
		border: none;
		border-top: 1px solid var(--rule);
		margin: 2rem 0;
	}

	.intro-body :global(.nested-blocks) {
		margin-top: 0.35rem;
		margin-bottom: 0.35rem;
	}

	.intro-body :global(.intro-figure) {
		margin: 1.5rem 0;
	}

	.intro-body :global(.intro-figure img) {
		display: block;
		width: 100%;
		height: auto;
	}

	.intro-divider {
		border: none;
		border-top: 1px solid var(--rule);
		margin: 0 auto 3rem;
		max-width: var(--body-copy-max-width);		
		display: none;
	}

	.footer-links {
		list-style: none;
		margin-top: 1.25rem;
		padding: 0;
		line-height: 1.3;
		align-items: baseline;
		font-family: var(--sans);
		font-weight: 300;
		text-transform: uppercase;
	}

	.footer-links a {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.footer-email:hover {
		background: var(--bg);
		color: var(--fg);
	}
</style>
