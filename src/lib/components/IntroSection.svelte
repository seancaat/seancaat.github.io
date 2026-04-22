<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<section class="intro" aria-label="Introduction">
	<div class="intro-body">
		{@html content}
	</div>
</section>

<hr class="intro-divider" />

<style>
	.intro {
		margin-bottom: 3rem;
	}

	.intro-body :global(a) {
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
		font-size: 1rem;
		text-transform: uppercase;
		margin: 1.25rem 0 0.5rem;
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
		margin: 3rem 0;
	}
</style>
