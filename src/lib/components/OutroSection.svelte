<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<hr class="outro-divider" />

<section class="outro" aria-label="Additional information">
	<div class="outro-body">
		{@html content}
	</div>
</section>

<footer class="site-footer">
	<ul class="footer-links">
		<li><a href="https://www.are.na/sean-catangui/channels" target="_blank" rel="noreferrer">are.na</a></li>
		<li><a href="https://github.com/seancaat" target="_blank" rel="noreferrer">GitHub</a></li>
		<li>
			<a class="footer-email" href="mailto:seancaat@gmail.com" rel="noreferrer">Email</a>
		</li>
	</ul>
</footer>

<style>
	.outro, footer {
		max-width: var(--body-copy-max-width);
		margin: 1rem auto 2rem;
	}

	.outro-body :global(a) {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.outro-body :global(h2) {
		font-size: 0.72rem;
		text-transform: uppercase;
		font-family: var(--sans);
		font-weight: 300;
		color: var(--label);
	}

	.outro-body :global(h3),
	.outro-body :global(h4) {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 1rem;
		text-transform: uppercase;
		margin: 1.5rem 0 0.5rem;
	}

	.outro-body :global(p) {
		margin: 0 0 1rem;
	}

	.outro-body :global(ul),
	.outro-body :global(ol) {
		margin: 0 0 1rem;
		padding-left: 0;
		list-style-type: none;
	}

	.outro-body :global(hr) {
		border: none;
		border-top: 1px solid var(--rule);
		margin: 2rem 0;
	}

	.outro-body :global(.nested-blocks) {
		margin-top: 0.35rem;
		margin-bottom: 0.35rem;
	}

	.outro-body :global(.intro-figure) {
		margin: 1.5rem 0;
	}

	.outro-body :global(.intro-figure img) {
		display: block;
		width: 100%;
		height: auto;
	}

	.outro-divider {
		border: none;
		max-width: var(--body-copy-max-width);
		border-top: 1px solid var(--rule);
		margin: 3rem auto;
	}

	.site-footer {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--rule);
	}

	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
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
