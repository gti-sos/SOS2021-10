<script>

	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let foodconsumption = [];
	
	async function getFoodconsumption(){
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v1/foodconsumption-stats");
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			foodconsumption = json;
			console.log('We have ${foodconsumption.length} foodconsumption.');
		}else{
			console.log("Error!");
		}
	}
	
	onMount(getFoodconsumption);
	
</script>

<main>
	<Table bordered>
		<thead>
			<tr>
				<td>País</td>
				<td>Año</td>
				<td>Tipo de comida</td>
				<td>Calorías por persona</td>
				<td>Gramos por persona</td>
				<td>Gramos diarios</td>
				<td>Calorías diarias</td>
			
			</tr>
		</thead>
		<tbody>
			{#each foodconsumption as datafood}
				<tr>
				
				<td>{datafood.country}</td>
				<td>{datafood.year}</td>
				<td>{datafood.foodtype}</td>
				<td>{datafood.caloryperperson}</td>
				<td>{datafood.gramperperson}</td>
				<td>{datafood.dailygram}</td>
				<td>{datafood.dailycalory}</td>
				
				</tr>
			{/each}
			
		</tbody>
	</Table>
</main>