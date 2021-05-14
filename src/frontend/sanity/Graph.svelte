<script>
let row="";
import Header from '../Header.svelte';
	import {
		onMount
	} from "svelte";

const url=window.location.hash;
    console.log(url);
    const param=url.split("/");
    console.log(param);
    const country=param[2];
    console.log(country);

    let NewSpain={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
  var paises=new Set();
    var spain = [];
    var spainBed=[];
    var spainHealth=[];
    var spainDoctors=[];

////////////////
function recarga(int){
  if(int==1){
  }
}


function cargarpaises() {
    for (let pais of paises) {
      let html=`<button>
                      <a href="#/sanity-stats-graph/${pais}">${pais}
                      </a>
                      
                      </button>`;
                row+=html;
    }
}



    //////////////////////
    async function getpaises(){
        console.log("Fetching sanity...");
        const res = await fetch("/api/v2/sanity-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            spain = json;
            console.log("made");
            console.log(`We have received ${spain.length} sanity points.`);
            let i=0;
            while(i<spain.length){
                paises.add(spain[i].country);
                i++;
            }
        }else{
            console.log("Error!");
        }
        console.log(4)
        cargarpaises();
    }   


async function loadGraph(){
    console.log(2)
    Highcharts.chart('container', {
        chart: {
        zoomType: 'xy'
    },    
  title: {
    text: 'Datos de '+country
  },

  subtitle: {
    text: 'Dastos desde el 2007 hasta '+(2007+spainHealth.length-1)
  },

  yAxis: {
    title: {
      text: 'Año'
    }
  },

  yAxis: [{ // Primary yAxis
        labels: {
            format: '{value} u',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        title: {
            text: 'Nº de camas',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true

    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Gasto ensanidad',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} %',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }

    }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Médicos',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
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
      },
      pointStart: 2007
    }
  },

  series: [{
    name: 'Porcentaje de gasto en Sanidad',
        type: 'column',
        yAxis: 1,
    data: spainHealth,
        tooltip: {
            valueSuffix: ' %'
        }
  },{
    name: 'Médicos cada 1000 habitantes',
        type: 'spline',
        yAxis: 2,
    data: spainDoctors,
        marker: {
            enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' '
        }
  },{
    name: 'Camas de Hospital',
        type: 'spline',
    data: spainBed,
        tooltip: {
            valueSuffix: ' u'
        }
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
        const res = await fetch("/api/v2/sanity-stats?country="+country);
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            spain = json;
            console.log(spain);
            spain.sort((a, b) => (a.year > b.year) ? 1 : -1)
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
        getpaises();
        console.log(spainBed)
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
    <figure class="highcharts-figure">
      <br><br>
      <button><a href="#/sanity-stats">Volver a Estadísticas de sanidad </a></button>
      <button><a href="#/sanity-stats-graphv2">Gráfica 2</a></button>
      
        <div id="container"></div>
        <div class="container" id="contenedor">
          <hr>
          <div class="enlaces">
           
          </div>
          <div id="hi">
            <p> {@html row} </p>
            
           </div>
      </div>  
    </figure>  
</main>