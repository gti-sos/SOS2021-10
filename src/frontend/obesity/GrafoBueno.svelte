<script>
	import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
   
    let obesity = [];
  	let obegra = [];
    
async function loadGraph(){
    const resData = await fetch("/api/v2/obesity-stats");
        obesity = await resData.json();
        obesity.forEach( (x) => {
          if(x.year==2011){
            obegra.push({name: x.country + " " +  x.year, value: [parseInt(((parseFloat(x.man_percent)+parseFloat(x.woman_percent))/100)*parseInt(x.total_population))]});
          }
        });

      console.log(obegra);
      

      anychart.onDocumentReady(function () {
        
        var chart = anychart.cartesian();
        var data = obegra;
  // JSON data
        var json = {
          // chart settings
          "chart": {
            // chart type
            "type": "pie",
            // chart data
            "data": obegra,
            // chart container
            "container": "container"
          }
        };
        
  // get JSON data
  var chart = anychart.fromJson(json);

  // draw chart
  chart.draw();
});
  }
    
  
</script>
<style type="text/css">

    html, body, #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
  
</style>
<svelte:head>
 <script src="https://cdn.anychart.com/releases/8.10.0/js/anychart-core.min.js"></script>
<script src="https://cdn.anychart.com/releases/8.10.0/js/anychart-bundle.min.js"></script>
<script src="https://cdn.anychart.com/releases/8.10.0/js/anychart-base.min.js"></script>
   
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js"></script>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js" on:load={loadGraph}></script>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-data-adapter.min.js"></script>
  <link href="https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css" type="text/css" rel="stylesheet">
  <link href="https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css" type="text/css" rel="stylesheet">
</svelte:head>

<main>
	<Header/>
	<br>
    <figure class="highcharts-figure">
      
      <button><a href="#/obesity-stats">Volver a Estadísticas de Obesidad</a></button>
      <button><a href="#/obesity-stats/graphv2">Gráfica 2</a></button>
      <h5 style="text-align: center">Porcentaje de población obesa en 2011</h5>
        <div id="container"></div>
        
    </figure>  
</main>
