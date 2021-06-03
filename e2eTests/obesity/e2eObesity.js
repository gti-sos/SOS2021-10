const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.informatica.us.es');
  await page.screenshot({ path: 'e2eTests/example.png' });

  await browser.close();
})();