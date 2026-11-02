import { chromium } from 'playwright';

async function run() {
  console.log('Starting Playwright test on http://localhost:3000...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Test 1: First visit - unauthenticated
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const loginTitle = await page.locator("text='Selamat Datang Kembali'").isVisible();
  console.log('Is "Selamat Datang Kembali" visible:', loginTitle);
  if (!loginTitle) {
    throw new Error('Expected LoginPage with "Selamat Datang Kembali"!');
  }
  console.log('✓ Test 1 Passed: Unauthenticated visitor is blocked and directed to LoginPage.');

  // Test 2: Switch to Register page
  await page.click("button:has-text('Daftar sekarang')");
  await page.waitForTimeout(500);
  const registerTitle = await page.locator("text='Buat Akun Baru'").first().isVisible();
  console.log('Is "Buat Akun Baru" visible:', registerTitle);
  if (!registerTitle) {
    throw new Error('Expected RegisterPage with "Buat Akun Baru"!');
  }

  // Verify Role picker contains Pembeli, Warung, Kurir and EXCLUDES Administrator
  const buyerBtn = await page.locator("button:has-text('Pembeli')").isVisible();
  const ownerBtn = await page.locator("button:has-text('Warung')").isVisible();
  const courierBtn = await page.locator("button:has-text('Kurir')").isVisible();
  const adminBtn = await page.locator("button:has-text('Admin')").isVisible();

  if (!buyerBtn || !ownerBtn || !courierBtn) {
    throw new Error('Role picker missing buyer/owner/courier buttons!');
  }
  if (adminBtn) {
    throw new Error('Admin role must NOT be selectable in public registration!');
  }
  console.log('✓ Test 2 Passed: RegisterPage rendered cleanly; Admin role excluded from public registration.');

  // Test 3: Switch back to Login page
  await page.click("button:has-text('Masuk ke akun Anda')");
  await page.waitForTimeout(500);

  // Test 4: Quick login as Pelanggan
  console.log('Testing quick login as Pelanggan...');
  await page.click("button:has-text('budi@gmail.com')");
  await page.waitForTimeout(300);

  // Submit login
  await page.click("button:has-text('Masuk ke Akun')");
  await page.waitForTimeout(2000);

  // Verify entered main app
  const brandName = await page.locator("header").innerText();
  if (!brandName || !brandName.includes('MADURA SERBAGUNA')) {
    throw new Error('Expected MADURA SERBAGUNA header after login!');
  }

  // Verify Mode Demo is NOT in the header
  const headerContent = await page.locator('header').innerHTML();
  if (headerContent.includes('Mode Demo')) {
    throw new Error('FAIL: "Mode Demo" button still found in header!');
  }
  console.log('✓ Test 4 Passed: "Mode Demo" is completely removed from header.');

  // Verify Product Images
  const soapImg = await page.$("img[src*='sabun_batang_lifebuoy.svg']");
  if (!soapImg) {
    throw new Error('FAIL: Sabun Batang SVG not found in catalog!');
  }
  console.log('✓ Test 5 Passed: Sabun Mandi Batang correctly displays sabun_batang_lifebuoy.svg (NO hands/sanitizer).');

  const riceImg = await page.$("img[src*='beras_ramos_setra.svg']");
  const oilImg = await page.$("img[src*='minyak_goreng_pouch.svg']");
  const gasImg = await page.$("img[src*='gas_lpg_melon.svg']");
  const aquaImg = await page.$("img[src*='aqua_galon_19l.svg']");
  if (!riceImg || !oilImg || !gasImg || !aquaImg) {
    throw new Error('FAIL: One or more grocery SVGs missing in catalog!');
  }
  console.log('✓ Test 6 Passed: Rice, Cooking Oil, Gas LPG, and Aqua Gallon SVGs verified in catalog.');

  // Test Logout
  await page.click("button[title*='Logout']");
  await page.waitForTimeout(1000);

  const afterLogoutVisible = await page.locator("text='Selamat Datang Kembali'").isVisible();
  if (!afterLogoutVisible) {
    throw new Error('FAIL: Logout did not return to LoginPage!');
  }
  console.log('✓ Test 7 Passed: Logout redirected user back to LoginPage.');

  console.log('🎉 ALL E2E TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
