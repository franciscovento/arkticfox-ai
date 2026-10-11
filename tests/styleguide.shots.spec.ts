import { expect, test } from '@playwright/test';

const widths = [390, 768, 1440] as const;

for (const width of widths) {
  test(`styleguide screenshot ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/styleguide');
    await page.locator('h1').waitFor();
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.evaluate(async () => {
      const height = document.body.scrollHeight;
      for (let y = 0; y <= height; y += 500) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, 0);
    });
    await expect
      .poll(async () => {
        const opacities = await page.locator('[data-reveal]').evaluateAll((nodes) =>
          nodes.map((node) => getComputedStyle(node).opacity),
        );
        return opacities.length === 3 && opacities.every((value) => value === '1');
      })
      .toBe(true);
    await page.screenshot({
      path: `shots/styleguide-${width}.png`,
      fullPage: true,
    });
  });
}

test('reduced motion shows reveals and disables snow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/styleguide');
  await expect(page.locator('[data-snow]')).toHaveAttribute('data-snow', 'disabled');
  const opacity = await page
    .locator('[data-reveal]')
    .first()
    .evaluate((element) => getComputedStyle(element).opacity);
  expect(opacity).toBe('1');
});
