const puppeteer = require('puppeteer');
const url='http://localhost:10000/#/sanity-stats';
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'e2eTests/sanity/Home.png'});

    console.log("home")

    const [response] = await Promise.all([
        page.click("body > main > main > button#tablaDatos.btn.btn-outline-warning"), 
    ]);
    console.log("tabla")
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2eTests/sanity/tabla.png'});


    const [response1] = await Promise.all([
        page.click("body > main > main > div > div.modal.show.d-block > div.modal-dialog.modal-xl > div.modal-content > div.modal-body > main > div.table-responsive > table.table > thead > tr.svelte-ycj1m8 > td.svelte-ycj1m8 > button#cargarDatos.btn.btn-secondary"), 
    ]);

    console.log("datosmostrados")
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2eTests/sanity/tablaDatos.png'});

    var filas=(await page.$$("body > main > main > div > div.modal.show.d-block > div.modal-dialog.modal-xl > div.modal-content > div.modal-body > main > div.table-responsive > table.table > tbody > tr.svelte-ycj1m8")).length;

    if(filas!=11){
        console.error("Los datos no se han cargado bien")
        process.exit(1);
    }

    await page.$eval("#pais", el=>el.value='prueba');
    await page.$eval("#año", el=>el.value=parseInt(888));
    await page.$eval("#sanidad", el=>el.value=parseInt(888));
    await page.$eval("#medicos", el=>el.value=parseInt(888));
    await page.$eval("#camas", el=>el.value=parseInt(888));

    await page.waitForTimeout(30);
    await page.screenshot({ path: 'e2eTests/sanity/tablaDatosCasiAñadido.png'});


    const [response1n] = await Promise.all([
        page.click("body > main > main > div > div.modal.show.d-block > div.modal-dialog.modal-xl > div.modal-content > div.modal-body > main > div.table-responsive > table.table > tbody > tr.svelte-ycj1m8 > td.svelte-ycj1m8 > button#subirDato.btn.btn-secondary"), 
    ]);

    console.log("datosubido")
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2eTests/sanity/tablaDatosAñadido.png'});
    

    const [response1b] = await Promise.all([
        page.click("body > main > main > div > div.modal.show.d-block > div.modal-dialog.modal-xl > div.modal-content > div.modal-body > main > div.table-responsive > table.table > tbody > tr.svelte-ycj1m8 > td.svelte-ycj1m8 > button#borrarChina2011.btn.btn-secondary"), 
    ]);

    console.log("borrado")
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2eTests/sanity/Datoborrado.png'});






    const [response1ce] = await Promise.all([
        page.click("body > main > main > div > div.modal.show.d-block > div.modal-dialog.modal-xl > div.modal-content > div.modal-footer > button#cerrar.btn.btn-secondary"), 
    ]);

    console.log("cerrado")
    await page.waitForTimeout(1000);


    const [response2] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main >button#canvas.btn.btn-outline-warning"),
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    console.log("can vas")
    
    await page.waitForTimeout(2000);
        
    await page.screenshot({ path: 'e2eTests/sanity/canvas.png'});

    const [response3] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);

    const [response4] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#integraciones.btn.btn-outline-warning"), 
    ]);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'e2eTests/sanity/integraciones.png'});


    const [response5] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san1.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion1.png'});

    const [response6] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);


    const [response52] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san2.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion2.png'});

    const [response62] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response53] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san3.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion3.png'});

    const [response63] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response54] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san4.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion4.png'});

    const [response64] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response55] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san5.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion5.png'});

    const [response65] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response56] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san6.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion6.png'});

    const [response66] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response57] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san7.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion7.png'});

    const [response67] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response58] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san8.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion8.png'});

    const [response68] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response59] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san9.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion9.png'});

    const [response69] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);
    const [response510] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > div > ul > a#san10.btn.btn-secondary"), 
    ]);
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2eTests/sanity/integracion10.png'});

    const [response610] = await Promise.all([
        page.waitForNavigation(),
        page.click("body > main > main > button#volver"), 
    ]);
    await page.waitForTimeout(1000);



    console.log("end")


    await browser.close();
})();