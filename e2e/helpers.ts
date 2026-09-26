import { expect, type Locator, type Page } from '@playwright/test';

export interface Transform {
	x: number;
	y: number;
	scale: number;
	rotated: boolean;
}

/** Reads the element's computed transform as simple numbers. */
export async function getTransform(locator: Locator): Promise<Transform> {
	return locator.evaluate((element) => {
		const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
		return {
			x: Math.round(matrix.m41 * 100) / 100,
			y: Math.round(matrix.m42 * 100) / 100,
			scale: Math.round(Math.hypot(matrix.a, matrix.b) * 1000) / 1000,
			rotated: Math.abs(matrix.b) > 0.001
		};
	});
}

/** Waits until the element's transform settles on the expected values. */
export async function expectTransform(
	locator: Locator,
	expected: Partial<Transform>,
	timeout = 3000
): Promise<void> {
	await expect.poll(() => getTransform(locator), { timeout }).toMatchObject(expected);
}

/** Collects console errors and uncaught exceptions for the whole test. */
export function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	return errors;
}
