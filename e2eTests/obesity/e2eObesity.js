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
  page.click("body > main > main > button > a");
  await page.waitForTimeout(100);
  page.click("body > main > main > div > ul:nth-child(7) > button:nth-child(6)");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: guarda+'Integracion_Externa1.png' });
  
   //Obesidad Home
   page.click("body > main > main > nav > button > span");
   await page.waitForTimeout(100);
   page.click("body > main > main > nav > div > ul > li:nth-child(2) > a");
   await page.waitForTimeout(100);
   await page.screenshot({ path: guarda+'Obesidad_Home.png' });

  //Tabla Obesity
  page.click("body > main > main > button.btn.btn-outline-warning");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+'Obesidad_Tabla.png' });

  //Cargar Datos
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > thead > tr:nth-child(1) > td:nth-child(1) > button");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+'Cargar_Datos.png' });

  //Añadir Datos
  await page.waitForSelector("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr");
  await page.$eval("#pais", el=>el.value='prueba');
  await page.$eval("#anyo", el=>el.value=parseInt(999));
  await page.$eval("#hombreper", el=>el.value=parseFloat(9.9));
  await page.$eval("#mujerper", el=>el.value=parseFloat(9.9));
  await page.$eval("#total", el=>el.value=parseInt(999));
  await page.waitForTimeout(50);
  await page.screenshot({ path: guarda+'Añadir_Datos.png' });

  //Dato Añadido
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(6) > button");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+'Dato_Cargado.png' });
  
  await browser.close();
})();