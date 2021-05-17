<script>

	import Header from '../Header.svelte';
    import {
        onMount
    } from "svelte";
 	
	var BASE_CONTACT_API_PATH= "/api/v2";
	const paises = new Set();
	let years = new Set();
	var dictGramosPais ={};
	let gramosporpais = [];
	
	var dictAnyoPais ={};
	
	
    let data = [];
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            data = json;
            console.log(`We have received ${data.length} data points.`);
			let i=0;
			data.reverse();
			while(i<data.length){
				years.add(data[i].year);
				if(dictGramosPais[data[i].country]){
					dictGramosPais[data[i].country].push(data[i].caloryperperson);
				}
				else{
					dictGramosPais[data[i].country]=[parseInt(data[i].caloryperperson)];
				}
				
				
				
				
				if(dictAnyoPais[data[i].country]){
					dictAnyoPais[data[i].country].push(data[i].year);
				}
				else{
					dictAnyoPais[data[i].country]=[parseInt(data[i].year)];
				}
				i++;
			}
			console.log(dictGramosPais);
			
			
        }else{
            console.log("Error!");
        }
		let paises= Object.keys(dictGramosPais);
		for(let p=0; p<paises.length; p++){
			if(dictAnyoPais[paises[p]]){
				let anyos=dictAnyoPais[paises[p]].sort();
				let a=0;
					while(a<Array.from(years).length){
						let ord =Array.from(years).sort();
						if(!anyos.includes(ord[a])){
							dictGramosPais[paises[p]].splice(a, 0, null);
						}
						a++
					}
			}
		}
	
		Object.entries(dictGramosPais).forEach(([key, value]) => {
			
				gramosporpais.push({name: key , data: value})
			});
		loadGraph();
		
    }   
    
    onMount(getData);
  async function loadGraph(){  
  console.log(dictGramosPais);
    Highcharts.chart('container', {
        title: {
            text: 'Datos del consumo de azúcares y grasas'
        },
        yAxis: {
            title: {
                text: 'Calorías por persona'
            }
        },
        xAxis: {
           categories: Array.from(years)
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
            }
        },
        series: gramosporpais,
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
<br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
        
        </p>
    </figure>  
</main>