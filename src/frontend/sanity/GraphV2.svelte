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
  var years=[];
    var country = [];
    var chinaHealth=[];
    var spainHealth=[];
    var usaHealth=[];
    var indiaHealth=[];
    var germanyHealth=[];
    
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
    text: 'Gasto en sanidad desde '+years[0]+' hasta '+years[years.length-1]
  },

  yAxis: {
    title: {
      text: 'Gasto en Sanidad (%)'
    }
  },

  xAxis: {
    accessibility: {
      rangeDescription: 'Range: '+years[0]+' hasta '+years[years.length-1]
    }, 
    categories:years
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
      }
    }
  },

  series: [{
    name: 'Estados Unidos',
    data: usaHealth
  },{
    name: 'Alemania',
    data: germanyHealth
  },{
    name: 'España',
    data: spainHealth
  },{
    name: 'China',
    data: chinaHealth
  },{
    name: 'India',
    data: indiaHealth
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
        const res = await fetch("/api/v2/sanity-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            country = json;
            country.sort((a, b) => (a.year > b.year) ? 1 : -1)
            console.log(json);
            console.log(country);
            console.log("made");
            console.log(`We have received ${country.length} sanity points.`);
            let i=0;
            while(i<country.length){
                NewSpain=country[i];
                if(!years.includes(NewSpain.year)){
                  years.push(NewSpain.year);
                }
                if(NewSpain.country=="Spain"){
                  spainHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="China"){
                  chinaHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="Germany"){
                  germanyHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="India"){
                  indiaHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="United_States"){
                  usaHealth.push(NewSpain.health_expenditure_in_percentage);
                }
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
    <button style="margin-left:10px;">
      <a style="text-decoration: none"  href="#/sanity-stats">Volver a Estadísticas de sanidad</a></button>
        <div id="container"></div>
        
    </figure>  
</main>