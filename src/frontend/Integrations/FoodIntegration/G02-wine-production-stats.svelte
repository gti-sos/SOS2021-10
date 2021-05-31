<script>
    import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";

    
    import Button from "sveltestrap/src/Button.svelte";
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    const paises = new Set()

    var dataSource={};
    let dailygram = [];
	  let dailycalory = [];
	  let arrPaises =[];
    let data = [];
    var dict ={};
    let categorias=[];
    let data2=[];
    let importion=[];
    let exportion=[];
    var BASE_CONTACT_API_PATH= "/api/v2";
    console.log("Fetching data...");
        
    // Always set FusionCharts as the first parameter
    fcRoot(FusionCharts, Charts, FusionTheme);
    async function getData(){
      const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
      const res2 = await fetch(BASE_CONTACT_API_PATH + "/wine-production-stats");
        
        if(res.ok){
          console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();
            data = json;
            data2= json2;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
            let e=0;
			while(e<data2.length){
                if(data2[e].country=="USA"){
                    paises.add("United_States");
                }
                else{
                    paises.add(data2[e].country);
                    
                }
                e++;

            }
			while(i<data.length){
				paises.add(data[i].country);
				 
				i++;
			
			}
      arrPaises = Array.from(paises);
            console.log(dict);
            for(let p=0; p<arrPaises.length;p++ ){
                if(!dict[arrPaises[p]]){
                    dict[arrPaises[p]]={importion : null, exportion: null, dailygram:null, dailycalory:null}
                }
                console.log(dict);
            }
           


                let d=0;
                let d2=0;
                let paisesd = Object.keys(dict);
                
                    
                    while(d<data.length){
                    console.log(paisesd.includes(data[d].country));
                    if(paisesd.includes(data[d].country)){
                        
                        dict[data[d].country]['dailycalory']=data[d].dailycalory;
                        dict[data[d].country]['dailygram']=data[d].dailygram
                    }
                    d++
                }
                while(d2<data2.length){
                    if(paisesd.includes(data2[d2].country)){
                        
                        dict[data2[d2].country]['importion']=data2[d2].import;
                        dict[data2[d2].country]['exportion']=data2[d2].export;
                        
                        
                    }
                    else if(paisesd.includes("United_States") && data2[d2].country=="USA"){
                        dict["United_States"]['importion']=data2[d2].import;
                        dict["United_States"]['exportion']=data2[d2].export;
                       
                
                    }
                    d2++;  
                }
                for(let p=0; p<paisesd.length; p++){
                    dailygram.push({value: dict[paisesd[p]]['dailygram']});
				            dailycalory.push({value:dict[paisesd[p]]['dailycalory']});
                    importion.push({value: dict[paisesd[p]]['importion']});
                    exportion.push({value: dict[paisesd[p]]['exportion']});
                  
                }
                console.log(importion);
                let ddds=0;
                console.log(arrPaises.length);
        
                while(ddds<arrPaises.length){
                  
                  categorias.push({label: arrPaises[ddds]});
                  ddds++;
                }
                console.log(categorias);
               
        }else{
            console.log("Error!");
        }
        
        dataSource = {
      "chart": {
        "caption": "Integración con producción de vino",
        "yaxisname": "Cantidad",
        "subcaption": "Datos de 2011",
        "drawcrossline": "1",
        "numbersuffix": "",
        "plottooltext": "$dataValue $seriesName en $label",
        "theme": "fusion"
      },
      "categories": [
        {
          "category": categorias
          
        }
      ],
      "dataset": [
        {
          "seriesname": "Gramos diarios",
          "data": dailygram
        },
        {
          "seriesname": "Calorías diarias",
          "data": dailycalory
        },
        {
          "seriesname": "Importaciones de vino",
          "data": importion
        },
        {
          "seriesname": "Exportaciones de vino",
          "data": exportion
        }
      ]
    };
    cargarConf();
      }
      onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
      chartConfigs = {
        type: 'msarea',
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