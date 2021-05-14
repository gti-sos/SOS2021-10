<script>
	import Header from '../Header.svelte';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let sanity = {};
    const url=window.location.hash;
    console.log(url);
    const param=url.split("/");
    console.log(param);
    const country=param[2];
    const year=parseInt(param[3]);
    console.log(country);
    console.log(year);
	async function getSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats?country="+country+"&year="+year);
		console.log(res);
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          sanity = json[0];
        }else{
          console.log("Error");
        }
  	}
	onMount(getSanity);
</script>

<main>
    <Header/>
    <br><br>

	<Table bordered>
		<thead>
			<tr>
				<td>Pais</td>
				<td>Año</td>
				<td>Porcentaje de gasto en sanidad</td>
				<td>Doctores por cada 1000 habitantes</td>
				<td>Camas de hospital</td>
			</tr>
		</thead>
		<tbody>
			<tr>
			<td>{sanity.country}</td>
			<td>{sanity.year}</td>
			<td>{sanity.health_expenditure_in_percentage}</td>
			<td>{sanity.doctor_per_1000_habitant}</td>
			<td>{sanity.hospital_bed}</td>
			</tr>
		
			
</tbody>
	</Table><br><br>
<button><a href="#/sanity-stats-graph/{sanity.country}">Gráfica</a></button>
</main>
<style>
	tr {
		max-width: 90px;
	}
	td{
		max-width: 10px;
	}
	
	
</style>