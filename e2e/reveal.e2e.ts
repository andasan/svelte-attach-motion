import { expect, test, type Page } from '@playwright/test';

/**
 * Records the opacity of `selector` on every animation frame from the moment the document is
 * created, so we can see what the user actually saw while the page was loading.
 */
async function recordOpacity(page: Page, selector: string): Promise<void> {
	await page.addInitScript((selector) => {
		const samples: number[] = [];
		(window as unknown as { __opacity: number[] }).__opacity = samples;
		const start = performance.now();
		const tick = () => {
			const element = document.querySelector(selector);
			if (element) samples.push(Number(getComputedStyle(element).opacity));
			if (performance.now() - start < 2500) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, selector);
}

/** True if the element was visible and then hidden again, i.e. the content "flashed". */
function hasFlash(samples: number[]): boolean {
	const firstVisible = samples.findIndex((opacity) => opacity > 0.99);
	return firstVisible !== -1 && samples.slice(firstVisible).some((opacity) => opacity < 0.5);
}

/** Simulates a slow network: the server-rendered HTML paints before the app's JavaScript runs. */
async function delayJavaScript(page: Page, ms: number): Promise<void> {
	await page.route('**/_app/**/*.js', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, ms));
		await route.continue();
	});
}

test.describe('server-rendered content that animates in', () => {
	test('does not flash visible before the entrance animation', async ({ page }) => {
		await recordOpacity(page, '[data-testid="hero-title"]');
		await delayJavaScript(page, 600);
		await page.goto('/');
		await page.waitForTimeout(2600);

		const samples = await page.evaluate(
			() => (window as unknown as { __opacity: number[] }).__opacity
		);
		expect(samples.length).toBeGreaterThan(0);
		expect(hasFlash(samples), `opacity per frame: ${samples.join(', ')}`).toBe(false);
		await expect(page.getByTestId('hero-title')).toHaveCSS('opacity', '1');
	});

	test('is visible without JavaScript', async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto('/demo');

		await expect(page.locator('.tip').first()).toHaveCSS('opacity', '1');
		await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1');
		await context.close();
	});

	test('becomes visible even if the JavaScript never loads', async ({ page }) => {
		await page.route('**/_app/**/*.js', (route) => route.abort());
		await page.goto('/');

		const title = page.getByTestId('hero-title');
		await expect(title).toHaveCSS('opacity', '0');
		// CSS fail-safe kicks in after a few seconds
		await expect(title).toHaveCSS('opacity', '1', { timeout: 6000 });
	});

	test('elements below the fold stay hidden until scrolled into view', async ({ page }) => {
		await page.goto('/demo');
		const lastTip = page.locator('.tip').last();

		await expect(lastTip).toHaveCSS('opacity', '0');
		await lastTip.scrollIntoViewIfNeeded();
		await expect(lastTip).toHaveCSS('opacity', '1');
	});
});

test.describe('server-rendered content with prefers-reduced-motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('appears without flashing and without animating', async ({ page }) => {
		await recordOpacity(page, '[data-testid="hero-title"]');
		await delayJavaScript(page, 600);
		await page.goto('/');
		await page.waitForTimeout(2600);

		const samples = await page.evaluate(
			() => (window as unknown as { __opacity: number[] }).__opacity
		);
		expect(hasFlash(samples), `opacity per frame: ${samples.join(', ')}`).toBe(false);
		// no intermediate values: it goes straight from hidden to visible
		expect(samples.every((opacity) => opacity === 0 || opacity === 1)).toBe(true);
	});
});
