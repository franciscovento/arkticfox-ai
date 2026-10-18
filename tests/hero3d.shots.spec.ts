import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = '/opt/cursor/artifacts/hero-3d';

async function attr(page: Page, name: string) {
  return page.locator('[data-fox-stage]').getAttribute(name);
}

async function ready(page: Page) {
  await page.locator('h1').waitFor();
  await page.addStyleTag({
    content: 'astro-dev-toolbar { display: none !important; }',
  });
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 90_000 })
    .not.toBe('loading');
  const state = await attr(page, 'data-fox-state');
  expect(state === 'error').toBe(false);
}

async function scrubTo(page: Page, at: number) {
  await page.evaluate(async (target) => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    if (!stage) return;
    const total = stage.scrollHeight - window.innerHeight;
    const dest = total * target;
    const start = window.scrollY;
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, start + ((dest - start) * i) / steps);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
    );
  }, at);
}

async function nudge(page: Page, direction: 1 | -1) {
  await page.evaluate((dir) => window.scrollBy(0, dir * 12), direction);
}

/** Keeps the scroll alive so the 400ms idle does not sit the fox mid-turn. */
async function waitWalk(page: Page, facing: 'forward' | 'back') {
  const direction = facing === 'forward' ? 1 : -1;
  await expect
    .poll(
      async () => {
        await nudge(page, direction);
        return attr(page, 'data-fox-facing');
      },
      { timeout: 4_000 },
    )
    .toBe(facing);
  await expect
    .poll(
      async () => {
        await nudge(page, direction);
        return Number(await attr(page, 'data-fox-align'));
      },
      { timeout: 5_000 },
    )
    .toBeGreaterThan(0.98);
  expect(await attr(page, 'data-fox-state')).toBe('walk');
}

async function expectStill(page: Page) {
  await expect
    .poll(async () => attr(page, 'data-fox-facing'), { timeout: 4_000 })
    .toBe('camera');
  await expect
    .poll(
      async () => {
        const first = await attr(page, 'data-fox-nose');
        await page.waitForTimeout(400);
        const second = await attr(page, 'data-fox-nose');
        return first !== null && first === second;
      },
      { timeout: 4_000 },
    )
    .toBe(true);
  expect(await attr(page, 'data-fox-state')).toMatch(/sit|reduced/);
}

test.beforeAll(async () => {
  await mkdir(outDir, { recursive: true });
});

test.describe.configure({ timeout: 120_000 });

test('scroll down walks forward, idle faces the camera, scroll up walks back', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d');
  await ready(page);

  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 5_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/desktop-start-idle.png` });

  await scrubTo(page, 0.45);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 2_000 })
    .toBe('walk');
  const forward = Number(await attr(page, 'data-fox-progress'));
  expect(forward).toBeGreaterThan(0.37);
  expect(forward).toBeLessThan(0.53);
  expect(await attr(page, 'data-fox-facing')).toBe('forward');
  await waitWalk(page, 'forward');
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-walk.png` });

  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 3_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-idle.png` });

  await scrubTo(page, 0.12);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 2_000 })
    .toBe('walk');
  const back = Number(await attr(page, 'data-fox-progress'));
  expect(back).toBeGreaterThan(0.04);
  expect(back).toBeLessThan(0.2);
  expect(await attr(page, 'data-fox-facing')).toBe('back');
  await waitWalk(page, 'back');
  await page.screenshot({ path: `${outDir}/desktop-scroll-up-walk.png` });

  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 3_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/desktop-scroll-up-idle.png` });
});

test('mobile scroll and idle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hero-3d');
  await ready(page);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 5_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/mobile-start-idle.png` });

  await scrubTo(page, 0.5);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 2_000 })
    .toBe('walk');
  await waitWalk(page, 'forward');
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-walk.png` });
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 3_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-idle.png` });
});

test('reduced motion holds a still frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d');
  await ready(page);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 5_000 })
    .toBe('reduced');
  await expectStill(page);
  const before = await attr(page, 'data-fox-progress');
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  expect(await attr(page, 'data-fox-progress')).toBe(before);
  expect(await attr(page, 'data-fox-facing')).toBe('camera');
  await page.screenshot({ path: `${outDir}/desktop-reduced.png` });
});
