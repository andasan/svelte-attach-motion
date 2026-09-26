import { describe, expect, it } from 'vitest';
import { resolveTransition, shouldReduceMotion } from './reduced-motion.js';

describe('shouldReduceMotion', () => {
	it('follows the user preference in "user" mode', () => {
		expect(shouldReduceMotion('user', true)).toBe(true);
		expect(shouldReduceMotion('user', false)).toBe(false);
	});

	it('defaults to "user" mode', () => {
		expect(shouldReduceMotion(undefined, true)).toBe(true);
	});

	it('"always" and "never" override the user preference', () => {
		expect(shouldReduceMotion('always', false)).toBe(true);
		expect(shouldReduceMotion('never', true)).toBe(false);
	});

	it('is false on the server, where there is no matchMedia', () => {
		expect(shouldReduceMotion('user')).toBe(false);
	});
});

describe('resolveTransition', () => {
	it('returns the transition untouched when motion is not reduced', () => {
		const transition = { duration: 0.4, delay: 0.1 };
		expect(resolveTransition(transition, false)).toBe(transition);
	});

	it('makes the transition instant when motion is reduced', () => {
		expect(resolveTransition({ type: 'spring', delay: 1, repeat: 2 }, true)).toEqual({
			type: 'tween',
			duration: 0,
			delay: 0,
			repeat: 2
		});
	});

	it('handles a missing transition', () => {
		expect(resolveTransition(undefined, true)).toEqual({ type: 'tween', duration: 0, delay: 0 });
	});
});
