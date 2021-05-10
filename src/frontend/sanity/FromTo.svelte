<script>
	import Header from '../Header.svelte';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let sanity = [];
    const url=window.location.hash;
    console.log(url);
    const param=url.split("/");
    console.log(param);
    const from=parseInt(param[4]);
    const to=parseInt(param[6]);
    console.log(from);
    console.log(to);

	async function getSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats?from="+from+"&to="+to);
		console.log(res);
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          console.log(json);
          sanity = json;
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
			{#each sanity as sani}
			<tr>
			<td>{sani.country}</td>
			<td>{sani.year}</td>
			<td>{sani.health_expenditure_in_percentage}</td>
			<td>{sani.doctor_per_1000_habitant}</td>
			<td>{sani.hospital_bed}</td>
			</tr>
            {/each}
			
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