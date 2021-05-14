<script>

    import {
        onMount
    } from "svelte";
    let NewSpain={
		"country" :"",
		"year": 0,
		"man_percent" : 0.0,
		"woman_percent" : 0.0,
		"total_population" : 0.0
	}
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
        type: 'area'
    },    
  title: {
    text: 'Gasto en sanidad'
  },

  subtitle: {
    text: 'Gasto en sanidad desde 2007 hasta '+(2007+spainHealth.length-1)
  },

  yAxis: {
    title: {
      text: 'Gasto en Sanidad (%)'
    }
  },

  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 2007 to '+(2011+country.length)
    }
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
      },
      pointStart: 2007
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

  
  async function getobesity(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/obesity-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            country = json;
            console.log(json);
            console.log(country);
            console.log("made");
            console.log(`We have received ${country.length} sanity points.`);
            let i=0;
            while(i<country.length){
                NewSpain=country[i];
                if(NewSpain.country=="Spain"){
                  spainHealth.push(NewSpain.total_population);
                }
                else if(NewSpain.country=="China"){
                  chinaHealth.push(NewSpain.total_population);
                }
                else if(NewSpain.country=="Germany"){
                  germanyHealth.push(NewSpain.total_population);
                }
                else if(NewSpain.country=="India"){
                  indiaHealth.push(NewSpain.total_population);
                }
                else if(NewSpain.country=="United_States"){
                  usaHealth.push(NewSpain.total_population);
                }
                i++;
            }
        }else{
            console.log("Error!");
        }
        console.log(1)
        loadGraph();
    }   
   
    onMount(getobesity);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
      
      <button><a href="#/sanity-stats">Volver a Estadísticas de sanidad</a></button>
      <button><a href="#/sanity-stats-graph">Gráfica 1</a></button>
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>  
</main>