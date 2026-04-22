<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<hr class="outro-divider" />

<section class="outro" aria-label="Additional information">
	<div class="outro-body">
		{@html content}
	</div>
</section>

<style>
	.outro {
		margin-top: 1rem;
		margin-bottom: 2rem;
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
		margin: 1.25rem 0 0.5rem;
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
		border-top: 1px solid var(--rule);
		margin: 3rem 0;
	}
</style>
