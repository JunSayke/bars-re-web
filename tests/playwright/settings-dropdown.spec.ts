import { test, expect } from '@playwright/test';

test('settings menu toggles timestamps and syllable counts', async ({ page }) => {
  await page.goto('/editor/workspace');

  // ensure initial state: timestamps and syllables visible
  await expect(page.getByText('00:00')).toBeVisible();
  await expect(page.getByText('10')).toBeVisible();

  // open settings
  const btn = page.getByLabel('Open settings');
  await btn.click();
  await expect(page.getByLabel('Toggle timestamps')).toBeVisible();
  await expect(page.getByLabel('Toggle syllable counts')).toBeVisible();

  // toggle off timestamps and syllables
  await page.getByLabel('Toggle timestamps').click();
  await page.getByLabel('Toggle syllable counts').click();

  // assert they are hidden now
  await expect(page.getByText('00:00')).toBeHidden();
  await expect(page.locator('.editor-line').first().getByText('10')).toBeHidden();

  // logout from sidebar should work and redirect to /login
  await page.getByText('Workspace').click();
  await page.goto('/settings');
  await page.getByText('Logout').click();
  await expect(page.getByText('Signed out')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

});
