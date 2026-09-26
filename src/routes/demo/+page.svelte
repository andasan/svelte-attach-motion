<script lang="ts">
	import { animate, hover, inView, press } from '$lib/index.js';
	import { emails } from './emails.js';

	type Answer = 'phish' | 'legit';

	let index = $state(0);
	let answers = $state<Answer[]>([]);

	const email = $derived(emails[index]);
	const answer = $derived<Answer | undefined>(answers[index]);
	const correct = $derived(answer !== undefined && (answer === 'phish') === email?.isPhish);
	const score = $derived(answers.filter((a, i) => (a === 'phish') === emails[i].isPhish).length);
	const finished = $derived(index >= emails.length);

	function choose(choice: Answer) {
		if (answer === undefined) answers[index] = choice;
	}

	function next() {
		index++;
	}

	function restart() {
		answers = [];
		index = 0;
	}
</script>

<svelte:head>
	<title>Spot the phish · svelte-attach-motion</title>
</svelte:head>

<section class="intro">
	<h1>Spot the phish</h1>
	<p>
		Five emails, all fictional. Decide whether each one is legitimate or a phishing attempt. A small
		demo of <code>svelte-attach-motion</code> in a real interface.
	</p>
</section>

{#if !finished && email}
	<p class="counter" aria-live="polite">Email {index + 1} of {emails.length}</p>

	{#key email.id}
		<article
			class="email"
			aria-labelledby="subject"
			data-testid="email"
			{@attach animate({ opacity: [0, 1], x: [40, 0] }, { transition: { duration: 0.35 } })}
		>
			<header>
				<div class="avatar" aria-hidden="true">{email.fromName.charAt(0)}</div>
				<div>
					<p class="from"><strong>{email.fromName}</strong></p>
					<p class="address">&lt;{email.fromAddress}&gt;</p>
				</div>
			</header>
			<h2 id="subject">{email.subject}</h2>
			<p>{email.body}</p>
		</article>

		{#if answer === undefined}
			<div class="choices">
				<button
					type="button"
					class="choice legit"
					onclick={() => choose('legit')}
					{@attach press({ scale: 0.94 })}
					{@attach hover({ y: -2 })}
				>
					Looks legit
				</button>
				<button
					type="button"
					class="choice phish"
					onclick={() => choose('phish')}
					{@attach press({ scale: 0.94 })}
					{@attach hover({ y: -2 })}
				>
					It's phishing
				</button>
			</div>
		{:else}
			<section
				class="verdict"
				class:correct
				role="status"
				data-testid="verdict"
				{@attach animate(
					{ opacity: [0, 1], scale: [0.96, 1] },
					{ transition: { type: 'spring', bounce: 0.3, duration: 0.4 } }
				)}
			>
				<h3>
					{correct ? 'Correct!' : 'Not quite.'}
					This one is {email.isPhish ? 'phishing' : 'legitimate'}.
				</h3>
				<ul>
					{#each email.clues as clue, i (clue)}
						<li
							{@attach animate(
								{ opacity: [0, 1], x: [-12, 0] },
								{ transition: { delay: 0.15 + i * 0.08 } }
							)}
						>
							{clue}
						</li>
					{/each}
				</ul>
				<button type="button" class="next" onclick={next} {@attach press({ scale: 0.95 })}>
					{index === emails.length - 1 ? 'See results' : 'Next email'}
				</button>
			</section>
		{/if}
	{/key}
{:else}
	<section
		class="results"
		data-testid="results"
		{@attach animate({ opacity: [0, 1], y: [16, 0] }, { transition: { duration: 0.4 } })}
	>
		<h2>You scored {score} / {emails.length}</h2>
		<p>
			{score === emails.length
				? 'Perfect. Attackers will have a hard time with you.'
				: 'Phishing works because it looks normal. Check the sender domain, distrust urgency, and never type a password from an email link.'}
		</p>
		<button type="button" class="next" onclick={restart} {@attach press({ scale: 0.95 })}>
			Try again
		</button>
	</section>
{/if}

<section class="tips" aria-labelledby="tips-title">
	<h2 id="tips-title">Three habits that stop most phishing</h2>
	{#each ['Read the sender domain letter by letter.', 'Treat urgency and secrecy as red flags.', 'Go to the site yourself instead of clicking the link.'] as tip, i (tip)}
		<p
			class="tip"
			{@attach inView(
				{ opacity: 1, y: 0 },
				{ initial: { opacity: 0, y: 20 }, transition: { delay: i * 0.1 } }
			)}
		>
			<span aria-hidden="true">{i + 1}</span>
			{tip}
		</p>
	{/each}
</section>

<style>
	.intro {
		padding-top: 2rem;
	}

	h1 {
		font-size: clamp(2rem, 6vw, 2.75rem);
		margin: 0 0 0.5rem;
	}

	.intro p {
		color: var(--muted);
		max-width: 38rem;
	}

	.counter {
		margin: 2rem 0 0.75rem;
		color: var(--muted);
		font-size: 0.875rem;
	}

	.email {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.5rem;
	}

	.email header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.avatar {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: var(--accent-soft);
		color: var(--accent);
		font-weight: 700;
		flex-shrink: 0;
	}

	.from,
	.address {
		margin: 0;
	}

	.address {
		color: var(--muted);
		font-size: 0.875rem;
		word-break: break-all;
	}

	.email h2 {
		font-size: 1.2rem;
		margin: 1.25rem 0 0.5rem;
	}

	.choices {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.choice {
		padding: 0.9rem 1rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		font-weight: 600;
	}

	.choice.legit {
		background: var(--good-soft);
		color: var(--good);
	}

	.choice.phish {
		background: var(--bad-soft);
		color: var(--bad);
	}

	.verdict {
		margin-top: 1rem;
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius);
		background: var(--bad-soft);
		border: 1px solid var(--bad);
	}

	.verdict.correct {
		background: var(--good-soft);
		border-color: var(--good);
	}

	.verdict h3 {
		margin: 0 0 0.5rem;
	}

	.verdict ul {
		padding-left: 1.25rem;
	}

	.next {
		border: none;
		border-radius: 999px;
		padding: 0.65rem 1.4rem;
		background: var(--text);
		color: var(--bg);
		font-weight: 600;
	}

	.results {
		margin-top: 2rem;
		padding: 2rem;
		text-align: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.tips {
		margin-top: 4rem;
	}

	.tip {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		padding: 1rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.tip span {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		background: var(--accent);
		color: white;
		font-weight: 700;
		flex-shrink: 0;
	}
</style>
