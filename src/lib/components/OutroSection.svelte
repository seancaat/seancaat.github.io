<script lang="ts">
	import face from '$lib/assets/face.webp';
	let { content }: { content: string } = $props();
</script>

<!-- <hr class="outro-divider" /> -->

<section class="outro" aria-label="Additional information">
	<div class="outro-body">
		{@html content}
	</div>
	<img src={face} alt="Sean Catangui" class="face-thumbnail"/>
</section>



<style>

	.outro {
		grid-column: 3 / 7;
		border-top: 0.75px solid var(--rule);
		min-height: calc(100vh - 1rem);
		line-height: 1.3;
		padding-top: 0.75rem;
		/* outline: 1px solid red; */
	}

	.face-thumbnail {
		display: block;
		width: 4rem;
		height: auto;
		border-radius: 2px;
		margin: 1rem 0;
	}
	

	@media (max-width: 700px) {
		.outro {
			grid-column: 1 / -1;
		}
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
		font-size: 0.875rem;
		text-transform: uppercase;
		margin: 0.5rem 0 0.2rem;
		letter-spacing: 0.02em;
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
</style>
