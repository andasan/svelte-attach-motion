/** Source shown next to each live example on the docs page. */
export const code = {
	install: `npm install svelte-attach-motion motion`,
	animate: `<div {@attach animate(
  { opacity: [0, 1], y: [24, 0] },
  { transition: { duration: 0.5 } }
)} />`,
	reactive: `<script>
  let on = $state(false);
</script>

<button onclick={() => (on = !on)}>
  <span {@attach animate(
    { x: on ? 40 : 0 },
    { transition: { type: 'spring', bounce: 0.35 } }
  )} />
</button>`,
	inView: `<li {@attach inView(
  { opacity: 1, x: 0 },
  { initial: { opacity: 0, x: -32 }, once: false, amount: 0.6 }
)}>…</li>`,
	scroll: `<div {@attach scrollAnimate(
  { rotate: [-12, 12], scale: [0.8, 1.1] },
  { offset: ['start end', 'end start'] }
)} />`,
	hover: `<article {@attach hover(
  { y: -6, boxShadow: '0 12px 24px rgb(0 0 0 / 0.15)' }
)}>…</article>`,
	press: `<button {@attach press({ scale: 0.92 })}>Save draft</button>`,
	reduced: `<div {@attach animate(keyframes, { reducedMotion: 'user' })} />
<!-- 'user' (default) | 'always' | 'never' -->`
};
