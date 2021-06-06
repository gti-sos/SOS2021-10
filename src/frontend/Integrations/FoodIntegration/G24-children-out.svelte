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
    
    // Always set FusionCharts as the first parameter
    fcRoot(FusionCharts, Charts, FusionTheme);
    var dataSource = {};
    let dailygram = 0;
	let dailycalory = 0;
    let gramperperson = 0;
    let caloryperperson = 0;

    let data = [];

    let data2=[];
    let outSchoolMale=0;
    let outSchoolFemale=0;
    let outSchoolTotal=0;

	var BASE_CONTACT_API_PATH= "/api/v2";

    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats/Germany/2011");
        const res2 = await fetch("https://sos2021-24.herokuapp.com/api/v2/children-out-school/Germany/2011");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();
            data.push(json);
            data2.push(json2);
            console.log(`We have received ${data.length} data points.`);
			let i=0;
            let e=0;
			while(e<data2.length){
                outSchoolMale=data2[e].children_out_school_male;
                outSchoolFemale=data2[e].children_out_school_female;
                outSchoolTotal=data2[e].children_out_school_total;
                e++;

            }
			while(i<data.length){
				dailygram = data[i].dailygram;
                dailycalory = data[i].dailycalory;
                gramperperson = data[i].gramperperson;
                caloryperperson= data[i].caloryperperson;
				
				i++;
			
			}
            console.log(dailygram);

            
            
        }else{
            console.log("Error!");
        }
        dataSource = {
      "chart": {
        "caption": "Integración con abandono escolar",
        "plottooltext": "<b>$dataValue</b> $label ",
        "showlegend": "1",
        "showpercentvalues": "1",
        "legendposition": "bottom",
        "usedataplotcolorforlabels": "1",
        "theme": "fusion"
      },
      "data": [
            {
            "label": "Gramos diarios",
            "value": dailygram.toString(10)
            },
            {
            "label": "Calorias diarias",
            "value": dailycalory.toString(10)
            },
            {
            "label": "Gramos por persona",
            "value": gramperperson.toString(10)
            },
            {
            "label": "Calorias por persona",
            "value": caloryperperson.toString(10)
            },
            {
            "label": "Abandono Escolar (Niños)",
            "value": outSchoolMale.toString(10)
            },
            {
            "label": "Abandono Escolar (Niñas)",
            "value": outSchoolFemale.toString(10)
            },
            {
            "label": "Abandono Escolar (Total)",
            "value": outSchoolTotal.toString(10)
            }
            ]
    };
        cargarConf();
    }   
    
    onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
        chartConfigs={
            type: 'pie2d',
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
