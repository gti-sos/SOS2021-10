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

    var dataSource={};
    ;
    var BASE_CONTACT_API_PATH= "/api/v2";
    fcRoot(FusionCharts, Charts, FusionTheme);
    let anyos=[];
    let categorias=[];
    let dicFood={};
    let dicPoverty={};
    let dataPoverty=[];
    let valuesFood=[];
    let valuesPoverty=[];
    let anyosOrdenados=[];

async function getData(){
    const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?country=Germany");
    const res2 = await fetch("https://endpoint-poverty-risks.herokuapp.com/api/v1?c=Alemania");
        if(res.ok){
            console.log("Ok."); 
            const json = await res.json();
            const json2 = await res2.json();
            dataPoverty.push(json2);
           console.log(json);
            let i=0;
            while(i<json.length){
                
                anyos.push(json[i].year);
                dicFood[json[i].year]=  json[i].gramperperson
                i++;
            }
            let e=0;
            while(e<dataPoverty.length){
                
                anyos.push(dataPoverty[e].year)
                dicPoverty[dataPoverty[e].year]=  dataPoverty[e].percentage_risk_of_poverty
                e++;
                console.log(dataPoverty[e])
            }
            anyosOrdenados = anyos.sort();
            anyosOrdenados.forEach(x=>{
                
                if(Object.keys(dicFood).includes(x.toString())){
                    valuesFood.push({value: dicFood[x]})
                }
                else{
                    valuesFood.push({value: null})
                }

            });
            
            anyosOrdenados.forEach(x=>{
                if(Object.keys(dicPoverty).includes(x.toString())){
                    valuesPoverty.push({value: dicPoverty[x]})
                }
                else{
                    valuesPoverty.push({value: null})
                }

            });
            anyosOrdenados.forEach(x=> categorias.push({label: x.toString()}));


            
            console.log(categorias);
            console.log(valuesFood);
        }else{
            console.log("Error!");
        }

        dataSource = {
  "chart": {
    "caption": "Integración con riesgos de pobreza",
    "subcaption": "Datos Alemania",
    "yaxisname": "Cantidad",
    "formatnumberscale": "0",

    "snumbersuffix": "%",
    "showvalues": "0",
    "plottooltext": "<b>$dataValue</b> $seriesName en $label",
    "theme": "fusion"
  },
  "categories": [
    {
      "category": categorias
    }
  ],
  "dataset": [
    {
      "seriesname": "Porcenaje de riesgo de pobreza",
      "data": valuesPoverty
    },
    {
      "seriesname": "Gramos por persona",
      "plottooltext": "<b>$dataValue</b> $seriesName en $label",
      "renderas": "Line",
      "data": valuesFood
    }
  ]
};
    cargarConf();
      }
      onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
      chartConfigs = {
        type: 'stackedcolumn2dline',
        width: 1200,
        height: 500,
        dataFormat: 'json',
        dataSource
    };
  }
    
</script>
<Header/>
<br>
<Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
<SvelteFC {...chartConfigs} />
