import { describe, expect, it } from 'vitest';
import { getRestValues, toKebabCase } from './rest-values.js';

const styles: Record<string, string> = {
	opacity: '0.8',
	'background-color': 'rgb(255, 255, 255)',
	'--accent': ' #0af '
};
const readStyle = (property: string) => styles[property] ?? '';

describe('getRestValues', () => {
	it('uses identity values for transform shorthands', () => {
		expect(getRestValues({ scale: 1.1, x: 20, rotate: 45 }, readStyle)).toEqual({
			scale: 1,
			x: 0,
			rotate: 0
		});
	});

	it('reads other properties from the computed style', () => {
		expect(getRestValues({ opacity: 1, backgroundColor: '#000' }, readStyle)).toEqual({
			opacity: '0.8',
			backgroundColor: 'rgb(255, 255, 255)'
		});
	});

	it('reads CSS variables without converting their name', () => {
		expect(getRestValues({ '--accent': '#f00' }, readStyle)).toEqual({ '--accent': '#0af' });
	});

	it('prefers explicit rest values', () => {
		expect(getRestValues({ scale: 1.2, opacity: 1 }, readStyle, { scale: 0.9 })).toEqual({
			scale: 0.9,
			opacity: '0.8'
		});
	});
});

describe('toKebabCase', () => {
	it('converts camelCase CSS properties', () => {
		expect(toKebabCase('backgroundColor')).toBe('background-color');
		expect(toKebabCase('opacity')).toBe('opacity');
	});
});
