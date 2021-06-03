
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
        var and={
            "country" :"",
            "year": 0,
            "deaths_ambient_particulate_matter_pollution" : 0.0,
            "deaths_household_air_pollution_from_solid_fuels" : 0.0,
            "deaths_air_pollution" : 0.0
        }
      var years=[];
      var spyears=[];
      var anyears=[];
        var country = [];
        var andorra=[];
        var spainHealth=[];
    
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
                          spainHealth.push({x:NewSpain.year, y:and.null});
                        }
                      }
                      spainHealth.push({x:NewSpain.year, y:NewSpain.health_expenditure_in_percentage});
                    }
                    i++;
                }
                years.sort((a, b) => (a > b) ? 1 : -1)
            }else{
                console.log("Error!");
            }

            const res2 = await fetch("https://sos2021-03.herokuapp.com/api/integrations/air-pollution/");
            if(res2.ok){
                console.log("Ok.");
                const json = await res2.json();
                country = json;
                country.sort((a, b) => (a.year > b.year) ? 1 : -1)
                console.log(json);
                console.log(country);
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){
                  and=country[i];
                    if(!years.includes(and.year)){
                      years.push(and.year);
                    }
                    if(and.country=="ANDORRA"){
                      anyears.push(and.year);
                      if(and.year!=(anyears[anyears.length-2]+1)){
                        for(let i=anyears[anyears.length-2];i<(and.year-1);i++){
                          if(!years.includes(i+1)){
                            years.push(i+1);
                          }
                          andorra.push({x:and.year, y:and.null});
                        }
                      }
                      andorra.push({x:and.year, y:and.deaths_air_pollution});
                    }
                    i++;
                }
                years.sort((a, b) => (a > b) ? 1 : -1)
            }else{
                console.log("Error!");
            }


            console.log(andorra)
            console.log(spainHealth)
            console.log(1)
            loadGraph();
        }   
    
    
        function loadGraph() {
        
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "Integración G03"
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
                name: "andorra",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "green",
                markerSize: 0,
                dataPoints: andorra
            },{
                name: "españita",
                showInLegend: true,
                legendMarkerType: "square",
                type: "area",
                color: "blue",
                markerSize: 0,
                dataPoints: spainHealth
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