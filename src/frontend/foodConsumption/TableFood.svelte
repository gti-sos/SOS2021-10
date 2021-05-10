<script>
 	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

    import {
        pop
    } from "svelte-spa-router";
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
	let errorMsg ="";
	let color="";
	
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
	let numeroRecursos = 10;
	let offset = 0;
	let currentPage = 1; 
	let moreData = true; 
	
	function incrementOffset(valor) {
		currentPage += valor;
		
		if(foodconsumption.length===0){
			moreData=false;
		}
		else{
			moreData=true;
		}
		
		getFoodconsumption();
	}
	async function getFoodconsumption(){
	 	let offset = (currentPage-1)*numeroRecursos;
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v1/foodconsumption-stats?offset="+offset+"&limit=10");
		
		
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
	let filterFoodconsumption= {
		country:"",
		year:0,
		foodtype: "",
		caloryperperson:0,
		gramperperson:0,
		dailygram: 0,
		dailycalory: 0
	}
	
	
	async function getFiltro(){
		let offset = (currentPage-1)*numeroRecursos;
		let dbquery= "?offset=" + offset + "&limit=10";
		var e = document.getElementById("myselect");
		var tipocomida = e.options[e.selectedIndex].value;
		
		
		if (document.getElementById('filtroPais').checked){
            dbquery += `country=${filterFoodconsumption.country}`;
			if(document.getElementById('filtroAnyo').checked || document.getElementById('filtroComida').checked || document.getElementById('filtroCalPer').checked || document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
			dbquery +=`&`;
			}
		}
		
		if (document.getElementById('filtroAnyo').checked) {
            dbquery += `year=${filterFoodconsumption.year}`;
			if(document.getElementById('filtroComida').checked || document.getElementById('filtroCalPer').checked || document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroComida').checked) {
            dbquery += `footype=${tipocomida}`;
			if( document.getElementById('filtroCalPer').checked || document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroCalPer').checked) {
            dbquery += `caloryperpersonAbove=${filterFoodconsumption.caloryperperson}`;
			if(document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroGramPer').checked) {
            dbquery += `gramperpersonAbove=${filterFoodconsumption.gramperperson}`;
			if(document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroGramDia').checked) {
            dbquery += `dailygramAbove=${filterFoodconsumption.dailygram}`;
			if(document.getElementById('filtroCalDia').checked){
				dbquery +=`&`;
			}
		}
		if (document.getElementById('filtroCalDia').checked) {
            dbquery += `dailycaloryAbove=${filterFoodconsumption.dailycalory}`
			
		}
		const res = await fetch("/api/v1/foodconsumption-stats" + dbquery);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			foodconsumption= json ;
			console.log(`We have ${foodconsumption.length} foodconsumption.`);
			console.log(JSON.stringify(foodconsumption));
			errorMsg= "Datos filtrados correctamente.";
			visible = true;
			color="success";
		}
		
		else{
			if(res.status === 404){
				errorMsg= "ERROR: No se encuentran tales datos.";
				visible = true;
				color="danger";
			}
		
			console.log("Error!");
			
		}
		
		
		
	}
	
	async function loadInitialData(){
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v1/foodconsumption-stats/loadInitialData").then( (res)=> {
						getFoodconsumption();
						if(res.ok){
						errorMsg= "Datos cargados correctamente.";
							visible = true;
							color="success";
						}
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
					
							errorMsg= "ERROR: Algunos campos en el dato están mal formados.";
							visible = true;
							color="danger";
						}
						else if(res.status ===409){
						
							errorMsg= "ERROR: Este dato ya existe.";
							visible = true;
							color="danger";
						}
						else if(res.ok){
							errorMsg= "El dato ha sido añadido correctamente.";
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
						if(res.ok){
							errorMsg= "El dato ha sido eliminado correctamente.";
							visible = true;
							color="success";
						}
						
						
						})
						
	}
	
	async function deleteTodo(){
		
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption-stats",
						{
							method: "DELETE"
							
						}).then( (res)=> {
						getFoodconsumption();
						if(res.ok){
							errorMsg= "Base de datos eliminada correctamente.";
							visible = true;
							color="success";
						}
						
						})
		
	}
	
	
	
	onMount(getFoodconsumption);
	
	
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
		
		<div class="mt-3" style="position: absolute; right:80px;">
    					<Button id={`btn-${placement}`}>Buscar</Button>
   						<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
							<Form>
  								<FormGroup>
   						 
								<CustomInput
        						type="checkbox"
       							 id="filtroPais"
        						label="País" ><input bind:value="{filterFoodconsumption.country}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroAnyo"
        						label="Año" ><input type=number bind:value="{filterFoodconsumption.year}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroComida"
        						label="Tipo de comida" >
									<FormGroup>
										<CustomInput type="select" id="myselect">
										  <option value="Meat">Carne</option>
										  <option value="DairyAndEggs">Huevos y lácteos</option>
										  <option value="Produce">Producido</option>
										  <option value="Grain">Cereales</option>
										  <option value="SugarAndFat">Grasas y azúcares</option>
										</CustomInput>
									</FormGroup>
							    </CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroCalPer"
        						label="Calorías por persona mayor que" ><input type=number bind:value="{filterFoodconsumption.caloryperperson}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroGramPer"
        						label="Gramos por persona mayor que" ><input type=number bind:value="{filterFoodconsumption.gramperperson}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroGramDia"
        						label="Gramos diarios mayor que" ><input type=number bind:value="{filterFoodconsumption.dailygram}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtroCalDia"
        						label="Calorías diarias mayor que" ><input type=number bind:value="{filterFoodconsumption.dailycalory}"></CustomInput>
								<br>
								<Button on:click={getFiltro}>Filtrar</Button>
								<Button outline color="secondary" on:click="{getFoodconsumption}">Atrás</Button>
								</FormGroup>
							</Form>
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
		<Pagination ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/foodconsumption-stats" on:click="{() => incrementOffset(-1)}" />
		</PaginationItem>
		
		<!-- If we are not in the first page-->
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/foodconsumption-stats" on:click="{() => incrementOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/foodconsumption-stats" >{currentPage}</PaginationLink>
		</PaginationItem>

		<!-- If there are more elements-->
		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/foodconsumption-stats" on:click="{() => incrementOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
			<PaginationLink next href="#/foodconsumption-stats" on:click="{() => incrementOffset(1)}"/>
		</PaginationItem>

	</Pagination>
	
	
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