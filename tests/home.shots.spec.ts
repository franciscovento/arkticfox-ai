import { expect, test } from '@playwright/test';

const widths = [390, 768, 1440] as const;
// The stage is pinned, so a full-page shot is useless. Sample the scroll instead.
const stops = [0, 0.35, 0.7, 1] as const;

for (const width of widths) {
  test(`home journey ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('h1').waitFor();
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
  await page.locator('h1').waitFor();

  // Every beat and card must be readable without any scroll scene driving them.
  const hidden = await page
    .locator('[data-journey-piece]')
    .evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).opacity !== '1').length);
  expect(hidden).toBe(0);

  const video = page.locator('[data-dive-video]');
  await expect(video).toHaveCount(1);
  const pausedAtStart = await video.evaluate((node) => {
    const film = node as HTMLVideoElement;
    return film.paused && film.currentTime < 0.05;
  });
  expect(pausedAtStart).toBe(true);
});

test('background video loops independent of scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('h1').waitFor();
  await expect
    .poll(async () => page.locator('[data-loader]').evaluate((n) => getComputedStyle(n).opacity), {
      timeout: 15_000,
    })
    .toBe('0');

  const video = page.locator('[data-dive-video]');
  await expect(video).toHaveCount(1);
  await expect
    .poll(async () => video.evaluate((node) => (node as HTMLVideoElement).paused), { timeout: 8_000 })
    .toBe(false);

  const before = await video.evaluate((node) => (node as HTMLVideoElement).currentTime);
  await page.waitForTimeout(700);
  const after = await video.evaluate((node) => (node as HTMLVideoElement).currentTime);
  expect(after).toBeGreaterThan(before);

  await page.evaluate(() => {
    window.scrollTo(0, (document.body.scrollHeight - window.innerHeight) * 0.55);
  });
  await page.waitForTimeout(400);
  const mid = await video.evaluate((node) => (node as HTMLVideoElement).currentTime);
  expect(mid).toBeLessThan(8);

  await expect(page.locator('[data-dive-snow]')).toHaveCount(1);
  await expect(page.locator('[data-dive-snow]')).toHaveAttribute('data-snow-direction', 'fall');
});
