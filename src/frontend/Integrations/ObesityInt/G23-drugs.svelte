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
     let drogas = [];
     let drogas1 = [];
     var dataSource={};
     async function getData(){
         const res = await fetch(BASE_API_PATH+"/obesity-stats?country=Spain");
         const res2 = await fetch("https://sos2021-23.herokuapp.com/api/v1/du-stats?country=Spain");
         const res3 = await fetch("https://sos2021-23.herokuapp.com/api/v1/du-stats?country=Germany");
         
        
        let hom = [];
        let anyo = [];
        let muertos = [];
        let pais = [];
        drogas = await res2.json();
		drogas.forEach( (x) => {
            
            anyo.push({label:x.year});
            pais.push({label:x.country});
            muertos.push({value:x.dudead});
           hom.push(null)
        
               
        });
        drogas1 = await res3.json();
        drogas1.forEach( (x) => {
            pais.push({label:x.country});

            anyo.push({label:x.year});
            
            muertos.push({value:x.dudead});
           hom.push(null)
        
               
        });

    obesity = await res.json();
		obesity.forEach( (x) => {
                        pais.push({label:x.country});

            anyo.push({label:(x.year).toString()});
            
            hom.push({value:(x.man_percent).toString()});
           
        
               
        });

		
        console.log(anyo);
        console.log(muertos);
        
        
        
     
     dataSource = {
        "chart": {
    "caption": "Obesidad en hombres y muertes por drogas",
    "yaxisname": "Valores",
    "numbersuffix": "%",
    "yaxismaxvalue": "2",
    "plottooltext": "$seriesName was mentioned <b>$dataValue</b> times on Twitter in $label",
    "theme": "fusion"
  },
  "categories": [
    {
      "category": anyo
    }
  ],
  "dataset": [
    {
      "seriesname": "Obesidad Hombres",
      "data": hom   
    },
    {
      "seriesname": "Muerte por drogas",
      "data": muertos
    }
  ]

};
    cargarConf();
}
onMount(getData);
var chartConfigs={};
async function cargarConf(){
    chartConfigs  = {
    type: 'mssplinearea',
   width: 1400,
   height: 500,
   dataFormat: 'json',
   dataSource
    };
}
</script>
<Header/>
<br>

<SvelteFC {...chartConfigs} />

