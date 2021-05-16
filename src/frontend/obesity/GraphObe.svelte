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
            obegra.push({name: x.country + " " + x.year, data: [parseFloat(x.man_percent), parseFloat(x.woman_percent)]});
        });

    Highcharts.chart('container', {
          
  title: {
    text: 'Porcentaje de obesidad'
  },

  subtitle: {
    text: 'Obesidad de hombres y mujeres por paises y años'
  },

  yAxis: {
    title: {
      text: 'Obesidad (%)'
    }
  },

  xAxis: {
    categories: [
                    'Hombres',
                    'Mujeres'
                ],
                crosshair: true
  },

  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
	tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
  plotOptions: {
    column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
  },

  series: obegra,
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

  
  
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
	<Header/>
	<br>
    <figure class="highcharts-figure">
      
      <button><a href="#/obesity-stats">Volver a Estadísticas de Obesidad</a></button>
      <button><a href="#/obesity-stats/graphv2">Gráfica 2</a></button>
        <div id="container"></div>
        
    </figure>  
</main>