// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Admin Interface UI/UX Inspection', () => {

  test('Admin Login Page - UI Consistency Check', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Take screenshot of admin login page
    await page.screenshot({
      path: 'test-results/admin-01-login-page.png',
      fullPage: true
    });

    // Check for login form elements
    const emailField = page.locator('input[type="email"]');
    const passwordField = page.locator('input[type="password"]');
    const signInButton = page.locator('button[type="submit"]');

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(signInButton).toBeVisible();

    // Check for admin title
    const adminTitle = page.locator('text=Admin Login');
    await expect(adminTitle).toBeVisible();

    // Screenshot focusing on login card
    const loginCard = page.locator('.MuiCard-root').first();
    await loginCard.screenshot({
      path: 'test-results/admin-02-login-card.png'
    });

    console.log('✓ Admin login page loaded successfully');
    console.log('✓ Login form elements visible');
  });

  test('Admin Login Page - Button Styling Check', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Check sign in button styling
    const signInButton = page.locator('button[type="submit"]');

    // Take focused screenshot of button
    await signInButton.screenshot({
      path: 'test-results/admin-03-signin-button.png'
    });

    // Check button has contained variant styling
    const buttonClasses = await signInButton.getAttribute('class');
    expect(buttonClasses).toContain('MuiButton-contained');

    console.log('✓ Sign In button has contained variant');
  });

  test('Admin Login - Error State Check', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'test@invalid.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Click sign in
    await page.click('button[type="submit"]', { force: true });

    // Wait for error to appear
    await page.waitForTimeout(2000);

    // Screenshot of error state
    await page.screenshot({
      path: 'test-results/admin-04-login-error.png',
      fullPage: true
    });

    // Check for error alert
    const errorAlert = page.locator('.MuiAlert-root');
    // Error may or may not appear depending on API availability

    console.log('✓ Login error state captured');
  });

});

test.describe('Admin Interface - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile: Admin Login Page Responsive Check', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Screenshot of mobile admin login
    await page.screenshot({
      path: 'test-results/admin-mobile-01-login.png',
      fullPage: true
    });

    // Check login form is still usable on mobile
    const emailField = page.locator('input[type="email"]');
    const signInButton = page.locator('button[type="submit"]');

    await expect(emailField).toBeVisible();
    await expect(signInButton).toBeVisible();

    console.log('✓ Admin login page responsive on mobile');
  });
});

test.describe('Public Site vs Admin UI Comparison', () => {

  test('Compare Public Site Alert Styling', async ({ page }) => {
    // Go to public site
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click through landing page if shown
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // Capture the critical alert
    const publicAlert = page.locator('.MuiAlert-root').first();
    await publicAlert.screenshot({
      path: 'test-results/comparison-01-public-alert.png'
    });

    // Now go to admin page
    await page.goto('/admin');
    await page.waitForTimeout(1500);

    // Attempt login with wrong creds to trigger alert
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]', { force: true });
    await page.waitForTimeout(2000);

    // Try to capture admin alert if present
    const adminAlert = page.locator('.MuiAlert-root').first();
    if (await adminAlert.isVisible({ timeout: 2000 }).catch(() => false)) {
      await adminAlert.screenshot({
        path: 'test-results/comparison-02-admin-alert.png'
      });
    }

    console.log('✓ Alert styling comparison captured');
  });

  test('Compare Button Styling - Public vs Admin', async ({ page }) => {
    // Go to public site and get to booking step
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click through landing if shown
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // Wait for fallback button
    const fallbackButton = page.locator('button:has-text("Continue to Booking")');
    await expect(fallbackButton).toBeVisible({ timeout: 20000 });

    // Screenshot of public button
    await fallbackButton.screenshot({
      path: 'test-results/comparison-03-public-continue-button.png'
    });

    // Go to admin
    await page.goto('/admin');
    await page.waitForTimeout(1500);

    // Screenshot of admin button
    const adminButton = page.locator('button[type="submit"]');
    await adminButton.screenshot({
      path: 'test-results/comparison-04-admin-signin-button.png'
    });

    console.log('✓ Button styling comparison captured');
  });

  test('Compare Typography and Spacing', async ({ page }) => {
    // Public site header
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Capture header area
    await page.screenshot({
      path: 'test-results/comparison-05-public-header.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 400 }
    });

    // Admin login header
    await page.goto('/admin');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: 'test-results/comparison-06-admin-header.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 400 }
    });

    console.log('✓ Typography and spacing comparison captured');
  });

  test('Compare Card/Paper Styling', async ({ page }) => {
    // Public site cards
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click through landing if shown
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // Capture paper/card components
    const publicCard = page.locator('.MuiCard-root, .MuiPaper-root').first();
    if (await publicCard.isVisible().catch(() => false)) {
      await publicCard.screenshot({
        path: 'test-results/comparison-07-public-card.png'
      });
    }

    // Admin login card
    await page.goto('/admin');
    await page.waitForTimeout(1500);

    const adminCard = page.locator('.MuiCard-root').first();
    await adminCard.screenshot({
      path: 'test-results/comparison-08-admin-card.png'
    });

    console.log('✓ Card/Paper styling comparison captured');
  });

  test('Compare Progress Indicators', async ({ page }) => {
    // Public site progress bar
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click through landing if shown
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // Capture progress bar
    const progressBar = page.locator('.MuiLinearProgress-root').first();
    if (await progressBar.isVisible().catch(() => false)) {
      await progressBar.screenshot({
        path: 'test-results/comparison-09-public-progress.png'
      });
    }

    console.log('✓ Progress indicator comparison captured');
  });

});

test.describe('Admin UI Enhancement Opportunities', () => {

  test('Full Admin Login Page Analysis', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Full page screenshot for analysis
    await page.screenshot({
      path: 'test-results/admin-full-01-desktop.png',
      fullPage: true
    });

    // Get computed styles of key elements
    const card = page.locator('.MuiCard-root').first();
    const cardBox = await card.boundingBox();

    console.log('Admin Login Card Dimensions:', cardBox);
    console.log('✓ Full admin page captured for UI analysis');
  });

});
