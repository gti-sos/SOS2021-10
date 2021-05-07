<script>
	const placement = 'right';
	
	import {
		onMount
	} from "svelte";
	
	let open = false;
	
	const toggle = () =>{
		(open = !open);
	}  
	
	import Table from "sveltestrap/src/Table.svelte";
	let foodconsumption = [];
	
	import Button from "sveltestrap/src/Button.svelte";
	import Alert from 'sveltestrap/src/Alert.svelte';
	import Popover from 'sveltestrap/src/Popover.svelte';
	import { CustomInput, Form, FormGroup, Label } from 'sveltestrap';
	
	let visible = false;
	
	let newFoodconsumption= {
		country:"",
		year:0,
		foodtype: "",
		caloryperperson:0,
		gramperperson:0,
		dailygram: 0,
		dailycalory: 0
	}
	
	var BASE_CONTACT_API_PATH= "/api/v1";
	
	async function getFoodconsumption(){
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v1/foodconsumption-stats");
		
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
	
	async function loadInitialData(){
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v1/foodconsumption-stats/loadInitialData").then( (res)=> {
						getFoodconsumption();
						})
		
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
							console.log("TAS EQUIVOCAO");
							visible = true;
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
	
	async function deleteTodo(){
		
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption-stats",
						{
							method: "DELETE"
							
						}).then( (res)=> {
						getFoodconsumption();
						
						})
		
	}
	
	onMount(getFoodconsumption);
	
</script>

<main>
	
		<Alert
			color="danger"
			isOpen={visible}
			toggle={() => (visible = false)}>
			
			Error en los campos al añadir un dato.
		</Alert>
		<div class="mt-3" style="position: absolute; right:80px;">
    					<Button id={`btn-${placement}`}>Buscar</Button>
   						<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
							<ul>
								<li><p>País</p><input bind:value="{newFoodconsumption.country}"></li>
								<li><p>Año</p><input type=number bind:value="{newFoodconsumption.year}"></li>
								<li>
									<FormGroup>
										<Label for="exampleCustomSelect">Tipo de comida</Label>
										<CustomInput type="select" id="exampleCustomSelect" name="customSelect">
										  <option value="">Selecciona</option>
										  <option>Carne</option>
										  <option>Huevos y lácteos</option>
										  <option>Producido</option>
										  <option>Cereales</option>
										  <option>Grasas y azúcares</option>
										</CustomInput>
									</FormGroup>
							    </li>
								<li><p>Calorías por persona</p><input type=number bind:value="{newFoodconsumption.caloryperperson}"></li>
								<li><p>Gramos por persona</p><input type=number bind:value="{newFoodconsumption.gramperperson}"></li>
								<li><p>Gramos diarios</p><input type=number bind:value="{newFoodconsumption.dailygram}"></li>
								<li><p>Calorías diarias</p><input type=number bind:value="{newFoodconsumption.dailycalory}"></li>
								<li><Button on:click={insertFoodconsumption}>Añadir</Button></li>
							</ul>
    					</Popover>
  					</div>
		<Table responsive>
			<thead>
				<tr>
					<td><Button on:click={loadInitialData}>Cargar datos</Button></td>
					<td><Button on:click={deleteTodo}>Borrar datos</Button></td>
					
					
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