<script>
    import {
        onMount
    } from "svelte";

 	import Header from '../Header.svelte';
    let obesity = [];

    async function getobesity(){
        console.log("Fetching data...");
        const res = await fetch("/obesity-stats");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            obesity = json;
            console.log(`We have received ${obesity.length} obesity points.`);
        }else{
            console.log("Error!");
        }
    }   
    
    onMount(getobesity);

  async function loadGraph(){ 
  Highcharts.chart('container', {

    chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        zoomType: 'xy'
    },

    legend: {
        enabled: false
    },

    title: {
        text: 'Estadisticas sobre la obesidad por pais.'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.name}, man_percent: {point.man_percent}%, woman_percent: {point.woman_percent}%, total_population: {point.total_population}.'
        }
    },

    

    tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
            '<tr><th>man_percent:</th><td>{point.man_percent}g</td></tr>' +
            '<tr><th>woman_percent:</th><td>{point.woman_percent}g</td></tr>' +
            '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
        footerFormat: '</table>',
        followPointer: true
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },

    series: [{
        data: [
            { man_percent: 4.2, woman_percent: 5.2, country: 'China' },
            { man_percent: 20.8, woman_percent: 21, country: 'Spain' },
        ]
    }]

});
  }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
	<Header/>
    <figure class="highcharts-figure">
    	<div id="container"></div>
    	<p class="highcharts-description">
      	  Chart showing basic use of bubble series with a custom tooltip formatter.
      	  The chart uses plot lines to show safe intake levels for sugar and fat.
       		Bubble charts are great for comparing three dimensions of data without
        	relying on color or 3D charts.
    	</p>
	</figure>  
</main>

<style>
.highcharts-figure, .highcharts-data-table table {
    min-width: 310px; 
    max-width: 800px;
    margin: 1em auto;
}

#container {
    height: 400px;
}

.highcharts-tooltip h3 {
    margin: 0.3em 0;
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
