import { expect, test } from '@playwright/test';
import { trackErrors } from './helpers.js';

// Answers in the order the emails appear (see src/routes/demo/emails.ts).
const correctAnswers = [
	"It's phishing",
	'Looks legit',
	"It's phishing",
	'Looks legit',
	"It's phishing"
];

test('the phishing quiz can be completed with a perfect score', async ({ page }) => {
	const errors = trackErrors(page);
	await page.goto('/demo');

	for (const [i, answer] of correctAnswers.entries()) {
		await expect(page.getByText(`Email ${i + 1} of 5`)).toBeVisible();
		await page.getByRole('button', { name: answer }).click();
		await expect(page.getByTestId('verdict')).toContainText('Correct!');
		await page.getByRole('button', { name: i === 4 ? 'See results' : 'Next email' }).click();
	}

	await expect(page.getByTestId('results')).toContainText('You scored 5 / 5');
	expect(errors).toEqual([]);
});

test('a wrong answer is explained and counted', async ({ page }) => {
	await page.goto('/demo');
	await page.getByRole('button', { name: 'Looks legit' }).click();

	const verdict = page.getByTestId('verdict');
	await expect(verdict).toContainText('Not quite. This one is phishing.');
	await expect(verdict.getByRole('listitem')).toHaveCount(3);
});
