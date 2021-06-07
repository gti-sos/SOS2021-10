<script>
	import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
   
    var obesity = [];
	var data = [];
   	let countryObe = { x: 0.0, y: 0.0, z: 0 , name: '', country: '' };
	let obe={	
		"country": "",
		"year": 0,
		"man_percent": 0.0,
		"woman_percent": 0.0,
		"total_population": 0
	}

    
async function loadGraph(){
    console.log(2)
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
        text: 'Porcentaje de obesidad por país'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.country}({point.year}), Hombres: {point.x}%, Mujeres: {point.y}%, Población: {point.z}.'
        }
    },

    xAxis: {
        gridLineWidth: 1,
        title: {
            text: 'Porcentaje de obesidad en mujeres'
        },
        labels: {
            format: '{value} %'
        },
        
        accessibility: {
            rangeDescription: 'Range: 60 to 100 grams.'
        }
    },

    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Porcentaje de obesidad en hombres'
        },
        labels: {
            format: '{value} %'
        },
        maxPadding: 0.2,
        
        accessibility: {
            rangeDescription: 'Range: 0 to 160 grams.'
        }
    },

    tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr><th colspan="2"><h3>{point.country}({point.year})</h3></th></tr>' +
            '<tr><th>Mujeres:</th><td>{point.x}%</td></tr>' +
            '<tr><th>Hombres:</th><td>{point.y}%</td></tr>' +
            '<tr><th>Población:</th><td>{point.z}</td></tr>',
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
        data: obesity
    }]

});
console.log(3);
  }

  
  async function getData(){
        console.log("Fetching data...");
        const res = await fetch("/api/v2/obesity-stats");

        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            data = json;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
			console.log(data);
			while(i<data.length){
				obe=data[i];
                countryObe.year=obe.year;
				countryObe.x=obe.woman_percent;
				countryObe.y=obe.man_percent;
				countryObe.z=obe.total_population;
				countryObe.name=obe.country;
				countryObe.country=obe.country;
				console.log(countryObe);
				obesity.push({x: obe.woman_percent, y: obe.man_percent, z: obe.total_population , name: obe.country, country: obe.country, year:obe.year });
				i++;
				console.log(obesity);
			}

        }else{
            console.log("Error!");
        }
		loadGraph();
    }   
    
    onMount(getData);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
	<Header/>
	<br>
    <figure class="highcharts-figure">
      
      <button><a href="#/obesity-stats">Volver a Estadísticas de Obesidad</a></button>
      <button><a href="#/obesity-stats/graph">Gráfica 1</a></button>
        <div id="container"></div>
        
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
	max-width: 50px;
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