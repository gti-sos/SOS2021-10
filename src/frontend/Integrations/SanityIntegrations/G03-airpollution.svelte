
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
                      spyears.push(NewSpain.year);
                      if(NewSpain.year!=(spyears[spyears.length-2]+1)){
                        for(let i=spyears[spyears.length-2];i<(NewSpain.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          spainHealth.push(null);
                        }
                      }
                      spainHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    else if(NewSpain.country=="China"){
                      chyears.push(NewSpain.year);
                      if(NewSpain.year!=(chyears[chyears.length-2]+1)){
                        for(let i=chyears[chyears.length-2];i<(NewSpain.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          chinaHealth.push(null);
                        }
                      }
                      chinaHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    else if(NewSpain.country=="Germany"){
                      geyears.push(NewSpain.year);
                      if(NewSpain.year!=(geyears[geyears.length-2]+1)){
                        for(let i=geyears[geyears.length-2];i<(NewSpain.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          germanyHealth.push(null);
                        }
                      }
                      germanyHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    else if(NewSpain.country=="India"){
                      inyears.push(NewSpain.year);
                      if(NewSpain.year!=(inyears[inyears.length-2]+1)){
                        for(let i=inyears[inyears.length-2];i<(NewSpain.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          indiaHealth.push(null);
                        }
                      }
                      indiaHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    else if(NewSpain.country=="United_States"){
                      usyears.push(NewSpain.year);
                      if(NewSpain.year!=(usyears[usyears.length-2]+1)){
                        for(let i=usyears[usyears.length-2];i<(NewSpain.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          usaHealth.push(null);
                        }
                      }
                      usaHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    i++;
                }
                years.sort((a, b) => (a > b) ? 1 : -1)
            }else{
                console.log("Error!");
            }
            console.log(1)
            loadGraph();
        }   
    
    
        function loadGraph() {
        
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Daily Email Analysis"
            },
            axisX: {
                minimum: years[0],
                maximum: years[years.length-1]
            },
            axisY: {
                title: "Number of Messages"
            },
            legend: {
                verticalAlign: "top",
                horizontalAlign: "right",
                dockInsidePlotArea: true
            },
            toolTip: {
                shared: true
            },
            data: [
            {
                name: "usa",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "red",
                markerSize: 0,
                dataPoints: usaHealth
            },{
                name: "alemanes",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "white",
                markerSize: 0,
                dataPoints: germanyHealth
            },{
                name: "españita",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "blue",
                markerSize: 0,
                dataPoints: spainHealth
            },{
                name: "china",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "yellow",
                markerSize: 0,
                dataPoints: chinaHealth
            }]
        });
        chart.render();
        
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