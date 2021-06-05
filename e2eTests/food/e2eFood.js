const puppeteer = require('puppeteer');
const url = 'e2eTests/food/capturas/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:10000/#/foodconsumption-stats');
  await page.screenshot({ path: url + 'FoodConsumption.png' });

 //Captura tabla
  await page.click("body > main > main > button:nth-child(7)");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'TablaFood.png' });

  //Añadir dato en tabla
  console.log("Mete datos");
  await page.focus('#paisFood');
  await page.keyboard.type("Andorra");

  await page.focus('#anyoFood');
  await page.keyboard.type("2019");

  await page.focus('#caloryFood');
  await page.keyboard.type("123");

  await page.focus('#gramFood');
  await page.keyboard.type("123");

  await page.focus('#dailycalFood');
  await page.keyboard.type("4321");

  await page.focus('#dailygramFood');
  await page.keyboard.type("4321");

  console.log("Datos metidos");

    await page.screenshot({ path: url + 'datosAñadir.png' });
    await page.waitForTimeout(1000); 
    await page.click("#addFood");

    await page.waitForTimeout(2000);  

    await page.screenshot({ path: url + 'DatosAñadidos.png'});

    //Carga datos iniciales
    await page.click('body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > thead > tr:nth-child(1) > td:nth-child(1) > button');
    await page.waitForTimeout(1000); 
    await page.screenshot({ path: url + 'DatosInicialesCargados.png'});
  await browser.close();
})();