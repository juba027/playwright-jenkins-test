import { test, expect } from '@playwright/test';

const VALID_USER = process.env.SAUCE_USER || 'standard_user';
const VALID_PWD = process.env.SAUCE_PWD || 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('success login', async ({ page }) => {
  await page.locator('#user-name').fill(VALID_USER);
  await page.locator('#password').fill(VALID_PWD);
  await page.locator('#login-button').click();

  await expect(page.locator('.app_logo')).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('locked out user shows error', async ({ page }) => {
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill(VALID_PWD);
  await page.locator('#login-button').click();

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('locked out');
});

test('invalid password shows error', async ({ page }) => {
  await page.locator('#user-name').fill(VALID_USER);
  await page.locator('#password').fill('wrong_password');
  await page.locator('#login-button').click();

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('do not match any user');
});

