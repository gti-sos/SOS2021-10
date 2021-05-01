<script>

	
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let foodconsumption = [];
	
	import Button from "sveltestrap/src/Button.svelte";
	

	let newFoodconsumption= {
		country:"",
		year:"",
		"foodtype": "",
		"caloryperperson": "",
		"gramperperson": "",
		"dailygram": "",
		"dailycalory": ""
	}
	
	var BASE_CONTACT_API_PATH= "/api/v1";
	
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
	
	async function insertFoodconsumption(){
		console.log("Inserting foodconsumption " + JSON.stringify(newFoodconsumption));
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption",
						{
							method: "POST",
							body: JSON.stringify(newFoodconsumption),
							headers: {
								"Content-Type": "application/json"
							}
						}).then( (res)=> {
						getFoodconsumption();
						
						})
		
	}
	async function deleteContact(country, year, foodtype){
		console.log("Deleting contact with country " + JSON.stringify(country) + " year "+ JSON.stringify(year) + " and foodtype " + JSON.stringify(foodtype));
		const res = await fetch(BASE_CONTACT_API_PATH+"/contacts/"+ country+ "/" + year + "/" +foodtype,
						{
							method: "DELETE"
							
						}).then( (res)=> {
						getFoodconsumption();
						
						})
		
	}
	
	onMount(getFoodconsumption);
	
</script>

<main>
	
		<Table responsive>
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

				<tr>
					<td><input bind:value="{newFoodconsumption.country}"></td>
					<td><input bind:value="{newFoodconsumption.year}"></td>
					<td><input bind:value="{newFoodconsumption.foodtype}"></td>
					<td><input bind:value="{newFoodconsumption.caloryperperson}"></td>
					<td><input bind:value="{newFoodconsumption.gramperperson}"></td>
					<td><input bind:value="{newFoodconsumption.dailygram}"></td>
					<td><input bind:value="{newFoodconsumption.dailycalory}"></td>
					<td><Button on:click={insertFoodconsumption}>Insert</Button></td>

				</tr>
				{#each foodconsumption as datafood}
					<tr>

					<td><a href="#/contacts/{datafood.country}/{datafood.year}/{datafood.foodtype}">{datafood.country}</td>
					<td>{datafood.year}</td>
					<td>{datafood.foodtype}</td>
					<td>{datafood.caloryperperson}</td>
					<td>{datafood.gramperperson}</td>
					<td>{datafood.dailygram}</td>
					<td>{datafood.dailycalory}</td>
					<td><Button on:click={deleteContact(datafood.country,datafood.year, datafood.foodtype )}>Delete</Button></td>

					</tr>
				{/each}

			</tbody>
		</Table>
	
	
</main>

<style>
	td	{
		max-width: 20px;
	}
	tr {
		max-width: 120px;
	}
	input	{
		max-width: 120px;
	}
	
</style>