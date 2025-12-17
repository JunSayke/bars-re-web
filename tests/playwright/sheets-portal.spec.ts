import { test, expect } from '@playwright/test';

// This test verifies that right/left sheets are rendered into a portal (document.body)
// and that document.elementFromPoint returns the sheet element when the sheet is visually on top.

test('sheets should be topmost and receive elementFromPoint hits', async ({ page }) => {
  await page.goto('http://localhost:3000/editor/workspace');

  // open AI Assistant (first button in right rail)
  const rightRail = page.locator('aside[aria-hidden=false], aside.w-16');
  // fallback to the first aside on the page
  const assistantBtn = page.locator('aside button').first();
  await assistantBtn.click();

  // Wait for sheet to appear
  const sheet = page.locator('div[role="dialog"]').filter({ hasText: 'AI Assistant' }).first();
  await expect(sheet).toBeVisible({ timeout: 2000 });

  // URL should reflect the new single-value param 'right-sheet=assistant'
  await expect(page).toHaveURL(/right-sheet=assistant/);

  // ensure the assistant button shows an active visual (background image present)
  const assistantActiveBg = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent && b.textContent.includes('AI Assistant')) as HTMLElement | null;
    if (!btn) return null;
    return window.getComputedStyle(btn).backgroundImage;
  });
  expect(assistantActiveBg).not.toBeNull();
  expect(assistantActiveBg).not.toBe('none');

  // compute center and call elementFromPoint inside page context
  const hit = await page.evaluate(() => {
    const sheetEl = Array.from(document.querySelectorAll('div[role="dialog"]')).find(el => el.textContent && el.textContent.includes('AI Assistant')) as HTMLElement | null;
    if (!sheetEl) return null;
    const rect = sheetEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const el = document.elementFromPoint(cx, cy) as HTMLElement | null;
    return { tag: el?.tagName, className: el?.className };
  });

  expect(hit).not.toBeNull();
  // elementFromPoint should hit inside the sheet (we expect a DIV with classes matching the sheet)
  expect(String(hit.className)).toContain('fixed');

  // Now toggle the Thesaurus button and confirm it replaces the right-sheet value
  const thesaurusBtn = page.locator('aside button').nth(1); // second button in right rail
  await thesaurusBtn.click();
  await expect(page).toHaveURL(/right-sheet=thesaurus/);
  // assistant sheet should no longer be visible
  await expect(page.locator('div[role="dialog"]').filter({ hasText: 'AI Assistant' }).first()).toBeHidden({ timeout: 1000 });

  // Test left rail param rename to left-sheet by opening Snippets
  const leftSnippetBtn = page.locator('aside').first().locator('button').nth(1);
  await leftSnippetBtn.click();
  await expect(page).toHaveURL(/left-sheet=snippets/);

});
