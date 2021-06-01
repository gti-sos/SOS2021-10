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

    
    // Always set FusionCharts as the first parameter
    fcRoot(FusionCharts, Charts, FusionTheme);

    const paises = new Set();
    let categorias=[];

	let gramperperson = [];
	let caloryperperson = [];
	let arrPaises =[];
    let data = [];
    var dict ={};

    let data2=[];
    let marriage_rate=[];
    let divorce_rate=[];
    let ratio_percent=[];

    var dataSource={};

    var BASE_CONTACT_API_PATH= "/api/v2";

    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
        const res2 = await fetch("https://sos2021-01.herokuapp.com/api/v1/divorce-stats?date=2011");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();
            data=json;
            data2=json2;
           
            console.log(`We have received ${data.length} data points.`);
			let i=0;
            let e=0;
			while(e<data2.length){
                
                    paises.add(data2[e].country);
                    console.log(data2[e]["marriage-rate"])
                e++;

            }
			while(i<data.length){
				paises.add(data[i].country);
				 
				i++;
			
			}
            arrPaises = Array.from(paises);
           
            for(let p=0; p<arrPaises.length;p++ ){
                if(!dict[arrPaises[p]]){
                    dict[arrPaises[p]]={marriage_rate : null, divorce_rate: null, ratio_percent:null, gramperperson:null, caloryperperson:null}
                }
                console.log(dict);
            }
           


                let d=0;
                let d2=0;
                let paisesd = Object.keys(dict);
                
                    
                    while(d<data.length){
                    console.log(paisesd.includes(data[d].country));
                    if(paisesd.includes(data[d].country)){
                        
                        dict[data[d].country]['gramperperson']=data[d].gramperperson;
                        dict[data[d].country]['caloryperperson']=data[d].caloryperperson
                    }
                    d++
                }
                while(d2<data2.length){
                    if(paisesd.includes(data2[d2].country)){
    
                        dict[data2[d2].country]['marriage_rate']=data2[d2]["marriage-rate"];
                        dict[data2[d2].country]['divorce_rate']=data2[d2]["divorce-rate"];
                        dict[data2[d2].country]['ratio_percent']=data2[d2]["ratio-percent"];
                        
                    }
                    d2++;  
                }
                for(let p=0; p<paisesd.length; p++){
                    gramperperson.push({value: dict[paisesd[p]]['gramperperson']});
				    caloryperperson.push({value: dict[paisesd[p]]['caloryperperson']});
                    marriage_rate.push({value: dict[paisesd[p]]['marriage_rate']});
                    divorce_rate.push({value: dict[paisesd[p]]['divorce_rate']});
                    ratio_percent.push({value: dict[paisesd[p]]['ratio_percent']});
                    
                }
               
                for(let pa=0; pa<arrPaises.length; pa++){
                    categorias.push({label: arrPaises[pa]});
                }
            
        }else{
            console.log("Error!");
        }

        dataSource = {
      "chart": {
        "caption": "Integración con estadísticas de divorcios",
        "subcaption": "Datos de 2011",
        "numbersuffix": "",
        "showsum": "1",
        "plottooltext": "$label:  <b>$dataValue</b> $seriesName",
        "theme": "fusion",
        "drawcrossline": "1"
      },
      "categories": [
        {
          "category": categorias
        }
      ],
      "dataset": [
        {
          "seriesname": "Gramos por persona",
          "data": gramperperson
        },
        {
          "seriesname": "Calorías por persona",
          "data": caloryperperson
        },
        {
          "seriesname": "Tasa de matrimonios",
          "data": marriage_rate
        },
        {
          "seriesname": "Tasa de divorcios",
          "data": divorce_rate
        },
        {
          "seriesname": "Porcentaje de proporcion matrimonio/divorcio",
          "data": ratio_percent
        }
      ]
    };
        cargarConf();
    }
    onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
        chartConfigs = {
            type: 'stackedcolumn2d',
            width: 1300,  
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