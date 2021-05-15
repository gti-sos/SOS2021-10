<script>

import Header from '../Header.svelte';
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
    var country = [];
    var poblacion=[];
    var health=[];
    var calorias=[];
    
async function loadGraph(){
    console.log(2)
    Highcharts.chart('container', {
        chart: {
        type: 'line'
    },    
  title: {
    text: 'Gasto en sanidad'
  },

  subtitle: {
    text: 'Gasto en sanidad desde 2007 hasta '
  },

  yAxis: {
    title: {
      text: 'Gasto en Sanidad (%)'
    }
  },

  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 2007 to '+(2011+country.length)
    }
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
    data: health
  },{
    name: 'calorias',
    data: calorias
  },{
    name: 'poblacion',
    data: poblacion
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

  
  async function getsanity(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats/statistics?country=China");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            country = json;
            let i=0;
            while(i<country.length){
                NewSpain=country[i];
                health.push(NewSpain.health_expenditure_in_percentage);
                i++;
            }
        }else{
            console.log("Error!");
        }
        const res2 = await fetch("/api/v2/obesity-stats?country=China");
        if(res2.ok){
            console.log("Ok.");
            const json = await res2.json();
            let country2 = json;
            let i=0;
            while(i<country2.length){
                newObe=country2[i];
                poblacion.push(newObe.total_population);
                i++;
            }
        }else{
            console.log("Error!");
        }
        const res3 = await fetch("/api/v2/foodconsumption-stats?country=China");
        if(res3.ok){
            console.log("Ok.");
            const json = await res3.json();
            let country3 = json;
            let i=0;
            while(i<country3.length){
                newfood=country3[i];
                calorias.push(newfood.dailycalory);
                i++;
            }
        }else{
            console.log("Error!");
        }
        console.log(1)
        loadGraph();
    }   
   
    onMount(getsanity);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <Header/>
    <figure class="highcharts-figure">
      <br><br> 
      <button><a href="#/info">Volver a Inicio</a></button>
        <div id="container"></div>
        
    </figure>  
</main>