<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/author-sean-catangui-thumbLarge.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>@_catangui | Sean Catangui</title>
	<meta name="description" content="Designer and developer — interactive stories and editorial design." />
</svelte:head>

{@render children()}
