<script>
    import Header from '../Header.svelte';

    const url=window.location.hash;
    console.log(url);
    const param=url.split("/");
    console.log(param);
    const country=param[2];
    console.log(country);

    import {
        onMount
    } from "svelte";
    let NewSpain={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
    var spain = [];
    var spainBed=[];
    var spainHealth=[];
    var spainDoctors=[];
    
    async function getsanity(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats?country="+country);
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            spain = json;
            console.log(json);
            console.log(spain);
            console.log("made");
            console.log(`We have received ${spain.length} sanity points.`);
            let i=0;
            while(i<spain.length){
                NewSpain=spain[i];
                spainBed.push(NewSpain.hospital_bed);
                spainHealth.push(NewSpain.health_expenditure_in_percentage);
                spainDoctors.push(NewSpain.doctor_per_1000_habitant);
                i++;
            }
        }else{
            console.log("Error!");
        }
        console.log(1)
        console.log(spainBed)
        loadGraph();
    }   
   
    onMount(getsanity);
async function loadGraph(){
    console.log(2)
    Highcharts.chart('container', {
        chart: {
        type: 'area'
    },    
  title: {
    text: 'idk what im doing'
  },

  subtitle: {
    text: 'help'
  },

  yAxis: {
    title: {
      text: 'Number of Employees'
    }
  },

  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 2007 to 2011'
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
    name: 'Porcentaje de gasto en Sanidad',
    data: spainHealth
  },{
    name: 'Médicos cada 1000 habitantes',
    data: spainDoctors
  },{
    name: 'Camas de Hospital',
    data: spainBed
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
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>  
</main>