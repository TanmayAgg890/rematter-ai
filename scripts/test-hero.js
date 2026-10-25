const { chromium } = require('C:/Users/DEEAGG/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');

async function runHeroTests() {
  console.log('🚀 Starting Playwright verification of ReMatter AI Hero Section...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let failed = false;
  const assert = (condition, msg) => {
    if (!condition) {
      console.error(`❌ FAILED: ${msg}`);
      failed = true;
    } else {
      console.log(`✅ PASSED: ${msg}`);
    }
  };

  try {
    // ── 1. Desktop Test (1280 x 800) ──────────────────────────────────────────
    console.log('\n--- Test 1: Desktop Viewport (1280x800) ---');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check Eyebrow
    const eyebrow = page.locator('text=AI-Powered Circular Materials Platform');
    assert(await eyebrow.isVisible(), 'Eyebrow label is visible');

    // Check Headline
    const headline = page.locator('h1');
    const headlineText = await headline.innerText();
    assert(headlineText.includes('Your Waste.'), 'Headline contains "Your Waste."');
    assert(headlineText.includes('Possibility.'), 'Headline contains "Possibility."');

    // Check Possibility italic lavender style
    const italicSpan = headline.locator('span.italic');
    assert(await italicSpan.isVisible(), 'Lavender italic "Possibility." is visible');
    const italicClasses = await italicSpan.getAttribute('class');
    assert(italicClasses.includes('text-lavender-accent') && italicClasses.includes('italic'), 'Possibility has text-lavender-accent and italic classes');

    // Check Description
    const description = page.locator('text="Turn everyday waste into something useful."');
    assert(await description.isVisible(), 'Reduced single-line description is visible');
    const descBox = await description.boundingBox();
    console.log(`Description box dimensions on desktop: width=${descBox.width}px, height=${descBox.height}px`);
    // A single line of text with line-height ~1.5 at 18-20px is around 24-32px tall. Multi-line would be 50px+.
    assert(descBox.height < 45, 'Description is rendered on a single line on desktop');

    // Check CTA Buttons
    const heroSection = page.locator('section').first();
    const scanBtn = heroSection.locator('a[href="#waste-input"]:has-text("Start a Waste Scan")');
    assert(await scanBtn.isVisible(), 'CTA Button 1: "Start a Waste Scan" is visible');

    const exploreBtn = heroSection.locator('a[href="/explore"]:has-text("Explore Materials")');
    assert(await exploreBtn.isVisible(), 'CTA Button 2: "Explore Materials" is visible');

    // Check Trust Points
    const trust1 = page.locator('text=Deterministic Safety Gates');
    const trust2 = page.locator('text=Transparent Feasibility Scoring');
    const trust3 = page.locator('text=Zero Hallucinated Recyclers');
    assert(await trust1.isVisible(), 'Trust point 1 is visible');
    assert(await trust2.isVisible(), 'Trust point 2 is visible');
    assert(await trust3.isVisible(), 'Trust point 3 is visible');

    // Check No Horizontal Scroll on Desktop
    const overflowDesktop = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    assert(overflowDesktop, 'No horizontal overflow on desktop');

    // ── 2. Button Functionality ────────────────────────────────────────────────
    console.log('\n--- Test 2: Button Interaction ---');
    await scanBtn.click();
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Page scroll position after clicking "Start a Waste Scan": ${scrollY}px`);
    assert(scrollY > 200, 'Page smooth-scrolled towards #waste-input');

    // Test Navigation to /explore
    await exploreBtn.click();
    await page.waitForURL('**/explore*');
    assert(page.url().includes('/explore'), 'Successfully navigated to /explore via "Explore Materials"');

    // ── 3. Tablet Viewport (768 x 1024) ─────────────────────────────────────────
    console.log('\n--- Test 3: Tablet Viewport (768x1024) ---');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    assert(await page.locator('h1').isVisible(), 'Headline is visible on tablet');
    assert(await page.locator('text="Turn everyday waste into something useful."').isVisible(), 'Description is visible on tablet');
    const overflowTablet = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    assert(overflowTablet, 'No horizontal overflow on tablet');

    // ── 4. Mobile Viewport (375 x 667) ──────────────────────────────────────────
    console.log('\n--- Test 4: Mobile Viewport (375x667) ---');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const heroMobile = page.locator('section').first();
    assert(await heroMobile.locator('h1').isVisible(), 'Headline is visible on mobile');
    assert(await heroMobile.locator('text="Turn everyday waste into something useful."').isVisible(), 'Description is visible on mobile');
    assert(await heroMobile.locator('a[href="#waste-input"]:has-text("Start a Waste Scan")').isVisible(), 'Start Waste Scan is visible on mobile');
    assert(await heroMobile.locator('a[href="/explore"]:has-text("Explore Materials")').isVisible(), 'Explore Materials is visible on mobile');

    const overflowMobile = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    assert(overflowMobile, 'No horizontal overflow on mobile');

    // Verify stacking of CTA buttons on mobile
    const scanBoxMobile = await heroMobile.locator('a[href="#waste-input"]:has-text("Start a Waste Scan")').boundingBox();
    const exploreBoxMobile = await heroMobile.locator('a[href="/explore"]:has-text("Explore Materials")').boundingBox();
    assert(exploreBoxMobile.y > scanBoxMobile.y, 'CTA buttons stack vertically on mobile screens');

    console.log('\n🏁 All Playwright Hero section checks completed.');
  } catch (err) {
    console.error('Unexpected error during testing:', err);
    failed = true;
  } finally {
    await browser.close();
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL HERO SECTION ACCEPTANCE TESTS PASSED!');
  }
}

runHeroTests();
