<script lang="ts">
	import { tick } from 'svelte';
	import { isVideoUrl } from '$lib/isVideoUrl';

	const DEFAULT_ASPECT = '4 / 5';

	let { url }: { url: string } = $props();

	let container = $state<HTMLElement | undefined>(undefined);
	let videoEl = $state<HTMLVideoElement | undefined>(undefined);
	let imgEl = $state<HTMLImageElement | undefined>(undefined);
	let isReady = $state(false);
	let aspectRatio = $state(DEFAULT_ASPECT);

	const showVideo = $derived(isVideoUrl(url));

	$effect(() => {
		url;
		isReady = false;
		aspectRatio = DEFAULT_ASPECT;
	});

	function onLoadedMetadata() {
		const v = videoEl;
		if (v?.videoWidth && v?.videoHeight) {
			aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
		}
	}

	function onLoadedData() {
		isReady = true;
	}

	function applyImageReady(img: HTMLImageElement) {
		if (img.naturalWidth && img.naturalHeight) {
			aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
		}
		isReady = true;
	}

	function onImageLoad(e: Event) {
		applyImageReady(e.currentTarget as HTMLImageElement);
	}

	$effect(() => {
		const img = imgEl;
		url;
		if (showVideo || !img) return;
		if (img.complete && img.naturalWidth) {
			applyImageReady(img);
		}
	});

	$effect(() => {
		const root = container;
		const src = url;
		const video = videoEl;
		if (!showVideo || !root || !video) return;

		let srcAttached = false;

		const io = new IntersectionObserver(
			async (entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (!srcAttached) {
							srcAttached = true;
							video.preload = 'auto';
							video.src = src.includes('#') ? src : `${src}#t=0.001`;
							video.load();
							await tick();
						}
						video.play().catch(() => {});
					} else {
						video.pause();
					}
				}
			},
			{ threshold: 0.12, rootMargin: '80px 0px' }
		);

		io.observe(root);
		return () => io.disconnect();
	});

	function togglePlayPause() {
		if (videoEl?.paused) {
			videoEl.play();
		} else {
			videoEl?.pause();
		}
	}
</script>

{#if showVideo}
	<figure
		class="project-media project-media--cover"
		bind:this={container}
		style:aspect-ratio={aspectRatio}
	>
		<video
			bind:this={videoEl}
			onclick={togglePlayPause}
			onloadedmetadata={onLoadedMetadata}
			onloadeddata={onLoadedData}
			class:ready={isReady}
			muted
			loop
			playsinline
			preload="none"
			disablepictureinpicture
			disableremoteplayback
			class="project-media-asset project-media-asset--video"
			aria-hidden="true"
		></video>
	</figure>
{:else}
	<figure class="project-media project-media--cover" style:aspect-ratio={aspectRatio}>
		<img
			bind:this={imgEl}
			src={url}
			alt=""
			loading="lazy"
			onload={onImageLoad}
			class:ready={isReady}
			class="project-media-asset"
		/>
	</figure>
{/if}

<style>
	.project-media {
		margin: 0;
		width: 100%;
	}

	.project-media--cover {
		position: relative;
		overflow: hidden;
		border-radius: var(--media-br);
		outline: 0.5px solid var(--border);
		background: color-mix(in srgb, var(--rule) 55%, var(--bg));
	}

	.project-media-asset {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.75s ease;
	}

	.project-media-asset.ready {
		opacity: 1;
	}

	.project-media-asset--video {
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		.project-media-asset {
			transition: none;
		}
	}
</style>
