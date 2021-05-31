<script>
   import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
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
    let numberofarrivals=[];
    let numberofdepartures=[];
    
	
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
        const res2 = await fetch("https://sos2021-03.herokuapp.com/api/integration/international-tourisms?year=2011");

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
                    
                    numberofarrivals.push({x: data2[e].country, y:data2[e].numberofarrivals});
                    numberofdepartures.push({x: data2[e].country, y:data2[e].numberofdepartures});
                e++;

            }
			while(i<data.length){
				  dailycalory.push({x: data[i].country, y:data[i].dailycalory});
          dailygram.push({x: data[i].country, y:data[i].dailygram});
				 
				i++;
			
			}             
      console.log(numberofdepartures)
                 
			//console.log(dict);
        }else{
            console.log("Error!");
        }
		loadGraph();
		
    }   

    onMount(getData);
    async function loadGraph(){  
    
 var chart = JSC.Chart('chartDiv', {
        debug: true,
        type: 'horizontalColumn',
        title_label_text: 'Integración con turismo internacional',
        yAxis: { label_text: 'Cantidad' },
        xAxis_label_text: 'Países',
        series: [
          {
            name: 'Número de aterrizajes',
            points: numberofarrivals
          },
          {
            name: 'Número de salidas',
            points: numberofdepartures
          },
          {
            name: 'Calorías diarias',
            points: dailycalory
          },
          {
            name: 'Gramos diarios',
            points: dailygram
          }
        ]
      });
    }
</script>
<svelte:head>
  <script src="https://code.jscharting.com/latest/jscharting.js"></script>
</svelte:head>
<main>
  <Header/>
  <br>
  <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
  <div id="chartDiv" ></div>
</main>