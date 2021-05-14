

<script>

	import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
	var BASE_CONTACT_API_PATH= "/api/v2";
	const paises = new Set();
	let caloryperperson = [];
	let gramperperson = [];
	let dailygram = [];
	let dailycalory = [];
	
    let data = [];
	
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            data = json;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
			
			while(i<data.length){
				paises.add(data[i].country);
				caloryperperson.push(data[i].caloryperperson);
				gramperperson.push(data[i].gramperperson);
				dailygram.push(data[i].dailygram);
				dailycalory.push(data[i].dailycalory);
				i++;
			
			}
			
        }else{
            console.log("Error!");
        }
		loadGraph();
		
    }   
    
    onMount(getData);
  async function loadGraph(){  
  console.log( Array.from(paises));
   Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Consumo de azúcares y grasas en 2011'
    },
    subtitle: {
        text: 'Source: <a href="https://www.nationalgeographic.com/what-the-world-eats/"> National Geographic </a>'
    },
    xAxis: {
        categories: Array.from(paises),
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Calorias por persona',
        data: caloryperperson

    }, {
        name: 'Gramos por persona',
        data: gramperperson

    }, {
        name: 'Gramos diarios',
        data: dailygram

    }, {
        name: 'Calorías diarias',
        data: dailycalory

    }]
});
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" ></script>
</svelte:head>

<main>
<Header/>
<br>
<br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
           Gráfico de barras sobre el consumo de grasas y azúcares en 2011 de varios países del mundo.
        </p>
    </figure>  
</main>


<style>
	.highcharts-figure, .highcharts-data-table table {
	  min-width: 100%;
	  max-width:100%;
	  margin: 1em auto;
	}

	#container {
	  height: 400px;
	}

	.highcharts-data-table table {
		font-family: Verdana, sans-serif;
		border-collapse: collapse;
		border: 1px solid #EBEBEB;
		margin: 10px auto;
		text-align: center;
		width: 100%;
		max-width: 500px;
	}
	.highcharts-data-table caption {
	  padding: 1em 0;
	  font-size: 1.2em;
	  color: #555;
	}
	.highcharts-data-table th {
		font-weight: 600;
	  padding: 0.5em;
	}
	.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
	  padding: 0.5em;
	}
	.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
	  background: #f8f8f8;
	}
	.highcharts-data-table tr:hover {
	  background: #f1f7ff;
	}

</style>