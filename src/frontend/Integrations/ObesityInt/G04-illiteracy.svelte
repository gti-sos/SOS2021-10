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
    "caption": "Android Distribution for our app",
    "subcaption": "For all users in 2017",
    "showpercentvalues": "1",
    "defaultcenterlabel": "Android Distribution",
    "aligncaptionwithcanvas": "0",
    "captionpadding": "0",
    "decimals": "1",
    "plottooltext": "<b>$percentValue</b> of our Android users are on <b>$label</b>",
    "centerlabel": "# Users: $value",
    "theme": "fusion"
  },
  
  "data": [
    {
      "label": "Obesidad Mujeres",
      "value": mujeres
    },
    {
      "label": "Analfabetismo",
      "value": almuj
    },
    {
      "label": "Jovenes",
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
   width: 600,
   height: 400,
   dataFormat: 'json',
   dataSource
    };
}
</script>
<Header/>
<br>

<SvelteFC {...chartConfigs} />

