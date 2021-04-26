<script>

	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let obesity = [];
	
	
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

	
	onMount(getObesity);
	
</script>

<main>
	<Table bordered>
		<thead>
			<tr>
				<td>Country</td>
				<td>Year</td>
				<td>Man_percent</td>
				<td>Woman_percent</td>
				<td>Total_population</td>
			</tr>
		</thead>
		<tbody>
			{#each obesity as obe}
				<tr>
				<td>{obe.country}</td>
				<td>{obe.year}</td>
				<td>{obe.man_percent}</td>
				<td>{obe.woman_percent}</td>
				<td>{obe.total_population}</td>
				
				
				</tr>
			{/each}
			
		</tbody>
	</Table>
</main>
