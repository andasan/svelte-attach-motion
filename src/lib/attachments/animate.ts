import { animate as motionAnimate, type DOMKeyframesDefinition } from 'motion';
import type { Attachment } from 'svelte/attachments';
import { resolveTransition, shouldReduceMotion } from '../internal/reduced-motion.js';
import type { BaseOptions } from '../types.js';

/**
 * Animates the element to `keyframes` when it mounts.
 *
 * Because attachments re-run when the reactive values they read change,
 * passing `$state` into `keyframes` animates the element to each new value,
 * starting from wherever it currently is.
 *
 * @example
 * ```svelte
 * <div {@attach animate({ opacity: [0, 1], y: [16, 0] }, { transition: { duration: 0.4 } })}>
 * ```
 */
export function animate(
	keyframes: DOMKeyframesDefinition,
	options: BaseOptions = {}
): Attachment<Element> {
	return (element) => {
		const reduce = shouldReduceMotion(options.reducedMotion);
		const controls = motionAnimate(
			element,
			keyframes,
			resolveTransition(options.transition, reduce)
		);

		return () => controls.stop();
	};
}
