<script>
  import Header from '../Header.svelte';
  import FusionCharts from 'fusioncharts';
  import Charts from 'fusioncharts/fusioncharts.charts';
  import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
  import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
  import {
        onMount
    } from "svelte";

    
    import Button from "sveltestrap/src/Button.svelte";

  // Always set FusionCharts as the first parameter
  fcRoot(FusionCharts, Charts, FusionTheme);

  var BASE_CONTACT_API_PATH= "/api/v2";
	const paises = new Set();
	let years = new Set();
	var dictGramosPais ={};
	let gramosporpais = [];
	let dataSource ={};


	var dictAnyoPais ={};
	let categoriasAnyos = [];
	
    let data = [];
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            data = json;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
			data.reverse();
			while(i<data.length){
				years.add(data[i].year);
				if(dictGramosPais[data[i].country]){
					dictGramosPais[data[i].country].push({"value":  parseInt(data[i].caloryperperson)});
				}
				else{
					dictGramosPais[data[i].country]=[{"value":  parseInt(data[i].caloryperperson)}];
				}

				if(dictAnyoPais[data[i].country]){
					dictAnyoPais[data[i].country].push(data[i].year);
				}
				else{
					dictAnyoPais[data[i].country]=[parseInt(data[i].year)];
				}
				i++;
			}
			console.log(dictGramosPais);
			
			
        }else{
            console.log("Error!");
        }
		let paises= Object.keys(dictGramosPais);
		for(let p=0; p<paises.length; p++){
			if(dictAnyoPais[paises[p]]){
				let anyos=dictAnyoPais[paises[p]].sort();
				let a=0;
					while(a<Array.from(years).length){
						let ord =Array.from(years).sort();
						if(!anyos.includes(ord[a])){
							dictGramosPais[paises[p]].splice(a, 0, null);
						}
						a++
					}
			}
		}
    
    for(let a=0; a< years.size; a++){
      let anyos= Array.from(years).sort();
      categoriasAnyos.push({"label" : anyos[a].toString()});

    }
   
	  console.log(categoriasAnyos);
		Object.entries(dictGramosPais).forEach(([key, value]) => {
			
				gramosporpais.push({"seriesname": key , "data": value})
			});
      console.log(gramosporpais);
    dataSource = {
    "chart": {
      "caption": "Consumo de azúcares y grasas por año",
      "subcaption": "",
      "xaxisname": "Años",
      "yaxisname": "Gramos por persona",
      "formatnumberscale": "1",
      "plottooltext": "<b>$dataValue</b> gramos por persona en <b>$seriesName</b> en el año $label",
      "theme": "fusion",
      "drawcrossline": "1"
    },
    "categories": [
      {
        "category":categoriasAnyos
      }
    ],
    "dataset": gramosporpais
  };
  console.log("datos cargados")
  cargarConf();
    }  
    onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
      chartConfigs = {
     
        type: 'mscolumn2d',
        width: 1300,  
        height: 600,
        dataFormat: 'json',
        dataSource
      };
    }
    
    
  
  
  </script>
  <main>
    <Header/>
    <br>
    <br>
    <Button outline color="secondary" onclick="window.location.href='#/foodconsumption-stats'">Volver</Button>
    <div style="margin:auto;"> 
      <SvelteFC {...chartConfigs}/>
      
    </div>
   
  </main>
