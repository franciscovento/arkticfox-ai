import { expect, test } from '@playwright/test';

const widths = [390, 768, 1440] as const;
// The stage is pinned, so a full-page shot is useless. Sample the scroll instead.
const stops = [0, 0.35, 0.7, 1] as const;

for (const width of widths) {
  test(`home journey ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('main h1').waitFor();
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

    // Wait out the preload loader so it never lands in a screenshot.
    await expect
      .poll(async () => page.locator('[data-loader]').evaluate((n) => getComputedStyle(n).opacity), {
        timeout: 15_000,
      })
      .toBe('0');

    for (const stop of stops) {
      await page.evaluate((at) => {
        window.scrollTo(0, (document.body.scrollHeight - window.innerHeight) * at);
      }, stop);
      // Lenis eases the scroll and the snow runs on rAF; give both time to settle.
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `shots/home-${width}-${String(stop).replace('.', '')}.png` });
    }
  });
}

test('reduced motion flattens the journey', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.locator('main h1').waitFor();

  // Every beat must be readable without any scroll scene driving it.
  const hidden = await page
    .locator('[data-journey-beat]')
    .evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).opacity !== '1').length);
  expect(hidden).toBe(0);

  // The film is a single still on the canvas when motion is reduced.
  await expect(page.locator('[data-scrub-frames]')).toHaveCount(1);
});

test('home keeps falling snow over the film', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('main h1').waitFor();
  await expect(page.locator('[data-dive-snow]')).toHaveCount(1);
  await expect(page.locator('[data-dive-snow]')).toHaveAttribute('data-snow-direction', 'fall');
});

test('header holds only the mark and the language switch', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('[data-site-header]');
  await expect(header.locator('a')).toHaveCount(3);
  await expect(header.locator('a[hreflang="en"]')).toBeVisible();
  await expect(header.locator('a[hreflang="es"]')).toHaveAttribute('href', '/es/');
  await expect(header.locator('button')).toHaveCount(0);
});
