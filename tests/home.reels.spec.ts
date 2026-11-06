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

test('home scrubs film frames with scroll', async ({ page }) => {
  await openHome(page);
  const frames = page.locator('[data-scrub-frames]');
  await expect(frames).toHaveCount(1);

  await page.evaluate(() => {
    const stage = document.querySelector('[data-snow-dive]') as HTMLElement;
    window.scrollTo(0, (stage.offsetHeight - window.innerHeight) * 0.55);
  });
  await expect
    .poll(async () => Number(await frames.getAttribute('data-frame')), { timeout: 8_000 })
    .toBeGreaterThan(20);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect
    .poll(async () => Number(await frames.getAttribute('data-frame')), { timeout: 8_000 })
    .toBeLessThan(3);
});

test('home is one landing: hero, gallery, cards, contact form', async ({ page }) => {
  await openHome(page);

  // The hero keeps one quote button and no pricing link.
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('[data-journey-beat] a[href="#contact"]')).toHaveCount(1);
  await expect(page.locator('a[href*="pricing"], a[href*="precios"]')).toHaveCount(0);

  const order = await page.evaluate(() => {
    const top = (selector: string) =>
      (document.querySelector(selector) as HTMLElement).getBoundingClientRect().top + window.scrollY;
    return [top('[data-snow-dive]'), top('[data-gallery]'), top('#services-title'), top('#contact')];
  });
  expect([...order].sort((a, b) => a - b)).toEqual(order);

  await expect(page.locator('[data-gallery-video]')).toHaveCount(4);
  await expect(page.locator('article[data-sheen]')).toHaveCount(3);

  const form = page.locator('form[name="quote"][data-netlify="true"]');
  await expect(form).toHaveCount(1);
  for (const name of ['name', 'email', 'company', 'website', 'brief', 'bot-field', 'form-name']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveCount(1);
  }
  await expect(form.locator('input[name="needs"]')).toHaveCount(4);
});

test('floating quote button stays in the corner and reaches the form', async ({ page }) => {
  await openHome(page);
  const fab = page.locator('[data-quote-fab]');
  await expect(fab).toBeVisible();
  await expect(fab).toHaveAttribute('href', '#contact');

  const corner = async () =>
    fab.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return {
        right: window.innerWidth - box.right,
        bottom: window.innerHeight - box.bottom,
      };
    });
  const atTop = await corner();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const atEnd = await corner();
  expect(atEnd.right).toBeCloseTo(atTop.right, 0);
  expect(atEnd.bottom).toBeCloseTo(atTop.bottom, 0);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await fab.click();
  await expect
    .poll(async () => page.locator('#contact').evaluate((n) => n.getBoundingClientRect().top), {
      timeout: 8_000,
    })
    .toBeLessThan(200);
});

test('a service card pre-ticks its need in the form', async ({ page }) => {
  await openHome(page);
  await page.locator('a[data-need="ad-videos"]').click();
  await expect(page.locator('input[name="needs"][value="ad-videos"]')).toBeChecked();
  await expect(page.locator('input[name="needs"][value="product-images"]')).not.toBeChecked();
});

test('the Spanish home carries the same sections and headline', async ({ page }) => {
  await openHome(page, '/es/');
  await expect(page.locator('main h1')).toContainText('No solo hacemos');
  await expect(page.locator('main h1')).toContainText('anuncios ganadores');
  await expect(page.locator('[data-quote-fab]')).toContainText('Pide presupuesto');
  await expect(page.locator('form[name="quote"]')).toHaveCount(1);
});
