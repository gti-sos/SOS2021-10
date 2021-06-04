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
     let ansiedad = [];
     var dataSource={};
     async function getData(){
         const res = await fetch(BASE_API_PATH+"/obesity-stats?country=Spain");
         const res2 = await fetch(BASE_API_PATH+"/anxiety_stats");
        
        let hombres = [];
        let pais = [];
        let anhombres = [];
        
		obesity = await res.json();
		obesity.forEach( (x) => {
            let esp = x.country + " (" + x.year + ")";
            pais.push({label:esp});
            
            hombres.push({value:x.man_percent});
            
            
            anhombres.push(null);     
        });

        ansiedad = await res2.json();
        ansiedad.forEach( (x) => {
            let espe = x.country + " (" + x.year + ")";
            pais.push({label:espe});
            anhombres.push({value:x.anxiety_men});
            
            hombres.push(null);
            
        });
        
        
     
     dataSource = {
  "chart": {
    "caption": "Porcentajes de obesidad y ansiedad en los hombres en España",
    "subcaption": "Porcentaje masculino de obesidad en toda España y de ansiedad por Comunidad Autónoma.",
    "xaxisname": "Región",
    "yaxisname": "Valores",
    "numberprefix": "",
    "exportenabled": "1",
    "theme": "fusion"
  },
  "categories": [
    {
      
      "category": pais
    }
  ],
  "dataset": [
    {
      "seriesname": "Obesidad Hombres",
      "renderas": "line",
      "data": anhombres
    },
    {
      "seriesname": "Ansiedad Hombres",
      "renderas": "area",
      "showanchors": "0",
      "data": hombres
    }
  ]
};
    cargarConf();
}
onMount(getData);
var chartConfigs={};
async function cargarConf(){
    chartConfigs  = {
    type: 'mscombi2d',
   width: 1500,
   height: 700,
   dataFormat: 'json',
   dataSource
    };
}
</script>
<Header/>
<br>
  <button><a href="#/integrations">Volver a las Integraciones</a></button>
<br>

<SvelteFC {...chartConfigs} />

