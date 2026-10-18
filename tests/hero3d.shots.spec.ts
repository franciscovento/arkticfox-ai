import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = '/opt/cursor/artifacts/hero-3d';

async function attr(page: Page, name: string) {
  return page.locator('[data-fox-stage]').getAttribute(name);
}

async function ready(page: Page) {
  await page.locator('[data-fox-stage] h1').waitFor();
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

/** Scrolls every frame so the 400ms idle does not sit the fox mid-turn. */
async function waitWalk(page: Page, facing: 'forward' | 'back') {
  const direction = facing === 'forward' ? 1 : -1;
  const result = await page.evaluate(async (dir) => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    if (!stage) return { facing: '', align: 0, state: '', progress: 0 };
    const started = performance.now();
    let facingNow = '';
    let align = 0;
    let state = '';
    while (performance.now() - started < 5000) {
      window.scrollBy(0, dir * 90);
      await new Promise((resolve) => setTimeout(resolve, 16));
      facingNow = stage.dataset.foxFacing ?? '';
      align = Number(stage.dataset.foxAlign ?? 0);
      state = stage.dataset.foxState ?? '';
      if (facingNow === (dir > 0 ? 'forward' : 'back') && align > 0.98 && state === 'walk') {
        break;
      }
    }
    return {
      facing: facingNow,
      align,
      state,
      progress: Number(stage.dataset.foxProgress ?? 0),
    };
  }, direction);
  expect(result.facing).toBe(facing);
  expect(result.align).toBeGreaterThan(0.98);
  expect(result.state).toBe('walk');
  return result.progress;
}

async function holdScroll(page: Page, direction: 1 | -1) {
  await page.evaluate((dir) => {
    const view = window as Window & { __foxHold?: number };
    window.clearInterval(view.__foxHold);
    view.__foxHold = window.setInterval(() => window.scrollBy(0, dir * 40), 60);
  }, direction);
}

async function releaseScroll(page: Page) {
  await page.evaluate(() => {
    const view = window as Window & { __foxHold?: number };
    window.clearInterval(view.__foxHold);
  });
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
      { timeout: 8_000 },
    )
    .toBe(true);
  expect(await attr(page, 'data-fox-state')).toMatch(/sit|reduced/);
}

test.beforeAll(async () => {
  await mkdir(outDir, { recursive: true });
});

test.describe.configure({ mode: 'serial', timeout: 120_000 });

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

  await scrubTo(page, 0.2);
  const forward = await waitWalk(page, 'forward');
  expect(forward).toBeGreaterThan(0.2);
  await holdScroll(page, 1);
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-walk.png` });
  await releaseScroll(page);

  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 3_000 })
    .toBe('sit');
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-idle.png` });

  const beforeBack = Number(await attr(page, 'data-fox-progress'));
  const back = await waitWalk(page, 'back');
  expect(back).toBeLessThan(beforeBack - 0.01);
  await holdScroll(page, -1);
  await page.screenshot({ path: `${outDir}/desktop-scroll-up-walk.png` });
  await releaseScroll(page);

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

  await scrubTo(page, 0.15);
  const mobileForward = await waitWalk(page, 'forward');
  expect(mobileForward).toBeGreaterThan(0.15);
  await holdScroll(page, 1);
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-walk.png` });
  await releaseScroll(page);
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
