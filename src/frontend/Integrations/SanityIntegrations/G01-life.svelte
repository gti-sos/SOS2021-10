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
        var NewLife={
            "country" :"",
            "date": 0,
            "quality_life_index" : 0.0,
            "purchasing_power_index" : 0.0,
            "safety_index" : 0.0
        }
  var years=[];
  var spyears=[];
  var lfyears=[];
    var country = [];
        var country = [];
        var sanity=[];
        var life=[];



    async function loadGraph(){
        console.log(2)
        Highcharts.chart('container', {
      chart: {
        type: 'area'
    },
  title: {
    text: 'Integración G01-Life API'
  },

  subtitle: {
    text: 'Datos de España desde '+years[0]+' hasta '+years[years.length-1]
  },

  yAxis: [{
        gridLineWidth: 0,
        title: {
            text: 'Índice calidad de vida',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true

    },{ 
        labels: {
            format: '{value} %',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Gasto en sanidad ',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }

    }],
    tooltip: {
        shared: true
    },

  legend: {
    layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      }
    }
  },

  legend: {
    layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
  },

  xAxis: [{
    title: {
      text: 'Año'
    },
    categories:years
  }],


  series: [{
        tooltip: {
            valueSuffix: 'u '
        },
    name: 'Índice de calidad de vida',
    data: life
  },{
        tooltip: {
            valueSuffix: ' %'
        },
    name: 'Gasto en sanidad',
    data: sanity
  }],
  responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    floating: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    visible: false
                }]
            }
        }]
    }
    });
console.log(3);
  }
    
      
      async function getsanity(){
            console.log("Fetching sanity...");
            const res = await fetch("api/v2/sanity-stats/statistics?country=Spain");
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
                    spyears.push(NewSpain.year);
                    if(NewSpain.year!=(spyears[spyears.length-2]+1)){
                        for(let i=spyears[spyears.length-2];i<(NewSpain.year-1);i++){
                        if(!years.includes(i+1)){
                            years.push(i+1);
                        }
                        sanity.push(null);
                        }
                    }
                    sanity.push(NewSpain.health_expenditure_in_percentage);
                    i++;
                }
            }else{
                console.log("Error!");
            }
            console.log(1)
            const res2 = await fetch("https://sos2021-01-life-stats.herokuapp.com/api/v2/life-stats?country=spain");
            if(res2.ok){
                console.log("Ok.");
                const json = await res2.json();
                country = json;
                country.sort((a, b) => (a.date > b.date) ? 1 : -1)
                console.log(json);
                console.log(country);
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){
                    NewLife=country[i]
                        if(!years.includes(NewLife.date)){
                        years.push(NewLife.date);
                        }
                        lfyears.push(NewLife.date);
                        if(NewLife.date!=(lfyears[lfyears.length-2]+1)){
                            for(let i=lfyears[lfyears.length-2];i<(NewLife.date-1);i++){
                                if(!years.includes(i+1)){
                                    years.push(i+1);
                                }
                                life.push(null);
                            }
                        }
                        life.push(NewLife.quality_life_index);
                    
                    i++;
                }
                console.log(life)
            }else{
                console.log("Error!");
            }
            console.log(5)
console.log(lfyears)
console.log(spyears)
            if(lfyears[0]<spyears[0]){
                for(let i=lfyears[0];i<spyears[0];i++){
                    spyears.unshift(i+1);
                    sanity.unshift(null);
                    if(!years.includes(i+1)){
                        years.push(i+1);
                    }
                }
            }
            else if(lfyears[0]>spyears[0]){
                console.log(lfyears[0]+" " + spyears[0])
                for(let i=lfyears[0];i>spyears[0];i--){
                    console.log("algo")
                    lfyears.unshift(i-1);
                    life.unshift(null);
                    if(!years.includes(i-1)){
                        years.push(i-1);
                    }
                }
            }

            years.sort((a, b) => (a > b) ? 1 : -1)

            loadGraph();
        }   
       
        onMount(getsanity);
    </script>
    
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </svelte:head>
    
    <main>
      <Header/>
      <button id="volver" style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
      <figure class="highcharts-figure">
        <br><br> <p style="text-align: center">
            <div id="container"></div>
            
        </figure>  
    </main>
    <style>
     
    </style>