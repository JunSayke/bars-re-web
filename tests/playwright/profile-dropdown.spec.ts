import { test, expect } from '@playwright/test';

test('profile menu opens and contains links', async ({ page }) => {
  await page.goto('/editor/workspace');
  const btn = page.getByRole('button', { name: 'Open profile menu' });
  await btn.click();
  await expect(page.getByText('My Profile')).toBeVisible();
  await expect(page.getByText('Account Settings')).toBeVisible();
  await expect(page.getByText('Logout')).toBeVisible();

  // active UI state: button should reflect open state (aria-expanded and active class)
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(btn).toHaveClass(/ring-2/);

  // clicking logout should call server logout and redirect to /login
  await page.getByText('Logout').click();
  // toast should appear and we should be redirected to /login
  await expect(page.getByText('Signed out')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

});
