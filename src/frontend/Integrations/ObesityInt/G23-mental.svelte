<script>
import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
    
    
	async function loadGraph() { 
		let obesity = [];
    let mental = [];
    let muj = 0;
    let pop= 0;
    let esqui = 0;
    let popa = 0;
		
		const resData = await fetch("/api/v2/obesity-stats?country=Spain");
        obesity = await resData.json();
        obesity.forEach( (x) => {
          if(x.year==2014){
            muj=((x.woman_percent)*(x.total_population))/100;
            pop=x.total_population;
          }
        });

      
		
		const resData2 = await fetch("https://sos2021-23.herokuapp.com/api/v1/mh-stats?country=Spain");
        mental = await resData2.json();
        mental.forEach( (x) => {
            var numero=x.population;
            numero = numero.replace(/,/g, "");
            popa=(parseInt(numero));
            esqui=((parseInt(x.schizophrenia))*numero)/10000;
          
        });

        console.log(popa);
        
				
			let datosConjuntos = [{name: 'Obesidad en mujeres',y: pop,z:muj},{name: 'Personas con esquizofrenia',y: popa,z:esqui}];

			Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Comparación entre población de España con distintas afecciones.'
    },
    subtitle: {
        text: 'Comparamos la obesidad en las mujeres en el 2014 y la esquizofrenia en el 2007'
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            'Población total: <b>{point.y}</b><br/>' +
            'Personas con este padecimiento: <b>{point.z}</b><br/>'
    },
    series: [{
        minPointSize: 10,
        innerSize: '20%',
        zMin: 0,
        name: 'countries',
        data: datosConjuntos
    }]
});

	}
	
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/variable-pie.js"></script>
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
#container {
	height: 500px;
}

.highcharts-figure, .highcharts-data-table table {
    min-width: 320px; 
    max-width: 700px;
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