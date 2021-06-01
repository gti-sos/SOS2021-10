<script>
    import Header from '../Header.svelte';
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    import {
        onMount
    } from "svelte";
	fcRoot(FusionCharts, Charts, FusionTheme);
    var BASE_API_PATH= "/api/v2";
    let obesity = [];
    let natality = [];
    

    async function getnatality() {	
		const res1 = await fetch(BASE_API_PATH+"/api/v2/natality-stats"); 
		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			natality = json;
			console.log("Received " + natality.length);
		} else {
			console.log("ERROR!");
		}
	}
    async function loadGraph(){
        const resData = await fetch(BASE_API_PATH+"/obesity-stats?country=Spain");
        const resData2 = await fetch("http://sos2021-natality-stats.herokuapp.com/api/v2/natality-stats?country=spain");
        let hombres = [];
        let mujeres = [];
        let pais = [];
        let natalidad = [];
        let fertilidad = [];
        let parseo =[];
		obesity = await resData.json();
		obesity.forEach( (x) => {
            let esp = x.country + " (" + x.year + ")";
            pais.push(esp);
            hombres.push(x.woman_percent);
            mujeres.push(x.man_percent);
            natalidad.push(null);
            fertilidad.push(null);
        });
		
		natality = await resData2.json();
		
        
        
		natality.forEach( (x) => {
            
            let espe = (x.country).charAt(0).toUpperCase() + (x.country).slice(1)  + " (" + x.date + ")";
            pais.push(espe);
            natalidad.push(x["natality-rate"]);
            fertilidad.push(x["fertility-rate"]);
            hombres.push(null);
            mujeres.push(null);
        });
        
        let graphic_data1 = {
            name: 'Obesidad hombres',
            data: hombres,
            stack: 'Obesidad'
        };
        let graphic_data2 = {
            name: 'Obesidad mujeres',
            data: mujeres,
            stack: 'Obesidad'
        };
        let graphic_data3 = {
            name: 'Natalidad',
            data: natalidad,
            stack: 'Nacimiento'
        };
        let graphic_data4 = {
            name: 'Fertilidad',
            data: fertilidad,
            stack: 'Nacimiento'
        };
        parseo.push(graphic_data2);
        parseo.push(graphic_data1);
        parseo.push(graphic_data3);
        parseo.push(graphic_data4);
        
        console.log(parseo);
        
    
    };
    onst dataSource = {
  "chart": {
    "caption": "Top Finishers",
    "subcaption": "2016-2017",
    "yaxisname": "Open Play Goals",
    "palettecolors": "#E64571, #88D786",
    "plotgradientcolor": " ",
    "theme": "fusion",
    "yaxismaxvalue": "30",
    "numdivlines": "2",
    "showlegend": "1",
    "interactivelegend": "0",
    "showvalues": "0",
    "showsum": "0"
  },
  "categories": [
    {
      "category": pais
    }
  ],
  "dataset": parseo
    },
    {
      "seriesname": "2016",
      "data": [
        {
          "value": "5"
        },
        {
          "value": "8"
        },
        {
          "value": "6"
        },
        {
          "value": "3"
        },
        {
          "value": "2"
        },
        {
          "value": "3"
        },
        {
          "value": "3"
        },
        {
          "value": "4"
        },
        {
          "value": "5"
        },
        {
          "value": "4"
        },
        {
          "value": "3"
        },
        {
          "value": "4"
        },
        {
          "value": "2"
        },
        {
          "value": "3"
        },
        {
          "value": "3"
        },
        {
          "value": "4"
        },
        {
          "value": "2"
        },
        {
          "value": "4"
        }
      ]
    }
  ],
  "annotations": {
    "groups": [
      {
        "id": "infobar",
        "items": [
          {
            "id": "1",
            "type": "line",
            "x": "$dataset.1.set.1.endx+10",
            "y": "$dataset.1.set.1.y",
            "tox": "$dataset.1.set.1.endx+50",
            "toy": "$dataset.1.set.1.y",
            "color": "#2F9AC4",
            "dashed": "0",
            "thickness": "1"
          },
          {
            "id": "2",
            "type": "line",
            "x": "$dataset.1.set.1.endx+50",
            "y": "$dataset.1.set.1.y",
            "tox": "$dataset.1.set.1.endx+50",
            "toy": "$dataset.0.set.1.y+50",
            "color": "#2F9AC4",
            "dashed": "0",
            "thickness": "1"
          },
          {
            "id": "3",
            "type": "line",
            "x": "$dataset.1.set.17.endx+5",
            "y": "$dataset.1.set.17.y",
            "tox": "$dataset.1.set.17.endx+200",
            "toy": "$dataset.0.set.17.y",
            "color": "#2F9AC4",
            "dashed": "0",
            "thickness": "1"
          },
          {
            "id": "4",
            "type": "line",
            "x": "$dataset.1.set.17.endx+200",
            "y": "$dataset.0.set.17.y",
            "tox": "$dataset.1.set.17.endx+200",
            "toy": "$dataset.0.set.17.y-40",
            "color": "#2F9AC4",
            "dashed": "0",
            "thickness": "1"
          },
          {
            "id": "shape",
            "type": "polygon",
            "startangle": "180",
            "sides": "3",
            "radius": "6",
            "color": "#2F9AC4",
            "x": "$dataset.1.set.17.endx+10",
            "y": "$dataset.1.set.17.y"
          },
          {
            "id": "shape",
            "type": "polygon",
            "startangle": "180",
            "sides": "3",
            "radius": "6",
            "color": "2F9AC4",
            "x": "$dataset.1.set.1.endx+10",
            "y": "$dataset.1.set.1.y"
          },
          {
            "id": "label1",
            "align": "RiGHT",
            "type": "text",
            "text": "Messi added{br}roughly 7 Goals from{br}his shot quality",
            "fillcolor": "#2F9AC4",
            "rotate": "90",
            "x": "$dataset.1.set.1.endx+65",
            "y": "$dataset.0.set.5.y"
          },
          {
            "id": "label2",
            "align": "CENTER",
            "type": "text",
            "text": "Bernardeschi{br}more than doubled{br}his chance quality{br}through shooting",
            "fillcolor": "#2F9AC4",
            "rotate": "90",
            "x": "$dataset.1.set.17.endx+200",
            "y": "$dataset.0.set.13.y"
          }
        ]
      }
    ]
  }
};

const chartConfigs = {
   type: 'stackedbar2d',
   width: 600,
   height: 400,
   dataFormat: 'json',
   dataSource
};
</script>




<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>


<main>
	<Header/>
	<br>
    <figure class="highcharts-figure">
      
      <button><a href="#/obesity-stats">Volver a Estadísticas de Obesidad</a></button>
      
      <h5 style="text-align: center">Porcentaje de población obesa en 2011</h5>
        <div id="container"></div>
        
    </figure>  
</main>

<style>
#container {
    height: 400px; 
}

.highcharts-figure, .highcharts-data-table table {
    min-width: 310px; 
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #EBEBEB;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}
.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
    padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
    padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}
.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>