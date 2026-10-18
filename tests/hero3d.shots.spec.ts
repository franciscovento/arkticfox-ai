import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

const outDir = '/opt/cursor/artifacts/hero-3d';

/** One RGB sample from a non-interlaced PNG, so a blank canvas fails the shot. */
function pngPixel(path: string, x: number, y: number): [number, number, number] {
  const buf = readFileSync(path);
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (offset + 8 < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9] ?? 0;
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    offset += 12 + length;
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const row = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);
  let src = 0;
  for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
    const filter = raw[src] ?? 0;
    src += 1;
    for (let i = 0; i < stride; i += 1) {
      const left = i >= channels ? (row[i - channels] ?? 0) : 0;
      const up = prev[i] ?? 0;
      const ul = i >= channels ? (prev[i - channels] ?? 0) : 0;
      const value = raw[src + i] ?? 0;
      const predictor =
        filter === 1
          ? left
          : filter === 2
            ? up
            : filter === 3
              ? (left + up) >> 1
              : filter === 4
                ? (() => {
                    const p = left + up - ul;
                    const pa = Math.abs(p - left);
                    const pb = Math.abs(p - up);
                    const pc = Math.abs(p - ul);
                    return pa <= pb && pa <= pc ? left : pb <= pc ? up : ul;
                  })()
                : 0;
      row[i] = (value + predictor) & 255;
    }
    src += stride;
    if (rowIndex === y) {
      const index = x * channels;
      return [row[index] ?? 0, row[index + 1] ?? 0, row[index + 2] ?? 0];
    }
    prev.set(row);
  }
  throw new Error(`pixel ${x},${y} is outside ${path}`);
}

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

/**
 * Sit plays the clip. Head keys are identical, so the angle away from that
 * pose stays at zero. data-fox-offset stays off because nothing writes a bone.
 */
async function expectClipOnly(page: Page) {
  await expect
    .poll(async () => attr(page, 'data-fox-life'), { timeout: 4_000 })
    .toBe('clip');
  const heads: number[] = [];
  for (let i = 0; i < 6; i += 1) {
    expect(await attr(page, 'data-fox-offset')).toBe('off');
    heads.push(Number(await attr(page, 'data-fox-head')));
    await page.waitForTimeout(280);
  }
  const span = Math.max(...heads) - Math.min(...heads);
  expect(span).toBeLessThan(1);
  expect(Math.max(...heads.map((value) => Math.abs(value)))).toBeLessThan(1);
}

/** Samples the head while the walk crossfades back to Sit. */
async function waitSit(page: Page) {
  const heads: number[] = [];
  await expect
    .poll(
      async () => {
        expect(await attr(page, 'data-fox-offset')).toBe('off');
        const head = Number(await attr(page, 'data-fox-head'));
        if (!Number.isNaN(head)) heads.push(head);
        return attr(page, 'data-fox-state');
      },
      { timeout: 7_000 },
    )
    .toBe('sit');
  expect(heads.length).toBeGreaterThan(0);
  expect(Math.max(...heads.map((value) => Math.abs(value)))).toBeLessThan(1);
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
  expect(await attr(page, 'data-fox-plate')).toBe('scene');
  await expect(page.locator('[data-fox-video]')).toBeHidden();
  await expect(page.locator('[data-fox-plate-toggle]')).toBeVisible();
  await expectClipOnly(page);
  await expectStill(page);
  await page.screenshot({ path: `${outDir}/desktop-start-idle.png` });
  const woods = pngPixel(`${outDir}/desktop-start-idle.png`, 1100, 150);
  expect(woods[0]).toBeGreaterThan(200);

  const beforeJump = Number(await attr(page, 'data-fox-progress'));
  await page.evaluate(() => window.scrollTo(0, 2200));
  await expect
    .poll(async () => Number(await attr(page, 'data-fox-progress')), {
      timeout: 2_500,
    })
    .toBeGreaterThan(beforeJump);
  const afterJump = Number(await attr(page, 'data-fox-progress'));
  expect(afterJump - beforeJump).toBeLessThan(0.3);

  const forward = await waitWalk(page, 'forward');
  expect(forward).toBeGreaterThan(0.02);
  await holdScroll(page, 1);
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-walk.png` });
  await releaseScroll(page);

  await waitSit(page);
  await expectStill(page);
  await expectClipOnly(page);
  await page.screenshot({ path: `${outDir}/desktop-scroll-down-idle.png` });

  const beforeBack = Number(await attr(page, 'data-fox-progress'));
  const back = await waitWalk(page, 'back');
  expect(back).toBeLessThan(beforeBack - 0.01);
  await holdScroll(page, -1);
  await page.screenshot({ path: `${outDir}/desktop-scroll-up-walk.png` });
  await releaseScroll(page);

  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 7_000 })
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
  expect(mobileForward).toBeGreaterThan(0.02);
  await holdScroll(page, 1);
  await page.screenshot({ path: `${outDir}/mobile-scroll-05-walk.png` });
  await releaseScroll(page);
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 7_000 })
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
  expect(await attr(page, 'data-fox-life')).toBe('off');
  expect(await attr(page, 'data-fox-offset')).toBe('off');
  const head = await attr(page, 'data-fox-head');
  await page.waitForTimeout(400);
  expect(await attr(page, 'data-fox-head')).toBe(head);
  await expectStill(page);
  const before = await attr(page, 'data-fox-progress');
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(500);
  expect(await attr(page, 'data-fox-progress')).toBe(before);
  expect(await attr(page, 'data-fox-facing')).toBe('camera');
  await page.screenshot({ path: `${outDir}/desktop-reduced.png` });

  await page.goto('/hero-3d?bg=video');
  await ready(page);
  const video = page.locator('[data-fox-video]');
  await expect(video).toBeVisible();
  await expect
    .poll(async () => video.evaluate((el: HTMLVideoElement) => el.readyState), {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(1);
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(600);
  const still = await video.evaluate((el: HTMLVideoElement) => ({
    time: el.currentTime,
    paused: el.paused,
  }));
  expect(still.paused).toBe(true);
  expect(still.time).toBeLessThan(0.05);
  await page.screenshot({ path: `${outDir}/desktop-video-reduced.png` });
});

test('query param picks the plate, and the toggle needs dev or debug', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d?bg=3d');
  await expect(page.locator('[data-fox-stage]')).toHaveAttribute('data-fox-plate', 'scene');
  await expect(page.locator('[data-fox-video]')).toBeHidden();
  await expect(page.locator('[data-fox-plate-toggle]')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  await page.locator('[data-fox-bg="video"]').click();
  await expect(page.locator('[data-fox-stage]')).toHaveAttribute('data-fox-plate', 'video');
  expect(new URL(page.url()).searchParams.get('bg')).toBe('video');
  await expect(page.locator('[data-fox-video]')).toBeVisible();
  await expect(page.locator('[data-fox-video]')).toHaveAttribute(
    'src',
    '/media/snow-path-foggy-1.mp4',
  );
  await expect(page.locator('[data-fox-bg="video"]')).toHaveAttribute('aria-pressed', 'true');

  await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    if (stage) stage.dataset.foxDev = '0';
    const url = new URL(window.location.href);
    url.searchParams.delete('debug');
    history.replaceState(null, '', url);
    window.dispatchEvent(new Event('fox-plate'));
  });
  await expect(page.locator('[data-fox-plate-toggle]')).toBeHidden();

  await page.evaluate(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('debug', '1');
    history.replaceState(null, '', url);
    window.dispatchEvent(new Event('fox-plate'));
  });
  await expect(page.locator('[data-fox-plate-toggle]')).toBeVisible();

  await page.goto('/es/hero-3d?bg=video');
  await expect(page.locator('[data-fox-stage]')).toHaveAttribute('data-fox-plate', 'video');
  await expect(page.locator('[data-fox-video]')).toHaveAttribute(
    'src',
    '/media/snow-path-foggy-1.mp4',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  await page.goto('/es/hero-3d?bg=3d');
  await expect(page.locator('[data-fox-stage]')).toHaveAttribute('data-fox-plate', 'scene');
  await expect(page.locator('[data-fox-video]')).toBeHidden();
});

test('video query plays the film with the fox and holds it when sitting', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-3d?bg=video');
  await ready(page);
  expect(await attr(page, 'data-fox-plate')).toBe('video');
  await expect
    .poll(async () => attr(page, 'data-fox-state'), { timeout: 5_000 })
    .toBe('sit');
  await expectClipOnly(page);
  const video = page.locator('[data-fox-video]');
  await expect
    .poll(async () => video.evaluate((el: HTMLVideoElement) => el.readyState), {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(1);
  const start = await video.evaluate((el: HTMLVideoElement) => ({
    time: el.currentTime,
    paused: el.paused,
  }));
  expect(start.paused).toBe(true);
  expect(start.time).toBeLessThan(0.05);

  await waitWalk(page, 'forward');
  await holdScroll(page, 1);
  await expect
    .poll(
      async () =>
        video.evaluate((el: HTMLVideoElement) => ({
          time: el.currentTime,
          rate: el.playbackRate,
          paused: el.paused,
        })),
      { timeout: 4_000 },
    )
    .toMatchObject({ paused: false, rate: 1 });
  expect(
    await video.evaluate((el: HTMLVideoElement) => el.currentTime),
  ).toBeGreaterThan(0.2);
  await page.screenshot({ path: `${outDir}/desktop-video-walk.png` });
  const film = pngPixel(`${outDir}/desktop-video-walk.png`, 1200, 420);
  expect(film[0] + film[1] + film[2]).toBeGreaterThan(280);
  await releaseScroll(page);

  await waitSit(page);
  await expectClipOnly(page);
  const held = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
  await page.waitForTimeout(500);
  const heldAgain = await video.evaluate((el: HTMLVideoElement) => ({
    time: el.currentTime,
    paused: el.paused,
  }));
  expect(heldAgain.paused).toBe(true);
  expect(Math.abs(heldAgain.time - held)).toBeLessThan(0.08);
  await page.screenshot({ path: `${outDir}/desktop-video-idle.png` });

  const beforeBack = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
  await waitWalk(page, 'back');
  await holdScroll(page, -1);
  await expect
    .poll(
      async () =>
        video.evaluate((el: HTMLVideoElement, start: number) => {
          const duration = el.duration || 8;
          let delta = start - el.currentTime;
          if (delta < -duration / 2) delta += duration;
          if (delta > duration / 2) delta -= duration;
          return delta;
        }, beforeBack),
      { timeout: 4_000 },
    )
    .toBeGreaterThan(0.12);
  expect(await attr(page, 'data-fox-facing')).toBe('back');
  await page.screenshot({ path: `${outDir}/desktop-video-back.png` });
  await releaseScroll(page);
});
