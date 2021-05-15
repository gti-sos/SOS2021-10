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
  var spyears=[];
  var chyears=[];
  var usyears=[];
  var inyears=[];
  var geyears=[];
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
    title: {
      text: 'Año'
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
                  spyears.push(NewSpain.year);
                  if(NewSpain.year!=(spyears[spyears.length-2]+1)){
                    for(let i=spyears[spyears.length-2];i<(NewSpain.year-1);i++){
                      spainHealth.push(null);
                    }
                  }
                  spainHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="China"){
                  chyears.push(NewSpain.year);
                  if(NewSpain.year!=(chyears[chyears.length-2]+1)){
                    for(let i=chyears[chyears.length-2];i<(NewSpain.year-1);i++){
                      chinaHealth.push(null);
                    }
                  }
                  chinaHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="Germany"){
                  geyears.push(NewSpain.year);
                  if(NewSpain.year!=(geyears[geyears.length-2]+1)){
                    for(let i=geyears[geyears.length-2];i<(NewSpain.year-1);i++){
                      germanyHealth.push(null);
                    }
                  }
                  germanyHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="India"){
                  inyears.push(NewSpain.year);
                  if(NewSpain.year!=(inyears[inyears.length-2]+1)){
                    for(let i=inyears[inyears.length-2];i<(NewSpain.year-1);i++){
                      indiaHealth.push(null);
                    }
                  }
                  indiaHealth.push(NewSpain.health_expenditure_in_percentage);
                }
                else if(NewSpain.country=="United_States"){
                  usyears.push(NewSpain.year);
                  if(NewSpain.year!=(usyears[usyears.length-2]+1)){
                    for(let i=usyears[usyears.length-2];i<(NewSpain.year-1);i++){
                      usaHealth.push(null);
                    }
                  }
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
    <br><br> <p style="text-align: center">
    <button style="margin-left:10px;">
      <a style="text-decoration: none"  href="#/sanity-stats">Volver a Estadísticas de sanidad</a></button></p>
        <div id="container"></div>
        
    </figure>  
</main>