import { expect, test } from '@playwright/test';

test('marquee word opens glass work and the strip keeps moving', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('h1').waitFor();
  await expect
    .poll(async () => page.locator('[data-loader]').evaluate((n) => getComputedStyle(n).opacity), {
      timeout: 15_000,
    })
    .toBe('0');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
  await page.waitForTimeout(1200);

  const track = page.locator('.marquee__track').first();
  const before = await track.evaluate((node) => getComputedStyle(node).animationPlayState);
  expect(before).toBe('running');

  const word = page.locator('[data-reel]').first();
  await expect(word).toBeVisible();
  await word.hover();
  const hovered = await track.evaluate((node) => getComputedStyle(node).animationPlayState);
  expect(hovered).toBe('running');

  await word.click();

  const dialog = page.locator('[data-work-reel]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/is-open/);
  await expect(page.locator('[data-reel-image]')).toBeVisible();
  await expect(page.locator('[data-work-reel] a[href="/work"]')).toBeVisible();

  await page.locator('[data-reel-close]').click();
  await expect(dialog).toBeHidden();
});

test('returning from work restarts the home dive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('h1').waitFor();
  await expect
    .poll(async () => page.locator('[data-loader]').evaluate((n) => getComputedStyle(n).opacity), {
      timeout: 15_000,
    })
    .toBe('0');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
  await page.waitForTimeout(800);
  await page.locator('[data-reel]').first().click();
  await expect(page.locator('[data-work-reel]')).toHaveClass(/is-open/);
  await page.locator('[data-reel-more]').click();
  await page.waitForURL('**/work');
  await expect(page.locator('h1')).toBeVisible();

  await page.locator('a[href="/"]').first().click();
  await page.waitForURL((url) => url.pathname === '/');

  const state = await page.evaluate(() => ({
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    dive: Boolean(document.querySelector('[data-snow-dive]')),
    dialogOpen: Boolean(document.querySelector('dialog[open]')),
    height: document.documentElement.scrollHeight,
  }));
  expect(state.htmlOverflow).not.toBe('hidden');
  expect(state.bodyOverflow).not.toBe('hidden');
  expect(state.dive).toBe(true);
  expect(state.dialogOpen).toBe(false);
  expect(state.height).toBeGreaterThan(2000);

  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(80);
});

test('sample work page presents the mock case', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.work-beat__plate')).toHaveCount(4);
  await expect(page.locator('.work-beat__card')).toHaveCount(4);
});

test('v2 is a parked image grid', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v2');
  await expect(page.locator('.pop-board .pop-shot')).toHaveCount(9);
  await expect(page.locator('.pop-reel__title')).toHaveCount(0);
});
