<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		id: string;
		title: string;
		code: string;
		/** Show a "Replay" button that remounts the demo. */
		replayable?: boolean;
		description: Snippet;
		children: Snippet;
	}

	let { id, title, code, replayable = false, description, children }: Props = $props();
	let run = $state(0);
</script>

<section class="example" aria-labelledby="{id}-title" data-testid="example-{id}">
	<h2 id="{id}-title"><code>{title}</code></h2>
	{@render description()}

	<div class="stage">
		{#key run}
			{@render children()}
		{/key}
		{#if replayable}
			<button class="replay" type="button" onclick={() => run++}>Replay</button>
		{/if}
	</div>

	<CodeBlock {code} />
</section>

<style>
	.example {
		margin-top: 3.5rem;
	}

	h2 {
		font-size: 1.35rem;
		margin-bottom: 0.5rem;
	}

	h2 code {
		background: none;
		padding: 0;
		font-size: 1em;
	}

	.stage {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 11rem;
		margin: 1rem 0 0.75rem;
		padding: 2rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.replay {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--muted);
		border-radius: 999px;
		padding: 0.2rem 0.8rem;
		font-size: 0.8125rem;
	}
</style>
