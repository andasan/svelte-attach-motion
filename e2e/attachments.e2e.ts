import { expect, test } from '@playwright/test';
import { expectTransform, getTransform, trackErrors } from './helpers.js';

test.describe('attachments', () => {
	let errors: string[];

	test.beforeEach(async ({ page }) => {
		errors = trackErrors(page);
		await page.goto('/');
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	test('animate reaches its final state on mount', async ({ page }) => {
		const box = page.getByTestId('animate-box');
		await expect(box).toHaveCSS('opacity', '1');
		await expectTransform(box, { y: 0 });
	});

	test('animate re-runs when $state changes', async ({ page }) => {
		const knob = page.getByTestId('knob');
		const toggle = page.getByRole('switch', { name: 'Quiet hours' });

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-checked', 'true');
		await expectTransform(knob, { x: 40 });

		await toggle.click();
		await expectTransform(knob, { x: 0 });
	});

	test('hover animates in and returns to rest', async ({ page }) => {
		const card = page.getByTestId('hover-card');
		await card.scrollIntoViewIfNeeded();

		await card.hover();
		await expectTransform(card, { y: -6 });

		await page.mouse.move(0, 0);
		await expectTransform(card, { y: 0 });
	});

	test('press works with a pointer', async ({ page }) => {
		const button = page.getByTestId('press-button');
		await button.scrollIntoViewIfNeeded();
		const box = await button.boundingBox();
		if (!box) throw new Error('button is not visible');

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await expectTransform(button, { scale: 0.92 });

		await page.mouse.up();
		await expectTransform(button, { scale: 1 });
		await expect(button).toHaveText('Saved · 1');
	});

	test('press works with the keyboard', async ({ page }) => {
		const button = page.getByTestId('press-button');
		await button.focus();

		await page.keyboard.down('Enter');
		await expectTransform(button, { scale: 0.92 });
		await page.keyboard.up('Enter');
		await expectTransform(button, { scale: 1 });
	});

	test('scrollAnimate follows scroll position', async ({ page }) => {
		const shape = page.getByTestId('example-scroll').locator('.box');
		await shape.scrollIntoViewIfNeeded();
		await expect.poll(async () => (await getTransform(shape)).rotated).toBe(true);
	});
});

test.describe('with prefers-reduced-motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('animations jump straight to their end state', async ({ page }) => {
		await page.goto('/');
		const knob = page.getByTestId('knob');

		await page.getByRole('switch', { name: 'Quiet hours' }).click();
		// No settling time: with reduced motion the value is applied on the next frame.
		await expectTransform(knob, { x: 40 }, 250);
	});

	test('scroll-linked animations are skipped', async ({ page }) => {
		await page.goto('/');
		const shape = page.getByTestId('example-scroll').locator('.box');
		await shape.scrollIntoViewIfNeeded();
		await page.mouse.wheel(0, 200);

		expect(await getTransform(shape)).toMatchObject({ rotated: false, scale: 1 });
	});

	test("reducedMotion: 'never' opts out", async ({ page }) => {
		await page.goto('/');
		await page.getByRole('radio', { name: "'never'" }).check();
		const shape = page.getByTestId('example-scroll').locator('.box');
		await shape.scrollIntoViewIfNeeded();

		await expect.poll(async () => (await getTransform(shape)).rotated).toBe(true);
	});
});
