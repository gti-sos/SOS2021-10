<script>
	import Header from '../Header.svelte';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let sanity = {};

	async function getSanity() {
    	console.log("Fetching data...");
        const country=window.location.country;
        const year=window.location.year;
   		const res = await fetch("/api/v1/sanity-stats/"+country+"/"+year);
		console.log(res);
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          sanity = json[0];
          console.log(`We have ${sanity.length} Sanity.`)
        }else{
          console.log("Error");
        }
  	}

	onMount(getSanity);
</script>

<main>
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
	</Table>
</main>
<style>
	tr {
		max-width: 90px;
	}
	td{
		max-width: 10px;
	}
	

	
</style>