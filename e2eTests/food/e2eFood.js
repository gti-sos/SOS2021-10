const puppeteer = require('puppeteer');
const url = 'e2eTests/food/capturas/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://sos2021-10.herokuapp.com/#/foodconsumption-stats');
  await page.screenshot({ path: url + 'FoodConsumption.png' });

 //Captura tabla
  await page.click("body > main > main > button:nth-child(7)");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'TablaFood.png' });

  //Cargar los datos en tabla
  await page.waitForSelector("body > main > main > button:nth-child(7)");
  await page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > thead > tr:nth-child(1) > td:nth-child(1) > button");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'DatosCargados.png' });

  //Añadir dato en tabla
    await page.$eval('#countryFood', el => el.value = 'Andorra');
    await page.$eval('#anyoFood', el => el.value = parseInt(2016));
    await page.$eval('#caloryFood', el => el.value = parseInt(123));
    await page.$eval('#gramFood', el => el.value = parseInt(123));
    await page.$eval('#dailycalFood', el => el.value = parseInt(54651));
    await page.$eval('#dailygramFood', el => el.value = parseInt(546546));


  await browser.close();
})();