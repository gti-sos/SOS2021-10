<script>
import {
            onMount
        } from "svelte";
import Header from '../../Header.svelte';
    import * as JSC from 'jscharting';
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
                      if(NewSpain.country=="Germany"){
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
                      i++;
                  }
                  years.sort((a, b) => (a > b) ? 1 : -1)
              }else{
                  console.log("Error!");
              }
              console.log(1)
              const res2 = await fetch("https://sos2021-20.herokuapp.com/api/v2/foundsresearchsources-stats");
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
                    año=country2[i].year;
                      if(!years.includes(año)){
                        years.push(año);
                      }
                        toyears.push(año);
                       
                      if(country2[i].country=="germany"){
                        toyears.push(año);
                        if(año!=(toyears[toyears.length-2]+1)){
                          for(let i=toyears[toyears.length-2];i<(año-1);i++){
                            if(!years.includes(i+1)){
                              years.push(i+1);
                            }
                            sptotal.push(null);
                          }
                        }
                        sptotal.push({x:año, y:country2[i].percentage_of_government_funding});
                      }
                      
                      i++;
                  }
                  years.sort((a, b) => (a > b) ? 1 : -1)
              }else{
                  console.log("Error!");
              }
              if(toyears[0]<spyears[0]){
                      for(let i=toyears[0];i<spyears[0];i++){
                          spyears.unshift(i+1);
                          sanity.unshift(null);
                          if(!years.includes(i+1)){
                              years.push(i+1);
                          }
                      }
                  }
              if(toyears[0]>spyears[0]){
                      for(let i=toyears[0];i>=spyears[0];i--){
                        console.log(spyears[0] +" a  "+toyears[0])
                          toyears.unshift(i-1);
                          sptotal.unshift({x:i, y:null});
                          if(!years.includes(i-1)){
                              years.push(i-1);
                          }
                      }
                  }      
              loadGraph();
          }
    
         function loadGraph() {
          var chart = JSC.chart('chartDiv', { 
            defaultSeries_type: 'column', 
            title_label_text: 'Datos de Alemania', 
            yAxis: { label_text: '%' }, 
            xAxis_label_text: 'Año', 
            series: [ 
              { 
                name: 'Porcentaje financiación estatal', 
                id: 's1', 
                points: sptotal
              }, 
              { 
                name: 'Gasto en sanidad', 
                points: spainHealth 
              }] 
          }); 
         }
    </script>
    
    <svelte:head>
      <script src="https://code.jscharting.com/latest/jscharting.js"></script>
    
    </svelte:head>
    
    <main>
      <Header/>
      <button style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
      <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto">
      </div>
    </main>
    