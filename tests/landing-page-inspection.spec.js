// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Landing Page UI/UX Inspection', () => {

  test('Landing Page - Desktop Full View', async ({ page }) => {
    // Go to landing page (without direct flag to see landing page)
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take full screenshot of landing page
    await page.screenshot({
      path: 'test-results/landing-01-desktop-full.png',
      fullPage: true
    });

    console.log('Landing page desktop view captured');
  });

  test('Landing Page - Hero Section', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Capture hero/header section
    await page.screenshot({
      path: 'test-results/landing-02-hero-section.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 600 }
    });

    // Check for main CTA button
    const ctaButton = page.locator('button:has-text("Schedule"), button:has-text("Book"), button:has-text("BOOK")').first();
    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaButton.screenshot({
        path: 'test-results/landing-03-cta-button.png'
      });
    }

    console.log('Hero section captured');
  });

  test('Landing Page - Cards and Features', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Scroll down to capture features section
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/landing-04-features-section.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 720 }
    });

    // Try to capture a card
    const card = page.locator('.MuiCard-root').first();
    if (await card.isVisible().catch(() => false)) {
      await card.screenshot({
        path: 'test-results/landing-05-feature-card.png'
      });
    }

    console.log('Features section captured');
  });

  test('Landing Page - Bottom CTA Section', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/landing-06-bottom-cta.png',
      fullPage: false
    });

    console.log('Bottom CTA section captured');
  });

});

test.describe('Landing Page - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile: Landing Page Full View', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/landing-mobile-01-full.png',
      fullPage: true
    });

    console.log('Mobile landing page captured');
  });

  test('Mobile: Landing Page Hero', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Screenshot of visible area (hero)
    await page.screenshot({
      path: 'test-results/landing-mobile-02-hero.png',
      fullPage: false
    });

    // Check CTA button on mobile
    const ctaButton = page.locator('button:has-text("Schedule"), button:has-text("Book"), button:has-text("BOOK")').first();
    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaButton.screenshot({
        path: 'test-results/landing-mobile-03-cta.png'
      });
    }

    console.log('Mobile hero captured');
  });

});

test.describe('Landing Page - UI Element Analysis', () => {

  test('Analyze Button Styling Consistency', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Find all buttons
    const buttons = page.locator('button.MuiButton-contained');
    const count = await buttons.count();

    console.log(`Found ${count} contained buttons on landing page`);

    // Screenshot each button for comparison
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible().catch(() => false)) {
        await button.screenshot({
          path: `test-results/landing-button-${i + 1}.png`
        });
      }
    }

    console.log('Button analysis complete');
  });

  test('Analyze Card Styling Consistency', async ({ page }) => {
    await page.goto('/?reset=true');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Find all cards
    const cards = page.locator('.MuiCard-root');
    const count = await cards.count();

    console.log(`Found ${count} cards on landing page`);

    // Screenshot first few cards
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      if (await card.isVisible().catch(() => false)) {
        await card.screenshot({
          path: `test-results/landing-card-${i + 1}.png`
        });
      }
    }

    console.log('Card analysis complete');
  });

});
