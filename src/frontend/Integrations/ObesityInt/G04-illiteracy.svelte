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
        let anos = new Set();
        let almuj = [];
        let joven =[];
        
        let mapa={};
		obesity = await res.json();
		obesity.forEach( (x) => {
            
            anos.add(x.year);
                
            } 
        );
        
        analfabetismo = await res2.json();
        analfabetismo.forEach( (x) => {
          if(x.year<2017){
            
             anos.add(x.year);
            
          } 
        });
        obesity.forEach((x) => {
          console.log(Array.from(anos));
          
            if(Array.from(anos).includes(x.year)){
              mujeres.push({value:x.woman_percent});
            }else{
              console.log(Array.from(anos));
              mujeres.push(null);
            }
            
              
            });
        analfabetismo.forEach((x) => {
          if(x.year<2017){
            if(Array.from(anos).includes(x.year)){
              almuj.push({value:100-x.female_illiteracy_rate});
              joven.push({value:100-x.young_illiteracy_rate});
              
            }else{
              almuj.push(null);
              joven.push(null);
            }
          }   
              
            });

        let categorias =[];
        anos.forEach((x) => categorias.push({label:x}));
        console.log(anos);
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
      "label": "Ice Cream Sandwich",
      "value": "1000"
    },
    {
      "label": "Jelly Bean",
      "value": "5300"
    },
    {
      "label": "Kitkat",
      "value": "10500"
    },
    {
      "label": "Lollipop",
      "value": "18900"
    },
    {
      "label": "Marshmallow",
      "value": "17904"
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

