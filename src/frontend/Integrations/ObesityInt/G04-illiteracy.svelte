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
         const res = await fetch(BASE_API_PATH+"/obesity-stats?country=Spain");
        const res2 = await fetch("/api/v1/illiteracy");
        
        let mujeres = [];
      
        let almuj = [];
        let joven =[];
        
        let mapa={};
        obesity = await res.json();
        obesity.forEach((x) => {
          if(x.year==2014){
              mujeres.push(x.woman_percent);
          }
              
            });
        analfabetismo = await res2.json();
        analfabetismo.forEach( (x) => {
          if(x.year==2014){
            
             almuj.push(100-x.female_illiteracy_rate);
              joven.push(100-x.young_illiteracy_rate);
            
          } 
        });
        
      
        console.log(mujeres);
        console.log(almuj);
        
     
     dataSource = {
  "chart": {
    "caption": "Pocentaje de mujeres con obesidad, analfabetas y jóvenes en España 2014",
    
    "showpercentvalues": "1",
    "defaultcenterlabel": "España 2014",
    "aligncaptionwithcanvas": "0",
    "captionpadding": "0",
    "decimals": "1",
    
    "centerlabel": "Porcentaje: $value %",
    "theme": "fusion"
  },
  
  "data": [
    {
      "label": "Obesidad",
      "value": mujeres
    },
    {
      "label": "Analfabetismo",
      "value": almuj
    },
    {
      "label": "Jóvenes",
      "value": joven
    }
  ]
};
    cargarConf();
}
onMount(getData);
var chartConfigs={};
async function cargarConf(){
    chartConfigs  = {
    type: 'doughnut2d',
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

