<script>
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
import Button from "sveltestrap/src/Button.svelte";

import Header from './Header.svelte';
    import {
        onMount
    } from "svelte";

    fcRoot(FusionCharts, Charts, FusionTheme);

    var NewSpain={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
 
    var country = [];
    var health=[];
    var dataSource={};
    var chartConfigs={};
async function loadGraph(){
    
    chartConfigs = {
   type: 'msarea',
   width: 1200,
   height: 600,
   dataFormat: 'json',
   dataSource
};

  }
  
	let years = new Set();
	var dictGramosPais ={};
	var dictObedic ={};
	let gramosporanyo =[];
	let obesidadhym =[];
  let sanitydic={};

  async function getData(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            country = json;
            let i=0;
            while(i<country.length){
				        years.add(country[i].year);
                NewSpain=country[i];
                if(sanitydic[NewSpain.year]){
                  sanitydic[NewSpain.year].push(NewSpain.health_expenditure_in_percentage);
                }else{
                  sanitydic[NewSpain.year]=[parseFloat(NewSpain.health_expenditure_in_percentage)];
                }
                i++;
            }
            Object.entries(sanitydic).forEach(([key, value]) => {
              let c=0;
              let sum=0;
              //console.log(value);
              while(c<value.length){
                sum+=value[c];
                c++;
              }
              console.log(sum/value.length)
                health.push(sum/value.length);
            });
        }else{
            console.log("Error!");
        }
        const res2 = await fetch("/api/v2/obesity-stats");
        if(res2.ok){
            console.log("Ok.");
            const json = await res2.json();
            let obe = json;
            let i=0;
            while(i<obe.length){
             years.add(obe[i].year);
			
			 if(dictObedic[obe[i].year]){
					dictObedic[obe[i].year]+=parseInt(((parseFloat(obe[i].man_percent)+parseFloat(obe[i].woman_percent))/100)*parseInt(obe[i].total_population));
				}
				else{
					dictObedic[obe[i].year]=parseInt(((parseFloat(obe[i].man_percent)+parseFloat(obe[i].woman_percent))/100)*parseInt(obe[i].total_population));
				}
                i++;
            }
			
        }else{
            console.log("Error!");
        }
        const res3 = await fetch("/api/v2/foodconsumption-stats");
        if(res3.ok){
            console.log("Ok.");
            const json = await res3.json();
            let dataFood = json;
            let i=0;
			dataFood.reverse();
            while(i<dataFood.length){
             years.add(dataFood[i].year);
			 
			 if(dictGramosPais[dataFood[i].year]){
					dictGramosPais[dataFood[i].year]+=parseInt(dataFood[i].caloryperperson);
				}
				else{
					dictGramosPais[dataFood[i].year]=parseInt(dataFood[i].caloryperperson);
				}
                i++;
            }

			
        }else{
            console.log("Error!");
        }
		
			let e=0;
			while(e<Array.from(years).length){
				let anyo=Array.from(years).sort();
				
				if(anyo[e] in dictGramosPais){
					gramosporanyo.push(dictGramosPais[anyo[e]]);
					e++
				}
				else{
					
					gramosporanyo.push(null);
					e++
				}
			}
			
			let o=0;
			while(o<Array.from(years).length){
				let anyo=Array.from(years).sort();
				
				if(anyo[o] in dictObedic){
					obesidadhym.push(dictObedic[anyo[o]]);
					o++
				}
				else{
					
					obesidadhym.push(null);
					o++
				}
			}
      var categorias =[];
      var valoresHealth =[];
      var valoresObesity =[];
      var valoresFood =[];
      Array.from(years).sort().forEach(x => categorias.push({label: x.toString()}));
		
        console.log(Array.from(years).sort());
        health.forEach(x=> valoresHealth.push({value: x}));
        gramosporanyo.forEach(x=> valoresFood.push({value: x}));
        obesidadhym.forEach(x=> valoresObesity.push({value: x}));

        dataSource = {
      "chart": {
        "caption": "Análisis de datos en conjunto",
        "subcaption": "Análisis mundial",
        "numbersuffix": "",
        "showsum": "1",
        "plottooltext": "$label:  <b>$dataValue</b> $seriesName",
        "theme": "fusion",
        "drawcrossline": "1"
      },
      "categories": [
        {
          "category": categorias
        }
      ],
      "dataset": [
        {
          "seriesname": "Gasto en sanidad",
          "data": valoresHealth
        },
        {
          "seriesname": "Calorías",
          "data": valoresFood
        },
        {
          "seriesname": "Población obesa",
          "data": valoresObesity
        }
      ]
    };
      loadGraph();
    }   
   
    onMount(getData);
</script>
<Header/>

<br>
<Button outline color="secondary" onclick="window.location.href='#/info'">Volver</Button>
<SvelteFC {...chartConfigs} />