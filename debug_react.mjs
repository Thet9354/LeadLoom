import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`PAGE CRASH: ${error.message} - \n${error.stack}`);
  });

  console.log("Navigating to login...");
  await page.goto('http://localhost:5173/login');
  
  // Fill sign up
  await page.fill('input[type="email"]', 'debug_user_10@example.com');
  await page.fill('input[type="password"]', 'Password123!');
  
  // click 2nd button (Sign Up)
  const buttons = await page.$$('button');
  await buttons[1].click();
  
  await page.waitForTimeout(2000);
  
  console.log("Going to dashboard...");
  await page.goto('http://localhost:5173/dashboard');
  
  await page.waitForTimeout(3000); // Wait for React to crash
  
  await browser.close();
})();
