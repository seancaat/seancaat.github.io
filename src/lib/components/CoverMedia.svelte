<script lang="ts">
	import { tick } from 'svelte';
	import { isVideoUrl } from '$lib/isVideoUrl';

	let { url }: { url: string } = $props();

	let container = $state<HTMLElement | undefined>(undefined);
	let videoEl = $state<HTMLVideoElement | undefined>(undefined);

	const showVideo = $derived(isVideoUrl(url));

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
							video.src = src;
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
</script>

{#if showVideo}
	<figure class="project-media project-media--video" bind:this={container}>
		<video
			bind:this={videoEl}
			muted
			loop
			playsinline
			preload="none"
			disablepictureinpicture
			disableremoteplayback
			class="project-media-video"
			aria-hidden="true"
		></video>
	</figure>
{:else}
	<figure class="project-media">
		<img src={url} alt="" loading="lazy" />
	</figure>
{/if}

<style>
	.project-media {
		margin: 0;
		width: 100%;
	}

	.project-media img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 5px;
		outline: 0.5px solid var(--border);
	}

	.project-media-video {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
		border-radius: 5px;
		outline: 0.5px solid var(--border);
	}
</style>
