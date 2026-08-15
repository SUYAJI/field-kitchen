import { expect, test, type Page } from '@playwright/test';

async function enterApplication(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Field Kitchen', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Enter System' }).click();
  await expect(page.getByRole('heading', { name: 'Ingredient Library', level: 2 })).toBeVisible();
}

test('boots without application console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Field Kitchen', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter System' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('all seven views are reachable', async ({ page }) => {
  await enterApplication(page);

  const views = [
    'Pairing Field',
    'Seasonal Map',
    'Source Map',
    'Nutrient View',
    'Preparation Guide',
    'Ingredient Library',
  ];

  for (const view of views) {
    await page.getByRole('button', { name: view, exact: true }).click();
    await expect(page.getByRole('heading', { name: view, level: 2 })).toBeVisible();
  }

  await page.getByRole('button', { name: 'Return to Field Kitchen landing' }).click();
  await expect(page.getByRole('heading', { name: 'Field Kitchen', level: 1 })).toBeVisible();
});

test('changing region clears an invalid ingredient detail selection', async ({ page }) => {
  await enterApplication(page);
  await page.getByRole('button', { name: /Chanterelle.*Open ingredient details/ }).click();
  await expect(page.getByRole('complementary', { name: 'Chanterelle' })).toBeVisible();

  await page.getByRole('button', { name: 'Willamette Valley', exact: true }).click();

  await expect(page.getByRole('complementary', { name: 'Chanterelle' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Chanterelle.*Open ingredient details/ })).toHaveCount(0);
});

test('mobile ingredient dialog supports keyboard activation, Escape, and focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterApplication(page);

  const trigger = page.getByRole('button', { name: /Chanterelle.*Open ingredient details/ });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Chanterelle' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close ingredient details' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Source Map context is available through keyboard focus', async ({ page }) => {
  await enterApplication(page);
  await page.getByRole('button', { name: 'Source Map', exact: true }).click();

  const node = page.getByRole('button', { name: /Filbert Hazelnut\. Local source from Valley Orchard/ });
  await node.focus();

  await expect(node).toBeFocused();
  await expect(node.getByText('Lowland cultivation, loam soils of the Willamette basin')).toBeVisible();
});

test('Nutrient View exposes selected metric details without hover', async ({ page }) => {
  await enterApplication(page);
  await page.getByRole('button', { name: 'Nutrient View', exact: true }).click();
  await page.getByRole('button', { name: 'Mineral Profile', exact: true }).click();

  const node = page.getByRole('button', { name: /Bull Kelp\. Mineral Profile: 95/ });
  await node.click();

  await expect(node).toHaveAttribute('aria-pressed', 'true');
  await expect(node.getByText('Mineral', { exact: true })).toBeVisible();
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('Seasonal Map automatic sweep remains stopped', async ({ page }) => {
    await enterApplication(page);
    await page.getByRole('button', { name: 'Seasonal Map', exact: true }).click();

    const sweep = page.getByTestId('seasonal-sweep');
    await expect(sweep).toBeVisible();
    const initialPosition = await sweep.getAttribute('style');
    await page.waitForTimeout(2_200);

    await expect(sweep).toHaveAttribute('style', initialPosition ?? '');
  });
});

test('mobile navigation across all seven views never creates page-level overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const expectNoPageOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  };

  await expect(page.getByRole('heading', { name: 'Field Kitchen', level: 1 })).toBeVisible();
  await expectNoPageOverflow();
  await page.getByRole('button', { name: 'Enter System' }).click();

  const views = [
    'Ingredient Library',
    'Pairing Field',
    'Seasonal Map',
    'Source Map',
    'Nutrient View',
    'Preparation Guide',
  ];

  for (const view of views) {
    await page.getByRole('button', { name: view, exact: true }).click();
    await expect(page.getByRole('heading', { name: view, level: 2 })).toBeVisible();
    await expectNoPageOverflow();
  }
});
