import { expect, test, type Page } from '@playwright/test';

async function openKitchen(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Field Kitchen', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Choose ingredients' }).click();
  await expect(page.getByRole('heading', { name: 'What do you have?', level: 2 })).toBeVisible();
}

const everyday = (page: Page) => page.getByRole('list', { name: 'Everyday ingredients' });
const tile = (page: Page, name: string) => everyday(page).getByRole('button', { name: new RegExp(`^${name}`) });
const card = (page: Page, name: string) => page.getByRole('article', { name });

test('landing explains the product without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByText('Make more of what’s in your kitchen.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose ingredients' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('selecting ingredients produces a ready idea with method, basis and sources', async ({ page }) => {
  await openKitchen(page);
  await tile(page, 'Potatoes').click();
  await tile(page, 'Cabbage').click();

  await expect(tile(page, 'Potatoes')).toHaveAttribute('aria-pressed', 'true');
  const colcannon = card(page, 'Colcannon');
  await expect(colcannon.getByText('Ready to make')).toBeVisible();
  await expect(colcannon.getByRole('heading', { name: 'Method' })).toBeVisible();
  await expect(colcannon.getByText('Established preparation')).toBeVisible();
  await expect(colcannon.getByRole('link', { name: /Colcannon · Wikipedia/ })).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Colcannon');
});

test('removing an ingredient updates the recommendation', async ({ page }) => {
  await openKitchen(page);
  await tile(page, 'Potatoes').click();
  await tile(page, 'Cabbage').click();
  await expect(card(page, 'Colcannon').getByText('Ready to make')).toBeVisible();

  await page.getByRole('button', { name: 'Remove Cabbage' }).click();

  await expect(card(page, 'Colcannon').getByText('Needs 1 more')).toBeVisible();
  await expect(tile(page, 'Cabbage')).toHaveAttribute('aria-pressed', 'false');
});

test('different combinations lead with different ideas', async ({ page }) => {
  await openKitchen(page);
  const firstCardTitle = page.locator('#ideas article h3').first();

  await page.getByRole('button', { name: 'Potatoes, cabbage & onion' }).click();
  await expect(firstCardTitle).toContainText('Colcannon');

  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: 'Apples, kale & hazelnuts' }).click();
  await expect(firstCardTitle).toContainText('Kale, apple & hazelnut salad');
  await expect(card(page, 'Kale, apple & hazelnut salad').getByText('Curated by Field Kitchen')).toBeVisible();
});

test('a missing ingredient can be added from the idea itself', async ({ page }) => {
  await openKitchen(page);
  await tile(page, 'Potatoes').click();
  const soup = card(page, 'Leek & potato soup');
  await soup.getByRole('button', { name: /Leek & potato soup/ }).click();
  await soup.getByRole('button', { name: '+ Leeks to your ingredients' }).click();

  await expect(soup.getByText('Ready to make')).toBeVisible();
  await expect(tile(page, 'Leeks')).toHaveAttribute('aria-pressed', 'true');
});

test('an idea can be copied as plain text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openKitchen(page);
  await tile(page, 'Carrots').click();

  const pickles = card(page, 'Refrigerator pickled carrots with dill');
  await expect(pickles.getByText('Ready to make')).toBeVisible();
  await pickles.getByRole('button', { name: 'Copy idea' }).click();
  await expect(pickles.getByRole('status')).toHaveText('Copied to clipboard as plain text.');

  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Refrigerator pickled carrots with dill');
  expect(copied).toContain('Preparation concept, not a tested recipe');
  expect(copied).toContain('not shelf-stable');
  expect(copied).toContain('https://extension.umn.edu/preserve-your-own-food/pickling-basics');
});

test('ingredients can be selected with the keyboard', async ({ page }) => {
  await openKitchen(page);
  const potatoes = tile(page, 'Potatoes');
  await potatoes.focus();
  await page.keyboard.press('Space');
  await expect(potatoes).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(potatoes).toHaveAttribute('aria-pressed', 'false');
});

test('mobile ingredient dialog supports keyboard activation, Escape, and focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openKitchen(page);
  await page.getByRole('button', { name: 'Ingredients', exact: true }).click();

  const trigger = page.getByRole('button', { name: 'Stinging Nettle. Open ingredient details.' });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Stinging Nettle' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Stinging Nettles, blanched (Northern Plains Indians)')).toBeVisible();
  await expect(dialog.getByText('Not shown: no verified regional availability source yet.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close ingredient details' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('sources and seasons views show their references', async ({ page }) => {
  await openKitchen(page);
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'How the data works', level: 2 })).toBeVisible();
  await expect(page.getByRole('link', { name: /FoodData Central/ })).toHaveAttribute('href', 'https://fdc.nal.usda.gov/');

  await page.getByRole('button', { name: 'Seasons', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Seasons', level: 2 })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Now/ })).toBeVisible();
});

test('mobile workflow reaches ideas and never creates page-level overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const expectNoPageOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  };

  await page.goto('/');
  await expectNoPageOverflow();
  await openKitchen(page);
  await tile(page, 'Mushrooms').click();
  await tile(page, 'Onions').click();
  await expectNoPageOverflow();

  await page.getByRole('button', { name: /See ideas/ }).click();
  await expect(card(page, 'Mushroom duxelles').getByText('Ready to make')).toBeInViewport();

  for (const view of ['Ingredients', 'Seasons', 'Sources', 'Kitchen']) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: new RegExp(`^${view}`) }).click();
    await expectNoPageOverflow();
  }
});
