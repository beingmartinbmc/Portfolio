import { expect, test } from '@playwright/test';

test('renders the portfolio immediately with optimized hero media @smoke', async ({ page }) => {
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

test('exposes semantic navigation and SEO discovery files', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main-content');
  await expect(page.locator('.nav-link').first()).toHaveAttribute('href', '#about');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('/Portfolio/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('beingmartinbmc.github.io/Portfolio/');
});

test.describe('mobile and accessibility preferences', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens mobile navigation and honors reduced motion', async ({ page }) => {
    // `test.use({ reducedMotion })` is not applied by the installed Playwright, so emulate explicitly.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'Toggle navigation menu' });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.nav-links')).toHaveClass(/active/);

    // The global rule must collapse EVERY animated element, not just one component's local override.
    const longAnimations = await page.evaluate(() =>
      Array.from(document.querySelectorAll('*'))
        .map(element => ({
          selector: element.tagName.toLowerCase() + '.' + element.className.toString().split(/\s+/)[0],
          name: getComputedStyle(element).animationName,
          duration: Number.parseFloat(getComputedStyle(element).animationDuration),
        }))
        .filter(entry => entry.name !== 'none' && entry.duration > 0.001),
    );
    expect(longAnimations).toEqual([]);
  });
});

test('pauses decorative animation while the tab is backgrounded', async ({ page }) => {
  await page.goto('/');

  // The sprite animates forever, so never wait for it to be "stable" — read computed style directly.
  const playState = () =>
    page.evaluate(() => getComputedStyle(document.querySelector('.footer-mario')!).animationPlayState);

  await expect.poll(playState).toBe('running');

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(playState).toBe('paused');
});
