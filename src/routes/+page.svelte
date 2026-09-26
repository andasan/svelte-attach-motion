<script lang="ts">
	import { animate, hover, inView, press, scrollAnimate, type ReducedMotion } from '$lib/index.js';
	import CodeBlock from './_components/CodeBlock.svelte';
	import Example from './_components/Example.svelte';
	import { code } from './_components/snippets.js';

	let on = $state(false);
	let presses = $state(0);
	let reducedMotion = $state<ReducedMotion>('user');
</script>

<svelte:head>
	<title>svelte-attach-motion</title>
	<meta
		name="description"
		content="Motion animations for Svelte 5 as attachments: animate, inView, scroll, hover and press."
	/>
</svelte:head>

<section class="hero">
	<h1 {@attach animate({ opacity: [0, 1], y: [12, 0] }, { transition: { duration: 0.5 } })}>
		Motion for Svelte&nbsp;5, <span>one attachment at a time.</span>
	</h1>
	<p class="lede">
		<code>svelte-attach-motion</code> wraps <a href="https://motion.dev">Motion</a>'s animation
		engine in
		<a href="https://svelte.dev/docs/svelte/@attach">Svelte attachments</a>. No wrapper components,
		no <code>&lt;motion.div&gt;</code>. Add animation to the elements you already have, with
		automatic cleanup and reduced-motion support built in.
	</p>
	<CodeBlock code={code.install} />
</section>

<Example id="animate" title="animate" code={code.animate} replayable>
	{#snippet description()}
		<p>Animates an element when it mounts. Pass an array to set start and end values.</p>
	{/snippet}
	<div
		class="box"
		data-testid="animate-box"
		{@attach animate({ opacity: [0, 1], y: [24, 0] }, { transition: { duration: 0.5 } })}
	></div>
</Example>

<Example id="reactive" title="animate + $state" code={code.reactive}>
	{#snippet description()}
		<p>
			Attachments re-run when the state they read changes, so the element animates to each new value
			from wherever it currently is.
		</p>
	{/snippet}
	<label class="pref">
		<span>Quiet hours</span>
		<button
			class="switch"
			type="button"
			role="switch"
			aria-checked={on}
			aria-label="Quiet hours"
			data-testid="switch"
			onclick={() => (on = !on)}
		>
			<span
				class="knob"
				data-testid="knob"
				{@attach animate(
					{ x: on ? 40 : 0 },
					{ transition: { type: 'spring', bounce: 0.35 }, reducedMotion }
				)}
			></span>
		</button>
	</label>
</Example>

<Example id="hover" title="hover" code={code.hover}>
	{#snippet description()}
		<p>
			Animates while a mouse hovers the element and returns to its resting values afterwards. Touch
			input is ignored, so there are no "stuck" hover states on phones.
		</p>
	{/snippet}
	<article
		class="card"
		data-testid="hover-card"
		{@attach hover({ y: -6, boxShadow: '0 12px 24px rgb(0 0 0 / 0.15)' }, { reducedMotion })}
	>
		<strong>Invoice #1842</strong>
		<span>Due Mar 12 · $240.00</span>
	</article>
</Example>

<Example id="press" title="press" code={code.press}>
	{#snippet description()}
		<p>
			Animates while the element is pressed, by pointer <em>or</em> keyboard. Try focusing the
			button and holding <kbd>Enter</kbd>.
		</p>
	{/snippet}
	<button
		class="action"
		type="button"
		data-testid="press-button"
		onclick={() => presses++}
		{@attach press({ scale: 0.92 }, { reducedMotion })}
	>
		{presses === 0 ? 'Save draft' : `Saved · ${presses}`}
	</button>
</Example>

<Example id="in-view" title="inView" code={code.inView}>
	{#snippet description()}
		<p>
			Animates when the element scrolls into view. Use <code>initial</code> for the hidden state and
			<code>once: false</code> to replay every time.
		</p>
	{/snippet}
	<ul class="list">
		{#each ['Inbox', 'Drafts', 'Shared with me', 'Archive', 'Trash'] as item, i (item)}
			<li
				{@attach inView(
					{ opacity: 1, x: 0 },
					{
						initial: { opacity: 0, x: -32 },
						once: false,
						amount: 0.6,
						transition: { delay: i * 0.06 },
						reducedMotion
					}
				)}
			>
				{item}
			</li>
		{/each}
	</ul>
</Example>

<Example id="scroll" title="scrollAnimate" code={code.scroll}>
	{#snippet description()}
		<p>
			Links an animation to scroll position. The shape rotates as it travels through the viewport.
			Scroll-linked motion is skipped entirely when the user prefers reduced motion.
		</p>
	{/snippet}
	<div
		class="box accent"
		{@attach scrollAnimate(
			{ rotate: [-12, 12], scale: [0.8, 1.1] },
			{ offset: ['start end', 'end start'], reducedMotion }
		)}
	></div>
</Example>

<section class="reduced" aria-labelledby="reduced-title">
	<h2 id="reduced-title">Reduced motion by default</h2>
	<p>
		Every attachment respects <code>prefers-reduced-motion</code>. Animations still reach their
		final state, so nothing is left hidden, but instantly. Try it on the demos above:
	</p>
	<fieldset>
		<legend>Reduced motion mode</legend>
		{#each ['user', 'always', 'never'] as const as mode (mode)}
			<label>
				<input type="radio" name="reduced" value={mode} bind:group={reducedMotion} />
				<code>'{mode}'</code>
			</label>
		{/each}
	</fieldset>
	<CodeBlock code={code.reduced} />
</section>

<style>
	.hero {
		padding-top: 2.5rem;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3.25rem);
		letter-spacing: -0.02em;
		margin: 0 0 1rem;
	}

	h1 span {
		color: var(--accent);
	}

	.lede {
		font-size: 1.125rem;
		color: var(--muted);
		max-width: 40rem;
	}

	.box {
		width: 5rem;
		height: 5rem;
		border-radius: 1rem;
		background: var(--text);
	}

	.box.accent {
		background: var(--accent);
	}

	.pref {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		width: min(100%, 16rem);
		font-weight: 600;
	}

	.switch {
		width: 5.5rem;
		height: 3rem;
		padding: 0.25rem;
		border: none;
		border-radius: 999px;
		background: var(--border);
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.switch[aria-checked='true'] {
		background: var(--accent);
	}

	.knob {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
	}

	.card {
		display: grid;
		gap: 0.25rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg);
	}

	.card span {
		color: var(--muted);
		font-size: 0.9rem;
	}

	.action {
		border: none;
		border-radius: 999px;
		padding: 0.75rem 1.5rem;
		background: var(--accent);
		color: white;
		font-weight: 600;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
		width: min(100%, 18rem);
	}

	.list li {
		padding: 0.6rem 1rem;
		border-radius: 8px;
		background: var(--accent-soft);
		font-weight: 600;
	}

	.reduced {
		margin-top: 3.5rem;
	}

	fieldset {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.75rem 1rem;
	}

	legend {
		padding: 0 0.25rem;
		color: var(--muted);
		font-size: 0.875rem;
	}

	kbd {
		font-family: ui-monospace, monospace;
		font-size: 0.85em;
		border: 1px solid var(--border);
		border-bottom-width: 2px;
		border-radius: 4px;
		padding: 0 0.3em;
	}
</style>