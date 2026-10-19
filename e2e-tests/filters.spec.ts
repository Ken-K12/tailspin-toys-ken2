import { test, expect, type Page } from '@playwright/test';

const visibleItems = (page: Page) => page.locator('[data-testid="game-item"]:not([hidden])');

test.describe('Game filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows filter controls with accessible labels', async ({ page }) => {
    await expect(page.getByTestId('game-filters')).toBeVisible();
    await expect(page.getByRole('group', { name: 'カテゴリー' })).toBeVisible();
    await expect(page.getByLabel('パブリッシャー')).toBeVisible();
  });

  test('filters by one category', async ({ page }) => {
    const total = await visibleItems(page).count();
    await page.locator('[data-testid^="filter-category-"]').first().check();
    const filtered = await visibleItems(page).count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(total);
  });

  test('multiple categories widen the result', async ({ page }) => {
    const boxes = page.locator('[data-testid^="filter-category-"]');
    await boxes.nth(0).check();
    const one = await visibleItems(page).count();
    await boxes.nth(1).check();
    expect(await visibleItems(page).count()).toBeGreaterThan(one);
  });

  test('filters by publisher and combines with category', async ({ page }) => {
    const select = page.getByTestId('filter-publisher');
    await select.selectOption({ index: 1 });
    const byPublisher = await visibleItems(page).count();
    expect(byPublisher).toBeGreaterThan(0);
    await page.locator('[data-testid^="filter-category-"]').first().check();
    expect(await visibleItems(page).count()).toBeLessThanOrEqual(byPublisher);
  });

  test('reset restores all games', async ({ page }) => {
    const total = await visibleItems(page).count();
    await page.getByTestId('filter-publisher').selectOption({ index: 1 });
    await page.locator('[data-testid^="filter-category-"]').first().check();
    expect(await visibleItems(page).count()).toBeLessThan(total);
    await page.getByTestId('filter-reset').click();
    await expect(visibleItems(page)).toHaveCount(total);
    await expect(page.getByTestId('filter-empty')).toBeHidden();
  });

  test('checkbox is keyboard operable', async ({ page }) => {
    const box = page.locator('[data-testid^="filter-category-"]').first();
    await box.focus();
    await page.keyboard.press('Space');
    await expect(box).toBeChecked();
  });
});
