

<script>
  import {
            onMount
        } from "svelte";
  import Header from '../../Header.svelte';
    var NewSpain={
          "country" :"",
          "year": 0,
          "health_expenditure_in_percentage" : 0.0,
          "doctor_per_1000_habitant" : 0.0,
          "hospital_bed" : 0.0
      }
  
    var country = [];
    var country2 = [];
    var years=[];
    var spyears=[];
    var toyears=[];
    var spainHealth=[];
    var sptotal=[];
    var spmap=new Map();
        onMount(getsanity);
        async function getsanity() {
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
                    if(!spyears.includes(NewSpain.year)){
                      spyears.push(NewSpain.year);
                    }
                    if(NewSpain.year!=(spyears[spyears.length-2]+1)){
                      for(let i=spyears[spyears.length-2];i<(NewSpain.year-1);i++){
                        if(!years.includes(i+1)){
                          years.push(i+1);
                        }
                      }
                    }
                    spainHealth.push({label:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                  }
                  i++;
              }
              years.sort((a, b) => (a > b) ? 1 : -1)
          }else{
              console.log("Error!");
          }
          console.log(1)
          const res2 = await fetch("https://sos2021-25.herokuapp.com/api/v1/sales");
          if(res2.ok){
              console.log("Ok.");
              const json = await res2.json();
              country2 = json;
              country2.sort((a, b) => (a.year > b.year) ? 1 : -1)
              console.log(json);
              console.log(country);
              console.log("made");
              console.log(`We have received ${country.length} sanity points.`);
              let i=0;
              let año;
              while(i<country2.length){
                año=parseInt(country2[i].year);
                if(año==2006){
                  console.log(country2[i])
                  console.log("raro cojones")
                }
                  if(!years.includes(año)){
                    years.push(año);
                  }
                  if(!toyears.includes(año)){
                    toyears.push(año);
                  }
                  if(año!=(toyears[toyears.length-2]+1)){
                              for(let i=toyears[toyears.length-2];i<(año-1);i++){
                                  if(!years.includes(i+1)){
                                      years.push(i+1);
                                  }
                                spmap[i]=null;
                              }
                          }
                  if(spmap[año]){
                    spmap[año]=(parseFloat(spmap[año])+parseFloat(country2[i].total));
  
                  }
                  else{
                    spmap[año]=parseFloat(country2[i].total);
                  }
                  
                  i++;
              }
              years.sort((a, b) => (a > b) ? 1 : -1)
          }else{
              console.log("Error!");
          }
          Object.entries(spmap).forEach(([key, value]) => {
        sptotal.push({label: parseInt(key) , y: value})
  });
         
            if(toyears[0]<spyears[0]){
                  for(let i=toyears[0];i<spyears[0];i++){
                      spainHealth.unshift({label:i, y:null});
                      if(!years.includes(i+1)){
                          years.push(i+1);
                      }
                  }
              }
          if(toyears[0]>spyears[0]){
                  for(let i=toyears[0];i>=spyears[0];i--){
                      sptotal.unshift({label:i, y:null});
                      if(!years.includes(i-1)){
                          years.push(i-1);
                      }
                  }
              }

  
  
          loadGraph();
      }   
  
     function loadGraph() {
    
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
        text: "Gasto en sanidad y viviendas vendidas en España"
      },	
      axisY: {
        title: "Gasto en sanidad (%)",
        titleFontColor: "#4F81BC",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC"
      },
      axisY2: {
        title: "Viviendas vendidas",
        titleFontColor: "#C0504E",
        lineColor: "#C0504E",
        labelFontColor: "#C0504E",
        tickColor: "#C0504E"
      },	
      toolTip: {
        shared: true
      },
      legend: {
        cursor:"pointer",
        itemclick: toggleDataSeries
      },
      data: [{
        type: "column",
        name: "Gasto en sanidad (%)",
        legendText: "Proven Oil Reserves",
        showInLegend: true, 
        dataPoints:spainHealth
      },
      {
        type: "column",	
        name: "Viviendas vendidas",
        legendText: "Oil Production",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints:sptotal
      }]
    });
    chart.render();
    
    function toggleDataSeries(e) {
      if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      }
      else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
    
    }
    
  </script> 
  
  <svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
  
  </svelte:head>
  <main>
    <Header/>
    <button style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
    <div id="chartContainer" style="height: 300px; width: 100%;"></div>
  
  </main>
  