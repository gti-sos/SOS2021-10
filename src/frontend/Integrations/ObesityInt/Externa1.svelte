<script>
    import Header from '../Header.svelte';
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    import {
        onMount
    } from "svelte";
    fcRoot(FusionCharts, Charts, FusionTheme);
     var BASE_API_PATH= "/api/v2";

     let obesity = [];
     let covid = [];
     var dataSource={};
     async function getData(){
         const res = await fetch(BASE_API_PATH+"/obesity-stats?country=Germany");
         const res2 = await fetch("https://restcountries.eu/rest/v2/name/Germany");
         
        
        let poblacion = [];
        let anyo = [];
        let muertos = [];
        
        obesity = await res.json();
		obesity.forEach( (x) => {
            
            anyo.push({label:(x.year).toString()});
            
            poblacion.push({value:x.total_population});
           
        
               
        });

		covid = await res2.json();
		covid.forEach( (x) => {
            
            anyo.push({label:"2021"});
            
            poblacion.push({value:x.population});
           
        
               
        });
        console.log(anyo);
        
        
        
     
     dataSource = {
        "chart": {
            "caption": "Población en Alemania",
    "subcaption": "Por año",
    "yaxisname": "Nº de habitantes",
    "numvisibleplot": "8",
    "labeldisplay": "auto",
    "theme": "fusion"
        },
        "categories": [
    {
      "category": anyo
    }
  ],
  "dataset": [
    {
      "seriesname": "poblacion",
      "data": poblacion
    }
  ]
};
    cargarConf();
}
onMount(getData);
var chartConfigs={};
async function cargarConf(){
    chartConfigs  = {
    type: 'scrollcolumn2d',
   width: 1400,
   height: 600,
   dataFormat: 'json',
   dataSource
    };
}
</script>
<Header/>
<br>

<SvelteFC {...chartConfigs} />

