import type { DOMKeyframesDefinition } from 'motion';

type Keyframes = DOMKeyframesDefinition;
type RestValue = string | number;

/** Identity values for Motion's independent transform shorthands. */
const TRANSFORM_IDENTITY: Record<string, number> = {
	x: 0,
	y: 0,
	z: 0,
	translateX: 0,
	translateY: 0,
	translateZ: 0,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	skew: 0,
	skewX: 0,
	skewY: 0,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1
};

export type ReadStyle = (property: string) => string;

/**
 * Works out the values a gesture should return to when it ends.
 *
 * Priority: explicit `rest` value, then transform identity, then the element's
 * computed style at mount time (read through `readStyle`, which keeps this
 * function free of DOM access and easy to unit test).
 */
export function getRestValues(
	target: Keyframes,
	readStyle: ReadStyle,
	rest: Keyframes = {}
): Keyframes {
	const result: Record<string, RestValue> = {};

	for (const key of Object.keys(target)) {
		const explicit = (rest as Record<string, unknown>)[key];
		if (typeof explicit === 'string' || typeof explicit === 'number') {
			result[key] = explicit;
		} else if (key in TRANSFORM_IDENTITY) {
			result[key] = TRANSFORM_IDENTITY[key];
		} else if (key.startsWith('--')) {
			result[key] = readStyle(key).trim();
		} else {
			result[key] = readStyle(toKebabCase(key));
		}
	}

	return result as Keyframes;
}

export function toKebabCase(property: string): string {
	return property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
