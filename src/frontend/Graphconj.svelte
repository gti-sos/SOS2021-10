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
    var country = [];
    var poblacion=[];
    var health=[];
    var calorias=[];
    
async function loadGraph(){
    
    Highcharts.chart('container', {
        chart: {
        type: 'line'
    },    
  title: {
    text: 'Análisis mundial'
  },

  subtitle: {
    text: 'Consumo de gramos por persona, población total con obesidad y gastos en sanidad'
  },

  yAxis: {
    title: {
      text: 'Números'
    }
  },

  xAxis: {
    categories: Array.from(years).sort()
	
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
  
    }
  },

  series: [{
    name: 'Gasto en sanidad',
    data: health
  },{
    name: 'calorias',
    data: gramosporanyo
  },{
    name: 'Población obesa',
    data: obesidadhym
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

  }
  
	let years = new Set();
	var dictGramosPais ={};
	var dictObedic ={};
	let gramosporanyo =[];
	let obesidadhym =[];
  
  async function getsanity(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats/statistics?country=China");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            country = json;
            let i=0;
            while(i<country.length){
				years.add(country[i].year);
                NewSpain=country[i];
                health.push(NewSpain.health_expenditure_in_percentage);
                i++;
            }
        }else{
            console.log("Error!");
        }
        const res2 = await fetch("/api/v2/obesity-stats");
        if(res2.ok){
            console.log("Ok.");
            const json = await res2.json();
            let obe = json;
            let i=0;
            while(i<obe.length){
             years.add(obe[i].year);
			 console.log(years);
			 if(dictObedic[obe[i].year]){
					dictObedic[obe[i].year]+=parseInt(((parseFloat(obe[i].man_percent)+parseFloat(obe[i].woman_percent))/100)*parseInt(obe[i].total_population));
				}
				else{
					dictObedic[obe[i].year]=parseInt(((parseFloat(obe[i].man_percent)+parseFloat(obe[i].woman_percent))/100)*parseInt(obe[i].total_population));
				}
                i++;
            }
			
			
			Object.entries(dictObedic).forEach(([key, value]) => {
			
				obesidadhym.push(value);
			});
        }else{
            console.log("Error!");
        }
        const res3 = await fetch("/api/v2/foodconsumption-stats");
        if(res3.ok){
            console.log("Ok.");
            const json = await res3.json();
            let dataFood = json;
            let i=0;
			dataFood.reverse();
            while(i<dataFood.length){
             years.add(dataFood[i].year);
			 if(dictGramosPais[dataFood[i].year]){
					dictGramosPais[dataFood[i].year]+=parseInt(dataFood[i].caloryperperson);
				}
				else{
					dictGramosPais[dataFood[i].year]=parseInt(dataFood[i].caloryperperson);
				}
                i++;
            }
			
			
			Object.entries(dictGramosPais).forEach(([key, value]) => {
			
				gramosporanyo.push(value);
			});
			
        }else{
            console.log("Error!");
        }
        console.log(Array.from(years).sort());
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