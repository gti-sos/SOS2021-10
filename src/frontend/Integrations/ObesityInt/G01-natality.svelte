<script>
import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
    
    
	async function loadGraph() { 
		let obesity = [];
    let natalidad = [];
    let muj = 0;
    let hom= 0;
    let nat = 0;
    let fer = 0;
		
		const resData = await fetch("/api/v2/obesity-stats?country=Spain");
        obesity = await resData.json();
        obesity.forEach( (x) => {
          if(x.year==2014){
            muj=x.woman_percent;
            hom=x.man_percent;
          }
        });

      
		
		const resData2 = await fetch("http://sos2021-natality-stats.herokuapp.com/api/v2/natality-stats?country=spain");
        natalidad = await resData2.json();
        natalidad.forEach( (x) => {
         
            nat=x["natality-rate"];
            fer=x["fertility-rate"];
          
        });

      console.log(nat);
				
			let datosConjuntos = [{name: 'Obesidad Mujeres',y: muj},{name: 'Natalidad',y: nat},{name: 'Obesidad Hombres',y: hom},{name: 'Fertilidad',y: fer}];

			Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Porcentaje de obesidad y natalidad en España'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {y:.2f} %'
            }
        }
    },
    series: [{
      name: 'Porcentaje',
        colorByPoint: true,
         data: datosConjuntos
    }]
});
	}
	
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>

    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
    
</svelte:head>

<main>
  <Header/>
  <br>
  <button><a href="#/integrations">Volver a las Integraciones</a></button>
<br>
	<figure class="highcharts-figure">
    
		<div id="container"></div>
	</figure>
	
	

</main>

<style>
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


input[type="number"] {
	min-width: 50px;
}
</style>