import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = '/opt/cursor/artifacts/hero-3d';

async function ready(page: import('@playwright/test').Page) {
  await page.locator('h1').waitFor();
  await page.addStyleTag({
    content: 'astro-dev-toolbar { display: none !important; }',
  });
  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 90_000 },
    )
    .not.toBe('loading');
  const state = await page
    .locator('[data-fox-stage]')
    .getAttribute('data-fox-state');
  expect(state === 'error').toBe(false);
}

async function scrubTo(page: import('@playwright/test').Page, at: number) {
  await page.evaluate(async (target) => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    if (!stage) return;
    const total = stage.scrollHeight - window.innerHeight;
    const dest = total * target;
    const start = window.scrollY;
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, start + ((dest - start) * i) / steps);
      await new Promise((resolve) => setTimeout(resolve, 32));
    }
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
    );
  }, at);
}

test.beforeAll(async () => {
  await mkdir(outDir, { recursive: true });
});

test.describe.configure({ timeout: 120_000 });

test('scroll walks the fox, then idle sits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d');
  await ready(page);

  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 5_000 },
    )
    .toBe('sit');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outDir}/desktop-start-idle.png` });

  for (const stop of [0.35, 0.75] as const) {
    await scrubTo(page, stop);
    await expect
      .poll(
        async () =>
          page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
        { timeout: 2_000 },
      )
      .toBe('walk');
    const progress = Number(
      await page.locator('[data-fox-stage]').getAttribute('data-fox-progress'),
    );
    expect(progress).toBeGreaterThan(stop - 0.08);
    expect(progress).toBeLessThan(stop + 0.08);
    await page.screenshot({
      path: `${outDir}/desktop-scroll-${String(stop).replace('.', '')}-walk.png`,
    });

    await expect
      .poll(
        async () =>
          page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
        { timeout: 3_000 },
      )
      .toBe('sit');
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${outDir}/desktop-scroll-${String(stop).replace('.', '')}-idle.png`,
    });
  }
});

test('mobile scroll and idle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hero-3d');
  await ready(page);
  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 5_000 },
    )
    .toBe('sit');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/mobile-start-idle.png` });

  await scrubTo(page, 0.5);
  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 2_000 },
    )
    .toBe('walk');
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-walk.png` });
  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 3_000 },
    )
    .toBe('sit');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-idle.png` });
});

test('reduced motion holds a still frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d');
  await ready(page);
  await expect
    .poll(
      async () =>
        page.locator('[data-fox-stage]').getAttribute('data-fox-state'),
      { timeout: 5_000 },
    )
    .toBe('reduced');
  const before = await page
    .locator('[data-fox-stage]')
    .getAttribute('data-fox-progress');
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  const after = await page
    .locator('[data-fox-stage]')
    .getAttribute('data-fox-progress');
  expect(after).toBe(before);
  await page.screenshot({ path: `${outDir}/desktop-reduced.png` });
});
