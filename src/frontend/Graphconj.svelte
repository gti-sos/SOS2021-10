<script>

import Header from './Header.svelte';
    import {
        onMount
    } from "svelte";
    var NewSpain={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
    var newObe={	
		"country": "",
		"year": 0,
		"man_percent": 0,
		"woman_percent": 0,
		"total_population": 0
	}
    var newfood={
		"country": "",
		"year": 0,
		"caloryperperson": 0,
		"gramperperson":0 ,
		"dailygram": 0,
		"dailycalory": 0
	}
    var sanity = [];
	var costes = [];
    var obesity=[];
	var porcentajeobe=[];
    var food=[];
    var gramos=[];
	var years = [];
    
	function distinctRecords(MYJSON, prop) {
    return MYJSON.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }	
	
async function loadGraph(){
	const san = await fetch("api/v2/sanity-stats");
    const foo = await fetch("api/v2/foodconsumption-stats");
	const obe = await fetch("api/v2/obesity-stats");
	
	if (obe.ok) {
	obesity = await obe.json();
	var distinctDates = distinctRecords(obesity, "year");
        distinctDates.sort(function (a, b) {
          return a.year - b.year;
        });
        distinctDates.forEach((element) => {
          if (!years.includes(element.year)) {
            years.push(element.year);
            console.log("years: " + element.year);
          }
        });
		
        console.log("Distintc years: " + years);
	years.forEach( (x) => {
            var yAxis = obesity
            .filter((d) => d.date === x)
            .map((nr) => nr["year"])
            .reduce((acc, nr) => nr + acc,0);
          console.log("YAxis: " + yAxis);
          porcentajeobe.push(Math.round(yAxis));
        });
	}
	
    
    Highcharts.chart('container', {
        chart: {
        type: 'line'
    },    
  title: {
    text: 'Analíticas'
  },

  yAxis: {
    title: {
      text: 'Ratio'
    }
  },

  xAxis: {
  	title: {
          text: "Años",
        },
	categories: years,
    
  },

  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 2007
    }
  },

  series: [{
    name: 'gasto en sanidad',
    data: costes
  },{
    name: 'calorias',
    data: gramos
  },{
    name: 'Obesidad(%)',
    data: porcentajeobe
  }],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }
    });
console.log(3);
  }

  
  
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>
</svelte:head>

<main>
    <Header/>
    <figure class="highcharts-figure">
      <br><br> 
      <button><a href="#/info">Volver a Inicio</a></button>
        <div id="container"></div>
        
    </figure>  
</main>
<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  .highcharts-figure,
  .highcharts-data-table table {
    min-width: 360px;
    max-width: 800px;
    margin: 1em auto;
  }
  .highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
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
  .highcharts-data-table td,
  .highcharts-data-table th,
  .highcharts-data-table caption {
    padding: 0.5em;
  }
  .highcharts-data-table thead tr,
  .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
  }
  .highcharts-data-table tr:hover {
    background: #f1f7ff;
  }
</style>