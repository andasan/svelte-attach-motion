<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { scrollProgress } from '$lib/index.js';
	import '../app.css';

	let { children } = $props();
	let progress = $state(0);

	const links = [
		{ href: resolve('/'), label: 'Docs' },
		{ href: resolve('/demo'), label: 'Spot the phish' }
	];
</script>

<div
	class="progress"
	style:transform="scaleX({progress})"
	aria-hidden="true"
	{@attach scrollProgress((p) => (progress = p), { track: 'page' })}
></div>

<header>
	<a class="brand" href={resolve('/')}>svelte-attach-motion</a>
	<nav aria-label="Main">
		{#each links as link (link.href)}
			<a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined}>
				{link.label}
			</a>
		{/each}
		<a href="https://github.com/andasan/svelte-attach-motion">GitHub</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p>
		MIT licensed. Built on <a href="https://motion.dev">Motion</a> and
		<a href="https://svelte.dev/docs/svelte/@attach">Svelte attachments</a>.
	</p>
</footer>

<style>
	.progress {
		position: fixed;
		inset: 0 0 auto 0;
		height: 3px;
		background: var(--accent);
		transform-origin: 0 50%;
		z-index: 10;
	}

	header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		align-items: center;
		justify-content: space-between;
		max-width: var(--width);
		margin: 0 auto;
		padding: 1.25rem 1rem;
	}

	.brand {
		font-weight: 700;
		color: var(--text);
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 1.25rem;
	}

	nav a {
		color: var(--muted);
		text-decoration: none;
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--text);
	}

	main {
		max-width: var(--width);
		margin: 0 auto;
		padding: 0 1rem 4rem;
	}

	footer {
		border-top: 1px solid var(--border);
		color: var(--muted);
		text-align: center;
		padding: 2rem 1rem;
		font-size: 0.875rem;
	}
</style>
