# svelte-attach-motion

[Motion](https://motion.dev) animations for Svelte 5, as [attachments](https://svelte.dev/docs/svelte/@attach).

**Docs & demo:** [ds2l9pktw39ce.cloudfront.net](https://ds2l9pktw39ce.cloudfront.net)

No wrapper components and no `<motion.div>`. Add animation to the elements you already have, with automatic cleanup and `prefers-reduced-motion` support built in.

```svelte
<script>
	import { animate, inView, hover, press } from 'svelte-attach-motion';
</script>

<h1 {@attach animate({ opacity: [0, 1], y: [16, 0] })}>Hello</h1>

<section {@attach inView({ opacity: 1 }, { initial: { opacity: 0 } })}>…</section>

<button {@attach press({ scale: 0.95 })} {@attach hover({ y: -2 })}>Save</button>
```

## Install

```sh
npm install svelte-attach-motion motion
```

Requires Svelte 5.29+ (attachments) and Motion 13. Motion is a peer dependency, so your app controls its version.

## API

| Attachment                           | What it does                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `animate(keyframes, options?)`       | Animates on mount, and again whenever reactive values in `keyframes` change.    |
| `inView(keyframes, options?)`        | Animates when the element enters the viewport. `once: false` replays each time. |
| `scrollAnimate(keyframes, options?)` | Links an animation to the element's scroll position.                            |
| `scrollProgress(callback, options?)` | Calls `callback(progress)` with 0–1 as the element (or page) scrolls.           |
| `hover(keyframes, options?)`         | Animates while a mouse hovers the element, then returns to rest. Ignores touch. |
| `press(keyframes, options?)`         | Animates while pressed, by pointer or keyboard (Enter), then returns to rest.   |

All animating attachments accept:

- `transition`: Motion transition options (`duration`, `delay`, `ease`, `type: 'spring'`, ...).
- `reducedMotion`: `'user'` (default), `'always'` or `'never'`. See below.

`hover` and `press` also accept `rest`, the values to return to when the gesture ends. You rarely need it: transform shorthands return to their identity (`scale: 1`, `x: 0`, ...) and other properties return to their computed style at mount time.

### Reactive animations

Attachments re-run when the state they read changes, so this animates the knob every time `on` flips:

```svelte
<script>
	let on = $state(false);
</script>

<button onclick={() => (on = !on)}>
	<span {@attach animate({ x: on ? 40 : 0 }, { transition: { type: 'spring' } })}></span>
</button>
```

### Reduced motion

By default every attachment respects the user's `prefers-reduced-motion` setting:

- `animate`, `inView`, `hover` and `press` still reach their final state, so content is never left hidden, but instantly.
- `scrollAnimate` is skipped entirely, because scroll-linked motion is a common trigger for discomfort.
- `scrollProgress` only reports numbers, so it is left to your callback.

Use `reducedMotion: 'never'` only for motion that is essential to understanding the UI.

### Name clashes with Motion

If you also import from `motion` directly, alias one side:

```ts
import { animate as motionAnimate } from 'motion';
import { animate } from 'svelte-attach-motion';
```

## Why attachments?

Svelte 5 attachments are functions that run when an element mounts and clean up when it unmounts, and they re-run when their reactive inputs change. That maps directly onto Motion's vanilla API, which returns a cleanup function for everything. The result is a thin layer: there are no components to learn and nothing changes about your markup.

## Development

```sh
pnpm install
pnpm dev          # docs + demo site at localhost:5173
pnpm check        # svelte-check (TypeScript)
pnpm lint         # Prettier + ESLint
pnpm test:unit    # Vitest
pnpm test:e2e     # Playwright (run `pnpm exec playwright install chromium` once first)
pnpm build        # static site to build/ and the package to dist/
```

Project layout:

```
src/lib/                    the published package
  attachments/              animate, inView, scroll*, hover/press
  internal/                 pure helpers with unit tests
src/routes/                 docs site and the "Spot the phish" demo
e2e/                        Playwright tests (animations, gestures, reduced motion, demo)
```
