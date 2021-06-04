
<script>
    import Header from '../Header.svelte';
   import Button from "sveltestrap/src/Button.svelte";
   import {
       onMount
   } from "svelte";
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';

    fcRoot(FusionCharts, Charts, FusionTheme);
    var dataSource={};
   var BASE_CONTACT_API_PATH= "/api/v2";
   let gramperperson=0;
   let caloryperperson=0;
  
   let paisesCiudad =[];
   let muertes=[];
   let gramosdiarios=[];
   let caloriasdiarias=[];
   async function getData(){
       console.log("Fetching data...");
       const res2 = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats/Germany/2011");
       const res = await fetch("https://disease.sh/v2/gov/Germany");
       if(res.ok){
           console.log("Ok.");
           const json = await res.json();
           const json2 = await res2.json();

           gramosdiarios.push({value: json2.dailygram});
           caloriasdiarias.push({value: json2.dailycalory});
           //console.log(json);
           console.log(gramperperson);
           paisesCiudad.push({label: json2.country})
           let i =0;
           muertes.push({value: null});
           while(i<json.length){
               if(json[i].province == "Berlin" || json[i].province == "Bremen" ||json[i].province == "Branden­burg"){
                paisesCiudad.push({label: json[i].province})
                muertes.push({value: json[i].deaths});
                gramosdiarios.push({value: null});
                caloriasdiarias.push({value: null});
               }
               i++;
           }
          
           
       }else{
           console.log("Error!");
       }
console.log(paisesCiudad);
       dataSource = {
  "chart": {
    "caption": "Integración API externa 2",
    "placevaluesinside": "1",
    "showvalues": "0",
    "plottooltext": "<b>$dataValue</b> $seriesName en $label ",
    "theme": "fusion"
  },
  "categories": [
    {
      "category": paisesCiudad
    }
  ],
  "dataset": [
    {
      "seriesname": "Muertes",
      "data": muertes
    },
    {
      "seriesname": "Gramos diarios",
      "data": gramosdiarios
    },
    {
      "seriesname": "Calorías diarias",
      "data": caloriasdiarias
    }
  ]
};
cargarConf();
   }

onMount(getData)
var chartConfigs={};
    async function cargarConf(){
        chartConfigs = {
            type: 'msbar2d',
            width: 1200,
            height: 600,
            dataFormat: 'json',
            dataSource
        };
}
</script>

<Header/>
  
<br>
<Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
<SvelteFC {...chartConfigs} />