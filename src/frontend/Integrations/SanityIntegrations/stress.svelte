<script>
  import Header from '../../Header.svelte';
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
        let country=[];
        var datos=[];
function loadGraph(){

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Gasto en sanidad 2011 y nivel de stress"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: datos
        }]
    });
    chart.render();
    
    }

    
    async function getsanity(){
            console.log("Fetching sanity...");
            const res = await fetch("api/v2/sanity-stats/statistics?country=Spain&fromyear=2011&toyear=2011");
            if(res.ok){
                console.log("Ok.");
                const json = await res.json();
                NewSpain = json;
                console.log("made");
                datos.push({y:NewSpain[0].health_expenditure_in_percentage,label:"Gasto en sanidad españa 2011"});
                
            }else{
                console.log("Error!");
            }
            console.log(1)
            const res2 = await fetch("api/v2/sanity-stats/stress-stats");
            if(res2.ok){
                console.log("Ok.");
                const json = await res2.json();
                country = json;
                country.sort((a, b) => (a.date > b.date) ? 1 : -1)
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){;
                    datos.push({y:country[i].stress_population, label:country[i].country});
                    i++;
                }
            }else{
                console.log("Error!");
            }
            console.log(5)
            console.log(datos)
            loadGraph();
        }   
       
        onMount(getsanity);
    </script>


<svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</svelte:head>
<main>
    <Header/>
    <br><br>
    <button id="volver" style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>

    <div id="chartContainer" style="height: 300px; width: 100%;"></div>
</main>