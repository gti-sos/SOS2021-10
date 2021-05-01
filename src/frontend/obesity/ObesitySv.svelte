<script>

	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	
	let obesity = [];
	let newObesity = {
		country: "",
		year: "",
		man_percent: "",
		woman_percent: "",
		total_population: ""
		
	};
	
	async function ObesityData() {
    	console.log("Loading data...");
   		const res = await fetch("/api/v1/obesity-stats/loadInitialData");
		
        if(res.ok){
			console.log("Ok.");
			getObesity();
		}else{
			console.log("Error");
		}
  	}
	
	async function getObesity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/obesity-stats/");
		
        if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			obesity = json;
			console.log(`We have ${obesity.length} obesity.`)
		}else{
			console.log("Error");
		}
  	}

	async function insertObesity() {
    	console.log("Inserting contact "+ JSON.stringify(newObesity));
   		
	}	
	
	onMount(getObesity);
	
</script>

<main>
	<Table bordered>
	
		<thead>
		
			<tr>
				<th>Pais</th>
				<th>Año</th>
				<th>Porcentaje de hombres</th>
				<th>Porcentaje de mujer</th>
				<th>Población total</th>
				<th>Acción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newObesity.country}"></td>
				<td><input bind:value="{newObesity.year}"></td>
				<td><input bind:value="{newObesity.man_percent}"></td>
				<td><input bind:value="{newObesity.woman_percent}"></td>
				<td><input bind:value="{newObesity.total_population}"></td>
				<td><Button on:click={insertObesity}>Insertar</Button></td>
			</tr>
			{#each obesity as obe}
				<tr>
				<td>{obe.country}</td>
				<td>{obe.year}</td>
				<td>{obe.man_percent}</td>
				<td>{obe.woman_percent}</td>
				<td>{obe.total_population}</td>
				<td></td>
				
				</tr>
			{/each}
			
		</tbody>
	
	</Table>
</main>


<style>
	Table {
		
		overflow: hidden;
		
	}
</style>
