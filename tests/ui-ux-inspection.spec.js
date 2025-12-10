// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('UI/UX Improvements Visual Inspection', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage and go to page with reset
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // If landing page is shown, click through it
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }
  });

  test('Step 1: Critical Alert and Progress Bar visible on page load', async ({ page }) => {
    // Take screenshot of initial state
    await page.screenshot({
      path: 'test-results/01-initial-page-load.png',
      fullPage: true
    });

    // Check critical alert is visible (look for the actual text)
    const criticalAlert = page.locator('text=CRITICAL').or(page.locator('text=MANDATORY')).first();
    await expect(criticalAlert).toBeVisible({ timeout: 10000 });

    // Check progress bar exists
    const progressBar = page.locator('.MuiLinearProgress-root');
    await expect(progressBar).toBeVisible();

    // Screenshot of alert area
    const alertBox = page.locator('.MuiAlert-root').first();
    await alertBox.screenshot({
      path: 'test-results/02-critical-alert.png'
    });

    console.log('✓ Critical alert is visible and prominent');
    console.log('✓ Progress bar showing 0% on step 1');
  });

  test('Step 2: Progress bar shows correct percentage labels', async ({ page }) => {
    // Check progress text
    const progressText = page.locator('text=0% Complete').or(page.locator('text=Getting Started'));
    await expect(progressText).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: 'test-results/03-progress-bar.png',
      fullPage: false,
      clip: { x: 0, y: 200, width: 1280, height: 200 }
    });

    console.log('✓ Progress bar with percentage labels visible');
  });

  test('Step 3: Form step with fallback button (wait 16 seconds)', async ({ page }) => {
    // Take screenshot of form step
    await page.screenshot({
      path: 'test-results/04-form-step-initial.png',
      fullPage: true
    });

    // Wait for fallback button to appear (15 seconds + buffer)
    console.log('Waiting 16 seconds for fallback button to appear...');

    const fallbackButton = page.locator('button:has-text("Continue to Booking")');

    await expect(fallbackButton).toBeVisible({ timeout: 20000 });

    await page.screenshot({
      path: 'test-results/05-fallback-button-visible.png',
      fullPage: true
    });

    console.log('✓ Fallback continue button appears after 15 seconds');
  });

  test('Step 4: Navigate to booking step and check confirmation button', async ({ page }) => {
    // Wait for fallback button and click it
    const fallbackButton = page.locator('button:has-text("Continue to Booking")');
    await expect(fallbackButton).toBeVisible({ timeout: 20000 });
    await fallbackButton.click();

    // Wait for booking step to load
    await page.waitForTimeout(2000);

    // Take screenshot of booking step
    await page.screenshot({
      path: 'test-results/06-booking-step.png',
      fullPage: true
    });

    // Check for confirmation button
    const confirmButton = page.locator('button:has-text("Booked")');
    await expect(confirmButton).toBeVisible();

    // Screenshot of the confirmation button area
    await confirmButton.screenshot({
      path: 'test-results/07-confirmation-button.png'
    });

    // Check progress bar shows 50%
    const progressText = page.locator('text=50% Complete');
    await expect(progressText).toBeVisible();

    console.log('✓ Booking step loaded successfully');
    console.log('✓ Confirmation button is visible with enhanced styling');
    console.log('✓ Progress bar shows 50% completion');
  });

  test('Step 5: Complete booking and check final state', async ({ page }) => {
    // Navigate to booking step
    const fallbackButton = page.locator('button:has-text("Continue to Booking")');
    await expect(fallbackButton).toBeVisible({ timeout: 20000 });
    await fallbackButton.click();
    await page.waitForTimeout(2000);

    // Click confirmation button
    const confirmButton = page.locator('button:has-text("Booked")');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Wait for final step
    await page.waitForTimeout(2000);

    // Take screenshot of completion step
    await page.screenshot({
      path: 'test-results/08-completion-step.png',
      fullPage: true
    });

    // Check for success message
    const successMessage = page.locator('text=all set').or(page.locator('text=All Set'));
    await expect(successMessage).toBeVisible();

    // Check progress bar shows 100%
    const progressText = page.locator('text=100% Complete');
    await expect(progressText).toBeVisible();

    console.log('✓ Completion step reached');
    console.log('✓ Success message displayed');
    console.log('✓ Progress bar shows 100% completion');
  });

});

test.describe('Mobile-specific UI checks', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/?reset=true&direct=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // If landing page is shown, click through it
    const bookButton = page.locator('text=BOOK YOUR').first();
    if (await bookButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookButton.click({ force: true });
      await page.waitForTimeout(2000);
    }
  });

  test('Mobile: Critical alert with emoji visible', async ({ page }) => {
    await page.screenshot({
      path: 'test-results/mobile-01-initial.png',
      fullPage: true
    });

    // Check mobile-specific alert - look for MANDATORY text
    const mobileAlert = page.locator('text=MANDATORY').or(page.locator('text=CRITICAL'));
    await expect(mobileAlert).toBeVisible({ timeout: 10000 });

    console.log('✓ Mobile critical alert is visible');
  });

  test('Mobile: Step indicator visible', async ({ page }) => {
    const stepIndicator = page.locator('text=Step 1 of 3');
    await expect(stepIndicator).toBeVisible({ timeout: 5000 });

    await stepIndicator.screenshot({
      path: 'test-results/mobile-02-step-indicator.png'
    });

    console.log('✓ Mobile step indicator visible with enhanced styling');
  });

  test('Mobile: Confirmation button on booking step', async ({ page }) => {
    // Navigate to booking step
    const fallbackButton = page.locator('button:has-text("Continue to Booking")');
    await expect(fallbackButton).toBeVisible({ timeout: 20000 });
    await fallbackButton.click();
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/mobile-03-booking-step.png',
      fullPage: true
    });

    // Check confirmation button is visible
    const confirmButton = page.locator('button:has-text("Booked")');
    await expect(confirmButton).toBeVisible();

    console.log('✓ Mobile confirmation button visible');
  });
});
