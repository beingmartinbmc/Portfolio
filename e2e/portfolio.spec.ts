import { expect, test } from '@playwright/test';

test('renders the portfolio immediately with optimized hero media', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Ankit Sharma/);
  await expect(page.locator('app-loader')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI agents');

  const portrait = page.getByAltText('Ankit Sharma');
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('src', /ankit\.webp$/);
  await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});

test('supports keyboard interaction for expandable skill cards', async ({ page }) => {
  await page.goto('/#skill');

  const firstSkill = page.locator('.skill-card').first();
  await firstSkill.scrollIntoViewIfNeeded();
  await firstSkill.focus();
  await firstSkill.press('Enter');

  await expect(firstSkill).toHaveAttribute('aria-expanded', 'true');
});
