const puppeteer = require('puppeteer');
const guarda = 'e2eTests/obesity/capturasObe/';
var id=0;
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1200 });
  //Home
  await page.goto('http://sos2021-10.herokuapp.com/');
  await page.screenshot({ path: guarda+(id++)+'_Home.png' });

  //Info
  page.click("body > main > main > div > div > div > h4 > a");
  await page.waitForTimeout(100);
  await page.screenshot({ path: guarda+(id++)+'_Info.png' });
  console.log("Home");
  

  //Integraciones
  page.click("body > main > main > div > button:nth-child(9)");
  await page.waitForTimeout(100);
  await page.screenshot({ path: guarda+(id++)+'_Integraciones.png' });
  

  //Integracion API Externa
  page.click("body > main > main > div > ul:nth-child(7) > button:nth-child(6)");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: guarda+(id++)+'_Integracion_Externa1.png' });
  
   //Obesidad Home
   page.click("body > main > main > nav > button > span");
   await page.waitForTimeout(100);
   page.click("body > main > main > nav > div > ul > li:nth-child(2) > a");
   await page.waitForTimeout(100);
   await page.screenshot({ path: guarda+(id++)+'_Obesidad_Home.png' });
   console.log("Obesity");
  //Tabla Obesity
  page.click("body > main > main > button.btn.btn-outline-warning");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Obesidad_Tabla.png' });

  //Cargar Datos
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > thead > tr:nth-child(1) > td:nth-child(1) > button");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Cargar_Datos.png' });
  console.log("Cargar Datos");
  //Añadir Datos
  await page.waitForSelector("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr");
  await page.focus('#pais');
  await page.keyboard.type("Prueba");
  await page.focus('#anyo');
  await page.keyboard.type("999");
  await page.focus('#hombreper');
  await page.keyboard.type("25");
  await page.focus('#mujerper');
  await page.keyboard.type("26");
  await page.focus('#total');
  await page.keyboard.type("10000000");
  await page.waitForTimeout(50);
  await page.screenshot({ path: guarda+(id++)+'_Añadir_Datos.png' });

  //Dato Añadido
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(6) > button");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Dato_Cargado.png' });

  //Borrar primer dato
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr:nth-child(2) > td:nth-child(6) > button");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Borrar_Argentina.png' });

  //Filtrar
  page.click("#btn-right");
  await page.waitForSelector("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.mt-3 > div > div.popover-body");
  
  await page.click("#filtroPais");
  await page.focus('#filPais');
  await page.keyboard.type("Prueba");
  await page.focus('#filAnyoFrom');
  await page.keyboard.type("999");
  await page.focus('#filAnyoTo');
  await page.keyboard.type("999");
  await page.focus('#filMan');
  await page.keyboard.type("999");
  await page.focus('#filWoman');
  await page.keyboard.type("999");
  await page.focus('#filTotal');
  await page.keyboard.type("999");
  await page.waitForTimeout(50);

  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Cargar_Filtrado.png' });

  //Filtrado
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.mt-3 > div > div.popover-body > ul > button.btn.btn-secondary");
  await page.waitForTimeout(500);
  await page.screenshot({ path: guarda+(id++)+'_Filtrado.png' });
  
  //Grafica
  page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-footer > button");
  await page.waitForTimeout(500);
  page.click("body > main > main > button:nth-child(11)");
  await page.waitForTimeout(2000);
  await page.goBack();
  await page.waitForTimeout(2000);
  await page.goForward();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: guarda+(id++)+'_Grafica.png' });
  console.log("Gráfica");

  await browser.close();
})();