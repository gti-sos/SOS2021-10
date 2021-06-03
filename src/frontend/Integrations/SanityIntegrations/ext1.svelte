
<script>
    import {
                onMount
            } from "svelte";
    import Header from '../../Header.svelte';

      var obj={
          year:0,
          psicologos:0,
          hombres:0,
          mujeres:0
      }
        var country = [];
        var years=[];
        var grafica=[];
        var grafica1=[];
        var grafica2=[];
        var datos = [];
        var datos1 = [];
        var datos2 = [];
        async function loadGraph(){
    console.log(2)
    Highcharts.chart('container', {
        chart: {
        zoomType: 'xy'
    },    
  title: {
    text: 'Psicologos colegiados en españa'
  },

  subtitle: {
    text: 'https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/t15/p416/a2018/s05001.px?tip=AM'
  },

  xAxis: {
    title: {
      text: 'Año'
    },
    categories:years
  },

  yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        title: {
            text: 'Total',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true

    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Mujeres',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }

    }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Hombres',
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
      }
    }
  },

  series: [{
    name: 'mujeres',
        type: 'areaspline',
    data: grafica2,
        tooltip: {
            valueSuffix: ' pers'
        }
  },{
    name: 'hombres',
        type: 'areaspline',
        yAxis: 2,
    data: grafica1,
        marker: {
            enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' pers'
        }
  },{
    name: 'total',
        type: 'areaspline',
        yAxis: 1,
    data: grafica,
        tooltip: {
            valueSuffix: ' pers'
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
        onMount(getsanity);
            
        async function getsanity() {
                console.log("Fetching sanity...");
                grafica=new Array();
                const res = await fetch("https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/t15/p416/a2018/s05001.px?tip=AM");
                if(res.ok){
                    console.log("Ok.");
                    const json = await res.json();
                    country = json;
                    datos=country[0].Data;
                    datos1=country[1].Data;
                    datos2=country[2].Data;
                    let i=0;
                    while(i<datos.length){
                        years.push(parseInt(datos[i].NombrePeriodo));
                        grafica.push(parseInt(datos[i].Valor));
                        grafica1.push(parseInt(datos1[i].Valor));
                        grafica2.push(parseInt(datos2[i].Valor));
                        i++;
                    }
                }else{
                    console.log("Error!");
                }
                console.log(grafica)
                console.log(grafica1)
                console.log(grafica2)
            console.log(3)
            loadGraph();
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
    <Header/>
    <button id="volver" style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>

<script>console.log("hi")</script>
    
<div id="container"></div>
    <script>console.log("hi2")</script>
</main>
