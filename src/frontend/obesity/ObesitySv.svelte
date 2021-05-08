<script>

	import {
		onMount
	} from "svelte";
	import Alert from 'sveltestrap/src/Alert.svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	let errorMsg = "";
	let okMsg = "";
	let obesity = [];
	let newObesity = {
		country: "",
		year: "",
		man_percent: "",
		woman_percent: "",
		total_population: "",
		
	};
	let visible = false;
	let visibleOk = false;
	
	
	
	
	
	const BASE_CONTACT_API_PATH = "/api/v1";
	
	async function ObesityData() {
    	console.log("Loading data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/loadInitialData").then( (res)=> {
						getObesity();
						})
		
  	}
	
	async function getObesity() {
    	console.log("Fetching data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats");
		
        if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			obesity = json;
			console.log(`We have ${obesity.length} obesity.`);
		}else{
			console.log("Error");
		}
  	}

	async function insertObesity() {
    	console.log("Inserting data "+ JSON.stringify(newObesity));
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats",
							{
								method: "POST",
								body: JSON.stringify(newObesity),
								headers:{
									"Content-Type": "application/json"
								}
							}
		).then((res) => {
			
			if(res.ok){
				getObesity();
				okMsg = "El dato se introdujo correctamente";
				visibleOk=true;
				visible=false;
			}else if(res.status === 409){
                errorMsg = "Ya existe ese dato";
				visibleOk=false;
				visible=true;
			}else if(res.status === 400){
				errorMsg = "Campo mal introducido";
				visibleOk=false;
				visible=true;
			}
            
		});
	}	
	
	async function deleteObesity(country, year) {
    	console.log(`Deleting data with name ${country} and date ${year}`);
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/"+country+"/"+year,
							{
								method: "DELETE"
								
							}).then( function (res) {
								getObesity();
							})
	}
	
	async function deleteAll(country, year) {
    	console.log("Deleting all data");
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats",{
								method: "DELETE"
								
							}).then( function (res) {
								getObesity();
							})
	}
	
	onMount(getObesity);
	
</script>

<main>
	<Table responsive>
	
		<thead>
			<tr>
				<td><Button on:click={ObesityData}>Cargar datos</Button></td>
				<td><Button on:click={deleteAll}>Borrar datos</Button></td>
					
			</tr>
			<div>
				<Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
					{#if errorMsg}
						<p>ERROR: {errorMsg}</p>
   					{/if}
				</Alert>
				<Alert color="success" isOpen={visibleOk} toggle={() => (visibleOk = false)}>
					{#if okMsg}
						<p>Correcto: {okMsg}</p>
   		 			{/if}
				</Alert>
			</div>
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
				<td><input type=number bind:value="{newObesity.year}"></td>
				<td><input type=number bind:value="{newObesity.man_percent}"></td>
				<td><input type=number bind:value="{newObesity.woman_percent}"></td>
				<td><input type=number bind:value="{newObesity.total_population}"></td>
				<td><Button on:click={insertObesity}>Insertar</Button></td>
			</tr>
			{#each obesity as obe}
				<tr>
				<td><a href="#/obesity-stats/{obe.country}/{obe.year}">{obe.country}</td>
				
				<td>{obe.year}</td>
				<td>{obe.man_percent}</td>
				<td>{obe.woman_percent}</td>
				<td>{obe.total_population}</td>
				<td><Button on:click={deleteObesity(obe.country,obe.year)}>Borrar</Button></td>
				
				
				</tr>
			{/each}
			
		</tbody>
	
	</Table>
</main>


<style>
	td	{
		width: 10px;
	}
	tr {
		max-width: 120px;
		overflow: auto;
	}
	input	{
		max-width: 120px;
	}	
	
</style>
