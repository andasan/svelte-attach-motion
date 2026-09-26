import type { AnimationOptions, DOMKeyframesDefinition } from 'motion';

export type { AnimationOptions, DOMKeyframesDefinition };

/**
 * How an attachment reacts to the user's `prefers-reduced-motion` setting.
 *
 * - `'user'` (default): respect the OS setting. Animations jump straight to
 *   their end state and scroll-linked effects are skipped.
 * - `'always'`: behave as if reduced motion is always requested.
 * - `'never'`: ignore the setting. Only use this for motion that is essential
 *   to understanding the UI.
 */
export type ReducedMotion = 'user' | 'always' | 'never';

export interface BaseOptions {
	/** Motion transition options (duration, easing, spring, delay, ...). */
	transition?: AnimationOptions;
	/** See {@link ReducedMotion}. Defaults to `'user'`. */
	reducedMotion?: ReducedMotion;
}

export interface GestureOptions extends BaseOptions {
	/**
	 * Values to return to when the gesture ends. Keys you leave out are
	 * inferred: transform shorthands use their identity value (`scale: 1`,
	 * `x: 0`, ...) and everything else is read from the computed style when the
	 * attachment mounts.
	 */
	rest?: DOMKeyframesDefinition;
}
