<script>
    import Header from '../../Header.svelte';
        import {
            onMount
        } from "svelte";
        let country=[];
        var datos=[];
   

    
    async function getsanity(){
            console.log("Fetching sanity...");
            const res = await fetch("api/v2/sanity-stats");
            if(res.ok){
                console.log("Ok.");
                const json = await res.json();
                country = json;
                console.log("made");
                let i=0;
                while(i<country.length){;
                    datos.push({name:"sanidad "+country[i].country+" año "+country[i].year,value:country[i].health_expenditure_in_percentage,colorValue:country[i].health_expenditure_in_percentage});
                    i++;
                }
                
            }else{
                console.log("Error!");
            }
            console.log(1)
            const res2 = await fetch("https://sos2021-24.herokuapp.com/api/v2/children-employment");
            if(res2.ok){
                console.log("Ok.");
                const json = await res2.json();
                country = json;
                country.sort((a, b) => (a.date > b.date) ? 1 : -1)
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){;
                    datos.push({name:"niños "+country[i].country+" año "+country[i].year,value:country[i].percent_children_employment_t,colorValue:country[i].percent_children_employment_t});
                    i++;
                }
            }else{
                console.log("Error!");
            }
            console.log(5)
            console.log(datos)
            
            loadGraph();
        }
console.log("x")

function loadGraph() {
    console.log("a")
    Highcharts.chart('container', {
    colorAxis: {
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    },
    series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        data: datos
    }],
    title: {
        text: 'Highcharts Treemap'
    }
});
console.log("b")
}
   
        onMount(getsanity);
        </script>
        
        <svelte:head>
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script src="https://code.highcharts.com/modules/heatmap.js"></script>
            <script src="https://code.highcharts.com/modules/treemap.js"></script>
            <script src="https://code.highcharts.com/modules/exporting.js"></script>
            <script src="https://code.highcharts.com/modules/export-data.js"></script>
            <script src="https://code.highcharts.com/modules/accessibility.js"></script>
            
           
            
            
        </svelte:head>
        
        <main>
            <Header/>
          <button id="volver" style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
          <figure class="highcharts-figure">
            <div id="container"></div>
           
        </figure>
        </main>
        