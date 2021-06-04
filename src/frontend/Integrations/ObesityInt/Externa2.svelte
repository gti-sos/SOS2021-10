<script>
import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
    
    
	async function loadGraph() { 
		let obesity = [];
		let moneda = [];
		
		
		const res = await fetch("/api/v2/obesity-stats");
		obesity = await res.json();
		const resData = await fetch("https://api.n.exchange/en/api/v1/currency/");
		moneda = await resData.json();
		
		let obe = obesity.map((x) => {
				let res = {name: x.country + " " + x.year,value: x.man_percent};
				return res;
			});
		
		let data = moneda.filter((x) => {return parseInt(x.minimal_amount) > 10.0;}).map((x) => {
				let res = {name: x.name,value: parseInt(x.minimal_amount)};
				return res;
			});
				
			let datosConjuntos = [{name: "Obesidad en varios paises",data: obe},{name: "Importe mínimo",data: data}];

			Highcharts.chart('container', {
				chart: {
					type: 'packedbubble',
					height: '60%'
                },
                title: {
        text: 'Comparación entre obesidad másculina y monto minimo de varios tipos de moneda'
    },
				tooltip: {
					useHTML: true,
					pointFormat: '<b>{point.name}:</b> {point.value}'
				},
				plotOptions: {
					packedbubble: {
						minSize: '10%',
						maxSize: '100%',
						zMin: 0,
						zMax: 1000,
						layoutAlgorithm: {
							gravitationalConstant: 0.05,
							splitSeries: true,
							seriesInteraction: false,
							dragBetweenSeries: false,
							parentNodeLimit: true
						},
						dataLabels: {
							enabled: true,
							format: '{point.name}',
							filter: {
								property: 'y',
								operator: '>',
								value: 250
							},
							style: {
								color: 'black',
								textOutline: 'none',
								fontWeight: 'normal'
							}
						}
					}
				},
				series: datosConjuntos
			});
	}
	
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load={loadGraph}></script>>
    <script src="https://code.highcharts.com/highcharts-more.js" on:load={loadGraph}></script>>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load={loadGraph}></script>>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
    
</svelte:head>

<main>
  <Header/>
	<figure class="highcharts-figure">
    
		<div id="container"></div>
	</figure>
	
	

</main>

<style>
	main {
		text-align: center;
	}
    .highcharts-figure, .highcharts-data-table table {
  min-width: 320px; 
  max-width: 800px;
  margin: 1em auto;
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