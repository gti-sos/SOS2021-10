<script>
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
    let spain = [];
    let data=[2916, 2404, 2942, 3082, 3121, 4044];
    let spainBed=[];
    let spainHealth=[];
    let spainDoctors=[];
    async function getsanity(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats?country=Spain");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            spain = json;
            console.log(json);
            console.log(spain);
            console.log("made");
            console.log(`We have received ${spain.length} sanity points.`);
        }else{
            console.log("Error!");
        }
        let i=0;
        while(i<spain.length){
            NewSpain=spain[i];
            spainBed.push(NewSpain.hospital_bed);
            spainHealth.push(NewSpain.health_expenditure_in_percentage);
            spainDoctors.push(NewSpain.doctor_per_1000_habitant);
            i++;
        }
        console.log(data)
        console.log(spainBed)
    }   
   
    onMount(getsanity);
  async function loadGraph(){  
    Highcharts.chart('container', {
        
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
    name: 'Camas',
    data: spainBed
  }, {
    name: 'Manufacturing',
    data: data
  }, {
    name: 'Sales & Distribution',
    data: [1144, 1722, 1605, 1971, 5185, 3387]
  }, {
    name: 'Project Development',
    data: [null, null, 798, 1169, 1512, 3427]
  }, {
    name: 'Other',
    data: [1208, 5948, 5105, 1248, 899, 1811]
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
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
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