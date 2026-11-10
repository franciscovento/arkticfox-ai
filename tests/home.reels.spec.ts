import { expect, test } from '@playwright/test';

async function openHome(page: import('@playwright/test').Page, path = '/') {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  await page.locator('main h1').waitFor();
  await expect
    .poll(async () => page.locator('[data-loader]').evaluate((n) => getComputedStyle(n).opacity), {
      timeout: 30_000,
    })
    .toBe('0');
}

test('home plays the background film on its own', async ({ page }) => {
  await openHome(page);
  const film = page.locator('[data-hero-film]');
  await expect(film).toHaveCount(1);
  await expect
    .poll(async () => film.evaluate((node) => (node as HTMLVideoElement).currentTime), { timeout: 8_000 })
    .toBeGreaterThan(0.2);
});

test('home is the scroll scene only', async ({ page }) => {
  await openHome(page);

  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('[data-journey-row] .journey-piece')).toHaveCount(3);
  await expect(page.locator('[data-journey-stage] [data-video-carousel]')).toHaveCount(1);
  await expect(page.locator('.marquee, [data-work-reel]')).toHaveCount(0);
  await expect(page.locator('[data-gallery], #contact, [data-quote-fab], form')).toHaveCount(0);
  await expect(page.locator('a[href*="pricing"], a[href*="precios"]')).toHaveCount(0);
  await expect(page.locator('[data-journey-beat]').first()).toContainText('Get a quote');
});

test('the Spanish home keeps the same headline', async ({ page }) => {
  await openHome(page, '/es/');
  await expect(page.locator('main h1')).toContainText('No solo hacemos');
  await expect(page.locator('main h1')).toContainText('anuncios ganadores');
  await expect(page.locator('[data-journey-beat]').first()).toContainText('Pide presupuesto');
  await expect(page.locator('form[name="quote"]')).toHaveCount(0);
});
