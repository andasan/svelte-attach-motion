<script lang="ts">
	interface Props {
		code: string;
	}

	let { code }: Props = $props();

	let copied = $state(false);
	let reset: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(reset));

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = code;
			ta.setAttribute('readonly', '');
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
		}

		copied = true;
		clearTimeout(reset);
		reset = setTimeout(() => (copied = false), 1600);
	}
</script>

<div class="block">
	<pre><code>{code}</code></pre>
	<button
		type="button"
		class="copy"
		class:copied
		onclick={copy}
		aria-label={copied ? 'Copied' : 'Copy code'}
	>
		{#if copied}
			<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d="M3.5 8.5 6.5 11.5 12.5 4.5"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Copied
		{:else}
			<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<rect
					x="5.5"
					y="5.5"
					width="8"
					height="8"
					rx="1.5"
					stroke="currentColor"
					stroke-width="1.5"
				/>
				<path
					d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
			Copy
		{/if}
	</button>
	<span class="sr" aria-live="polite">{copied ? 'Copied to clipboard' : ''}</span>
</div>

<style>
	.block {
		position: relative;
	}

	.block :global(pre) {
		padding-right: 5.5rem;
	}

	.copy {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--muted);
		border-radius: 6px;
		padding: 0.3rem 0.55rem;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1;
		transition:
			color 0.15s ease,
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.copy:hover {
		color: var(--text);
		border-color: color-mix(in srgb, var(--border) 60%, var(--text));
	}

	.copy.copied {
		color: var(--good);
		border-color: color-mix(in srgb, var(--good) 35%, var(--border));
		background: var(--good-soft);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
