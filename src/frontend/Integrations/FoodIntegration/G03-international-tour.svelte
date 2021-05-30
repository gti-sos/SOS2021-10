<script>
    import Header from '../Header.svelte';

    import {
        onMount
    } from "svelte";
	var BASE_CONTACT_API_PATH= "/api/v2";
	const paises = new Set();
	
	let dailygram = [];
	let dailycalory = [];
	let arrPaises =[];
    let data = [];
    var dict ={};

    let data2=[];
    let almond=[];
    let walnut=[];
    let pistachio=[];
	
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
        const res2 = await fetch("http://sos2021-24.herokuapp.com/api/v2/children-out-school/");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();

            data = json;
            data2= json2;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
            let e=0;
			while(e<data2.length){
                if(data2[e].country=="USA"){
                    paises.add("United_States");
                   /* almond.push(data2[e].almond);
                    walnut.push(data2[e].walnut);
                    pistachio.push(data2[e].pistachio);
                    console.log(data2[e].country);*/
                }
                else{
                    paises.add(data2[e].country);
                    /*almond.push(data2[e].almond);
                    walnut.push(data2[e].walnut);
                    pistachio.push(data2[e].pistachio);*/
                }
                e++;

            }
			while(i<data.length){
				paises.add(data[i].country);
				/*dailygram.push(data[i].dailygram);
				dailycalory.push(data[i].dailycalory);*/
				i++;
			
			}
            arrPaises = Array.from(paises);
            console.log(dict);
            for(let p=0; p<arrPaises.length;p++ ){
                if(!dict[arrPaises[p]]){
                    dict[arrPaises[p]]={almond : null, walnut: null, pistachio:null, dailygram:null, dailycalory:null}
                }
                console.log(dict);
            }
           


                let d=0;
                let d2=0;
                let paisesd = Object.keys(dict);
                
                    
                    while(d<data.length){
                    console.log(paisesd.includes(data[d].country));
                    if(paisesd.includes(data[d].country)){
                        
                        dict[data[d].country]['dailycalory']=data[d].dailycalory;
                        dict[data[d].country]['dailygram']=data[d].dailygram
                    }
                    d++
                }
                while(d2<data2.length){
                    if(paisesd.includes(data2[d2].country)){
                        
                        dict[data2[d2].country]['almond']=data2[d2].almond;
                        dict[data2[d2].country]['walnut']=data2[d2].walnut;
                        dict[data2[d2].country]['pistachio']=data2[d2].pistachio;
                        
                    }
                    else if(paisesd.includes("United_States") && data2[d2].country=="USA"){
                        dict["United_States"]['almond']=data2[d2].almond;
                        dict["United_States"]['walnut']=data2[d2].walnut;
                        dict["United_States"]['pistachio']=data2[d2].pistachio;
                
                    }
                    d2++;  
                }
                for(let p=0; p<paisesd.length; p++){
                    dailygram.push(dict[paisesd[p]]['dailygram']);
				    dailycalory.push(dict[paisesd[p]]['dailycalory']);
                    almond.push(dict[paisesd[p]]['almond']);
                    walnut.push(dict[paisesd[p]]['walnut']);
                    pistachio.push(dict[paisesd[p]]['pistachio']);
                    
                }
                console.log(dailygram);
                console.log(dailycalory);
                console.log(pistachio);
                console.log(walnut);
                
                
                
            
			//console.log(dict);
        }else{
            console.log("Error!");
        }
		loadGraph();
		
    }   
    
    onMount(getData);
  async function loadGraph(){  
  console.log(arrPaises);
   Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Consumo de azúcares y grasas/Produccion de frutos secos en 2011'
    },
    subtitle: {
        text: 'Source: <a href="https://www.nationalgeographic.com/what-the-world-eats/"> National Geographic </a>'
    },
    xAxis: {
        categories:arrPaises,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Gramos diarios',
        data: dailygram

    }, {
        name: 'Calorías diarias',
        data: dailycalory

    }, {
        name: 'Almendras',
        data: almond

    }, {
        name: 'Nueces',
        data: walnut

    }, {
        name: 'Pistachos',
        data: pistachio

    }]
});
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" ></script>
</svelte:head>

<main>
<Header/>
<br>
<br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
         Gráfica Integrada con estadisticas de la produccion de nueces
        </p>
    </figure>  
</main>


<style>
	.highcharts-figure {
	  min-width: 100%;
	  max-width:100%;
	  margin: 1em auto;
	}

	#container {
	  height: 400px;
	}

	
</style>