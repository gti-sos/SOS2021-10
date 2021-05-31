<script>
    import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
	
    var BASE_API_PATH= "/api/v2";
    let obesity = [];
    let obegra = [];
    let natality = [];
    let nat = [];
    let hombres = [];
    let mujeres = [];
    let pais = [];
    let niños = [];
    let chicas = [];
    let paisn = [];
    let conj=[];

    async function loadGraph(){
        const resData = await fetch(BASE_API_PATH+"/obesity-stats?country=Spain");
        const resData2 = await fetch(BASE_API_PATH + "/natality-stats");
        
		obesity = await resData.json();
		obesity.forEach( (x) => {
            let esp = x.country + " (" + x.year + ")";
            pais.push(esp);
            hombres.push(x.woman_percent);
            mujeres.push(x.man_percent);
        });
		
		natality = await resData2.json();
		
		natality.forEach( (x) => {
            let esp = x.country + " (" + x.year + ")";
            pais.push(esp);
            niños.push(x["men-born"]);
            chicas.push(x["women-born"]);
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
            name: 'Nacimiento hombres',
            data: niños,
            stack: 'Nacimiento'
        };
        let graphic_data4 = {
            name: 'Nacimiento mujeres',
            data: chicas,
            stack: 'Nacimiento'
        };
        obegra.push(graphic_data2);
        obegra.push(graphic_data1);
        nat.push(graphic_data3);
        nat.push(graphic_data4);
        conj.push(obegra);
        conj.push(nat);
		Highcharts.chart('container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Nacimientos y obesidad'
			},
			xAxis: {
				categories: pais
			},
			yAxis: {
				min: 0,
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold',
						color: ( // theme
							Highcharts.defaultOptions.title.style &&
							Highcharts.defaultOptions.title.style.color
						) || 'gray'
					}
				}
			},
			legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			},
			series: conj
		});
	};
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
      
      <h5 style="text-align: center">Porcentaje de población obesa en 2011</h5>
        <div id="container"></div>
        
    </figure>  
</main>

<style>
#container {
    height: 400px; 
}

.highcharts-figure {
    min-width: 310px; 
    max-width: 800px;
    margin: 1em auto;
}

</style>