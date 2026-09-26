import {
	animate as motionAnimate,
	scroll as motionScroll,
	type DOMKeyframesDefinition
} from 'motion';
import type { Attachment } from 'svelte/attachments';
import { shouldReduceMotion } from '../internal/reduced-motion.js';
import type { ReducedMotion } from '../types.js';

type MotionScrollOptions = NonNullable<Parameters<typeof motionScroll>[1]>;

export interface ScrollLinkOptions {
	/** Where the effect starts and ends, e.g. `['start end', 'end start']` (Motion's default). */
	offset?: MotionScrollOptions['offset'];
	axis?: 'x' | 'y';
	/** Scroll container to track instead of the page. */
	container?: Element;
	/**
	 * Scroll-linked motion can cause discomfort, so by default it is skipped
	 * entirely when the user prefers reduced motion.
	 */
	reducedMotion?: ReducedMotion;
}

/**
 * Links an animation to scroll position: the animation's progress follows how
 * far the element has travelled through the viewport (or `container`).
 *
 * @example
 * ```svelte
 * <img {@attach scrollAnimate({ scale: [0.8, 1], opacity: [0, 1] }, { offset: ['start end', 'center center'] })} />
 * ```
 */
export function scrollAnimate(
	keyframes: DOMKeyframesDefinition,
	options: ScrollLinkOptions = {}
): Attachment<Element> {
	return (element) => {
		if (shouldReduceMotion(options.reducedMotion)) return;

		const controls = motionAnimate(element, keyframes, { ease: 'linear' });
		const stopScroll = motionScroll(controls, {
			target: element,
			offset: options.offset,
			axis: options.axis,
			container: options.container
		});

		return () => {
			stopScroll();
			controls.stop();
		};
	};
}

export interface ScrollProgressOptions {
	/**
	 * `'element'` (default): progress of this element through the viewport.
	 * `'page'`: progress of the whole page (or `container`), useful for reading
	 * progress bars.
	 */
	track?: 'element' | 'page';
	offset?: MotionScrollOptions['offset'];
	axis?: 'x' | 'y';
	container?: Element;
}

/**
 * Calls `onProgress` with a 0–1 value as the user scrolls. Nothing is animated
 * for you, so reduced motion is left to your callback.
 *
 * @example
 * ```svelte
 * <div {@attach scrollProgress((p) => (progress = p), { track: 'page' })}></div>
 * ```
 */
export function scrollProgress(
	onProgress: (progress: number) => void,
	options: ScrollProgressOptions = {}
): Attachment<Element> {
	return (element) =>
		motionScroll(onProgress, {
			target: options.track === 'page' ? undefined : element,
			offset: options.offset,
			axis: options.axis,
			container: options.container
		});
}
