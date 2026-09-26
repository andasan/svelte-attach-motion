import {
	animate as motionAnimate,
	hover as motionHover,
	press as motionPress,
	type AnimationPlaybackControls,
	type DOMKeyframesDefinition
} from 'motion';
import type { Attachment } from 'svelte/attachments';
import { resolveTransition, shouldReduceMotion } from '../internal/reduced-motion.js';
import { getRestValues } from '../internal/rest-values.js';
import type { GestureOptions } from '../types.js';

type GestureStart = (element: Element, onStart: () => () => void) => () => void;

/** Shared logic: animate to `keyframes` while a gesture is active, then back to rest. */
function gesture(
	listen: GestureStart,
	keyframes: DOMKeyframesDefinition,
	options: GestureOptions
): Attachment<Element> {
	return (element) => {
		const reduce = shouldReduceMotion(options.reducedMotion);
		const transition = resolveTransition(options.transition, reduce);
		const rest = getRestValues(
			keyframes,
			(property) => getComputedStyle(element).getPropertyValue(property),
			options.rest
		);
		let controls: AnimationPlaybackControls | undefined;

		const stopListening = listen(element, () => {
			controls?.stop();
			controls = motionAnimate(element, keyframes, transition);

			return () => {
				controls?.stop();
				controls = motionAnimate(element, rest, transition);
			};
		});

		return () => {
			stopListening();
			controls?.stop();
		};
	};
}

/**
 * Animates while a mouse pointer hovers the element. Touch input is ignored,
 * which avoids "sticky" hover states on phones.
 *
 * @example
 * ```svelte
 * <a {@attach hover({ scale: 1.05 })}>…</a>
 * ```
 */
export function hover(
	keyframes: DOMKeyframesDefinition,
	options: GestureOptions = {}
): Attachment<Element> {
	return gesture((element, onStart) => motionHover(element, onStart), keyframes, options);
}

/**
 * Animates while the element is pressed, by pointer or by keyboard (Enter).
 * Motion adds `tabindex="0"` to elements that are not already focusable.
 *
 * @example
 * ```svelte
 * <button {@attach press({ scale: 0.95 })}>Save</button>
 * ```
 */
export function press(
	keyframes: DOMKeyframesDefinition,
	options: GestureOptions = {}
): Attachment<Element> {
	return gesture((element, onStart) => motionPress(element, onStart), keyframes, options);
}
