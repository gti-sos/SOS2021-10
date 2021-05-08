<script>
	let newFoodconsumption= {
		country:"",
		year:0,
		foodtype: "",
		caloryperperson:0,
		gramperperson:0,
		dailygram: 0,
		dailycalory: 0
	}
	
	let visible = false;
	let errorMsg ="";
	let color="";
	let foodconsumption = [];
	
	import {
		onMount
	} from "svelte";
	
	import Header from '../Header.svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
<<<<<<< HEAD
	import Alert from 'sveltestrap/src/Alert.svelte';
	
	onMount(getFoodconsumption);
	
	async function getFoodconsumption() {

        console.log("Fetching contact...");
        const res = await fetch("/api/v1/foodconsumption-stats" + window.location.search);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			foodconsumption= json ;
			console.log(`We have ${foodconsumption.length} foodconsumption.`);
			console.log(JSON.stringify(foodconsumption));
		}
		
		else{
			
		
			console.log("Error!");
			
		}
		}
		
		async function insertFoodconsumption(){
		console.log("Inserting foodconsumption " + JSON.stringify(newFoodconsumption));
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption-stats",
						{
							method: "POST",
							body: JSON.stringify(newFoodconsumption),
							headers: {
								"Content-Type": "application/json"
							}
						}).then( (res)=> {
						getFoodconsumption();
						if(res.status === 400){
					
							errorMsg= "ERROR: Algunos campos en el dato están mal formados.";
							visible = true;
							color="danger";
						}
						else if(res.status ===409){
						
							errorMsg= "Este dato ya existe.";
							visible = true;
							color="danger";
						}
						else if(res.ok){
							errorMsg= "ERROR: El dato ha sido añadido correctamente.";
							visible = true;
							color="success";
						}
		
						})
		
	}
	async function deleteFood(country, year, foodtype){
		console.log("Deleting foodconsumption with country " + JSON.stringify(country) + " year "+ JSON.stringify(year) + " and foodtype " + JSON.stringify(foodtype));
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption-stats/"+ country+ "/" + year + "/" +foodtype,
						{
							method: "DELETE"
							
						}).then( (res)=> {
						
						getFoodconsumption();
						
						})
						
	}
	
</script>
<main>
	<Alert
			color={color}
			isOpen={visible}
			toggle={() => (visible = false)}>
			{#if errorMsg}
                <p style="color: #063257 ">{errorMsg}</p>
        	{/if}
			
		</Alert>

<Table responsive>
			<thead>
				<tr>
					
					

				</tr>
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
					<td><input type=number bind:value="{newFoodconsumption.year}"></td>
					<td><input bind:value="{newFoodconsumption.foodtype}"></td>
					<td><input type=number bind:value="{newFoodconsumption.caloryperperson}"></td>
					<td><input type=number bind:value="{newFoodconsumption.gramperperson}"></td>
					<td><input type=number bind:value="{newFoodconsumption.dailygram}"></td>
					<td><input type=number bind:value="{newFoodconsumption.dailycalory}"></td>
					<td><Button on:click={insertFoodconsumption}>Añadir</Button></td>

				</tr>
				{#each foodconsumption as datafood}
					<tr>

					<td><a href="#/foodconsumption-stats/{datafood.country}/{datafood.year}/{datafood.foodtype}">{datafood.country}</td>
					<td>{datafood.year}</td>
					<td>{datafood.foodtype}</td>
					<td>{datafood.caloryperperson}</td>
					<td>{datafood.gramperperson}</td>
					<td>{datafood.dailygram}</td>
					<td>{datafood.dailycalory}</td>
					<td><Button on:click={deleteFood(datafood.country,datafood.year, datafood.foodtype )}>Borrar</Button></td>

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
=======
</script>
>>>>>>> 69f2c941a15c20149b75f5d1da011266f9810d7c
