
<script>
     import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";
    var BASE_CONTACT_API_PATH= "/api/v2";
    let gramperperson=0;
    let caloryperperson=0;
    let gini =0;
    async function getData(){
        console.log("Fetching data...");
        const res2 = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats/Spain/2011");
        const res = await fetch("https://restcountries.eu/rest/v2/name/Spain?fields=gini");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();
            gini = json[0].gini;
            gramperperson = json2.gramperperson;
            caloryperperson = json2.caloryperperson;
            console.log(json);
            console.log(gramperperson);
        }else{
            console.log("Error!");
        }
        loadGraph();
    }

onMount(getData)
async function loadGraph(){  
var chart = JSC.Chart('chartDiv', {
        debug: true,
        legend: {
          position: 'inside left bottom',
          template: '%value {%percentOfTotal:n1}% %icon %name'
        },
        title_position: 'center',
        defaultSeries_type: 'pieDonut',
        defaultPoint_label_text: '<b>%name</b>',
        title_label_text: 'Intengracion con API externa 1',
        subtitle_label_text: 'Datos de España',
        yAxis: { label_text: 'Cantidad', formatString: 'n' },
        series: [
          {
            name: 'Datos España',
            points: [
              { name: 'Coeficiente de gini', y: gini },
              { name: 'Gramos por persona', y: gramperperson },
              { name: 'Calorías por persona', y: caloryperperson }
            ]
          }
        ]
      });
    }
</script>

<svelte:head>
  <script src="https://code.jscharting.com/latest/jscharting.js"></script>
</svelte:head>
<main>
  <Header/>
  <br>
  <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
  <div id="chartDiv" ></div>
</main>