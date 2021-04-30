<script>
	import {
    	Button
  	} from 'sveltestrap';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let sanity = [];
	
	
	async function SanityData() {
    	console.log("Loading data...");
   		const res = await fetch("/api/v1/sanity-stats/loadInitialData");
		
        if(res.ok){
			console.log("Ok.");
			getSanity();
		}else{
			console.log("Error");
		}
	}

	async function getSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats");
		
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          sanity = json;
          console.log(`We have ${sanity.length} Sanity.`)
        }else{
          console.log("Error");
        }
  	}
	  async function Delete() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats");
		
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          sanity = json;
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
				<td><Button Button color="secondary" on:click={SanityData}>Cargar Datos Iniciales</Button></td>
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
