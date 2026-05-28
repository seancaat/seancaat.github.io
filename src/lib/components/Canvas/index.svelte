<script lang="ts">
	import { onMount } from 'svelte';
	import pencilUrl from './pencil.svg?url';

	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		let teardown = () => {};
		let cancelled = false;

		void (async () => {
			const [{ default: paper }, { initSketch }] = await Promise.all([
				import('paper'),
				import('./drawSketch.js')
			]);
			if (cancelled || !canvas) return;
			teardown = initSketch(canvas, paper);
		})();

		return () => {
			cancelled = true;
			teardown();
		};
	});
</script>

<div class="canvas-root" aria-hidden="true">
	<canvas
		bind:this={canvas}
		class="draw-canvas"
		style:cursor={`url(${pencilUrl}) 4 28, crosshair`}
	></canvas>
</div>

<style>
	.canvas-root {
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}

	.draw-canvas {
		display: block;
		width: 100%;
		touch-action: none;
        border-radius: 10px;
	}

	@media screen and (max-width: 600px) {
		.draw-canvas {
			aspect-ratio: 4/5;
		}
	}
</style>
