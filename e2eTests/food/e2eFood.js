const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://sos2021-10.herokuapp.com');

  await page.click("body > main > main > button.btn.btn-outline-warning");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'e2eTests/capturas/obesity.png' });

  await browser.close();
})();