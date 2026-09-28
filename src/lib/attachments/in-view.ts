import {
	animate as motionAnimate,
	inView as motionInView,
	type AnimationPlaybackControls,
	type DOMKeyframesDefinition
} from 'motion';
import type { Attachment } from 'svelte/attachments';
import { resolveTransition, shouldReduceMotion } from '../internal/reduced-motion.js';
import { isRevealTarget, releaseRevealAfterFirstFrame } from '../internal/reveal.js';
import { getRestValues } from '../internal/rest-values.js';
import type { BaseOptions } from '../types.js';

export interface InViewOptions extends BaseOptions {
	/**
	 * State applied instantly on mount, before the element is visible. Use it
	 * for "fade in" style effects, e.g. `{ opacity: 0, y: 24 }`. Defaults to
	 * `{ opacity: 0 }` on elements with `data-reveal`.
	 */
	initial?: DOMKeyframesDefinition;
	/** How much of the element must be visible: `'some'`, `'all'` or 0–1. */
	amount?: 'some' | 'all' | number;
	/** Grows or shrinks the viewport used for detection, e.g. `'0px 0px -20% 0px'`. */
	margin?: NonNullable<Parameters<typeof motionInView>[2]>['margin'];
	/** Scrollable ancestor to observe instead of the viewport. */
	root?: Element | Document;
	/** Play once (default) or every time the element enters the viewport. */
	once?: boolean;
	/** State to animate to when leaving the viewport (only when `once: false`). Defaults to `initial`. */
	exit?: DOMKeyframesDefinition;
}

/**
 * Animates the element to `keyframes` when it scrolls into view.
 *
 * On server-rendered pages, add `data-reveal` (with `svelte-attach-motion/reveal.css`) so the
 * element is hidden from the first paint instead of flashing before `initial` is applied.
 *
 * @example
 * ```svelte
 * <section data-reveal {@attach inView({ opacity: 1, y: 0 }, { initial: { opacity: 0, y: 24 } })}>
 * ```
 */
export function inView(
	keyframes: DOMKeyframesDefinition,
	options: InViewOptions = {}
): Attachment<Element> {
	const { amount, margin, root, once = true, exit } = options;

	return (element) => {
		// A `data-reveal` element is hidden by CSS until now, so it must start hidden inline too.
		const initial = options.initial ?? (isRevealTarget(element) ? { opacity: 0 } : undefined);

		const reduce = shouldReduceMotion(options.reducedMotion);
		const transition = resolveTransition(options.transition, reduce);
		let controls: AnimationPlaybackControls | undefined;

		if (initial) motionAnimate(element, initial, { duration: 0 });
		const cancelRelease = releaseRevealAfterFirstFrame(element);

		const leaveTo =
			exit ??
			initial ??
			getRestValues(keyframes, (property) => getComputedStyle(element).getPropertyValue(property));

		const stopObserving = motionInView(
			element,
			() => {
				controls?.stop();
				controls = motionAnimate(element, keyframes, transition);

				// Returning nothing tells Motion to stop observing after the first entry.
				if (once) return;

				return () => {
					controls?.stop();
					controls = motionAnimate(element, leaveTo, transition);
				};
			},
			{ amount, margin, root }
		);

		return () => {
			cancelRelease();
			stopObserving();
			controls?.stop();
		};
	};
}
