const puppeteer = require('puppeteer');
const guarda = 'e2eTests/obesity/capturasObe/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1200 });
  //Home
  await page.goto('http://sos2021-10.herokuapp.com');
  await page.screenshot({ path: guarda+'Home.png' });

  //Info
  page.click("body > main > main > div > div > div > h4 > a");
  await page.waitForTimeout(100);
  await page.screenshot({ path: guarda+'Info.png' });
  
  //Integraciones
  page.click("body > main > main > div > button:nth-child(9)");
  await page.waitForTimeout(100);
  await page.screenshot({ path: guarda+'Integraciones.png' });
  
  //Integracion Obesity
  page.click("body > main > main > div > ul:nth-child(7) > button:nth-child(1)");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: guarda+'Integracion_Natality.png' });

  //Integracion API Externa
  page.click("body > main > main > div > ul:nth-child(7) > button:nth-child(6)");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: guarda+'Integracion_Externa1.png' });
  
  //atras
  
  
  /*await page.click("body > main > main > button.btn.btn-outline-warning");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: guarda+'obesityhome.png' });
  await page.click("body > main > main > button.btn.btn-outline-warning");*/

  
  await browser.close();
})();