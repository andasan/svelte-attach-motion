import type { AnimationOptions } from 'motion';
import type { ReducedMotion } from '../types.js';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Reads the user's OS-level preference. Always `false` outside the browser. */
export function userPrefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
		? window.matchMedia(QUERY).matches
		: false;
}

/** Decides whether motion should be reduced for a given mode and preference. */
export function shouldReduceMotion(
	mode: ReducedMotion = 'user',
	prefersReduced: boolean = userPrefersReducedMotion()
): boolean {
	if (mode === 'always') return true;
	if (mode === 'never') return false;
	return prefersReduced;
}

/**
 * Returns the transition to use. When motion is reduced, the element still
 * reaches its final state (so layout and content stay correct) but instantly.
 */
export function resolveTransition(
	transition: AnimationOptions | undefined,
	reduce: boolean
): AnimationOptions | undefined {
	if (!reduce) return transition;
	return { ...transition, duration: 0, delay: 0, type: 'tween' };
}
