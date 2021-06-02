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
     let analfabetismo = [];
     var dataSource={};
     async function getData(){
         const res = await fetch(BASE_API_PATH+"/obesity-stats");
        const res2 = await fetch("/api/v1/illiteracy");
        
        let mujeres = [];
        let pais = [];
        let almuj = [];
        let joven =[];
        
		obesity = await res.json();
		obesity.forEach( (x) => {
            
            let esp = x.country + " (" + x.year + ")";
            pais.push({label:esp});
            
            mujeres.push({value:x.woman_percent});
            
            joven.push(null);
            almuj.push(null);     
        });

        analfabetismo = await res2.json();
        analfabetismo.forEach( (x) => {
            let esp = x.country + " (" + x.year + ")";
            pais.push({label:esp});
            almuj.push({value:100-x.female_illiteracy_rate});
            joven.push({value:100-x.young_illiteracy_rate});
            mujeres.push(null);
            
        });
        
        
     
     dataSource = {
  "chart": {
    "showvalues": "0",
    "caption": "Apple's Revenue & Profit",
    "subcaption": "(2013-2016)",
    "numberprefix": "$",
    "numbersuffix": "B",
    "plottooltext": "Sales of $seriesName in $label was <b>$dataValue</b>",
    "showhovereffect": "1",
    "yaxisname": "$ (In billions)",
    "showsum": "1",
    "theme": "fusion"
  },
  "categories": [
    {
      "category": pais
    }
  ],
  "dataset": [
    {
      "seriesname": "Obesidad mujeres",
      "data": mujeres
    },
    {
      "seriesname": "Alfabetismo",
      "data": almuj
    },
    {
      "seriesname": "Juventud",
      "plottooltext": "Total profit in $label was <b>$dataValue</b>",
      "renderas": "Line",
      "data": joven
    }
  ]
};
    cargarConf();
}
onMount(getData);
var chartConfigs={};
async function cargarConf(){
    chartConfigs  = {
    type: 'stackedcolumn2dline',
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

