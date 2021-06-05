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
		caloryperperson:0,
		gramperperson:0,
		dailygram: 0,
		dailycalory: 0
	}
	
	var BASE_CONTACT_API_PATH= "/api/v2";
	
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;
	
	async function paginacion() {
      const data = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats");
      if (data.status == 200) {
        const json = await data.json();
        total = json.length;
        cambiapag(c_page, c_offset);
      } 
    }
	
    function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}
	 
	function cambiapag(page, offset) {
      
      lastPage = Math.ceil(total / 10);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getFoodconsumption();
      }
    } 
	
	async function getFoodconsumption(){
	 
		console.log("Fetching foodconsumption...");
		const res = await fetch("/api/v2/foodconsumption-stats?offset="+c_offset+"&limit=" + limit);
		
		
		if(res.ok){
			console.log("Ok.");
			
			const json = await res.json();
			foodconsumption= json ;
			console.log(`We have ${foodconsumption.length} foodconsumption.`);
			console.log(JSON.stringify(foodconsumption));
			paginacion();
			
		}
		
		else{
			
		
			console.log("Error!");
			
		}
	}
	let filterFoodconsumption= {
		country:"",
		year:0,
		caloryperperson:0,
		gramperperson:0,
		dailygram: 0,
		dailycalory: 0
	}
	
	
	async function getFiltro(){
	
		
		let dbquery= "?";
	
		if (document.getElementById('filtroPais').checked){
            dbquery += `country=${filterFoodconsumption.country}`;
			if(document.getElementById('filtroAnyo').checked  || document.getElementById('filtroCalPer').checked || document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
			dbquery +=`&`;
			}
		}
		
		if (document.getElementById('filtroAnyo').checked) {
            dbquery += `year=${filterFoodconsumption.year}`;
			if(document.getElementById('filtroCalPer').checked || document.getElementById('filtroGramPer').checked || document.getElementById('filtroGramDia').checked || document.getElementById('filtroCalDia').checked){
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
		const res = await fetch("/api/v2/foodconsumption-stats" + dbquery);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			foodconsumption= json ;
			lastPage = Math.ceil(foodconsumption.length / 10);
			errorMsg= "Datos filtrados correctamente.";
			visible = true;
			color="success";
			console.log(dbquery);
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
		const res = await fetch("/api/v2/foodconsumption-stats/loadInitialData").then( (res)=> {
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
	async function deleteFood(country, year){
		console.log("Deleting foodconsumption with country " + JSON.stringify(country) + "and year "+ JSON.stringify(year));
		const res = await fetch(BASE_CONTACT_API_PATH+"/foodconsumption-stats/"+ country+ "/" + year,
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
						
   						 	<ul class="list-inline">
								<li><CustomInput
        						type="checkbox"
       							 id="filtroPais"
        						label="País" ><input bind:value="{filterFoodconsumption.country}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtroAnyo"
        						label="Año" ><input type=number bind:value="{filterFoodconsumption.year}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtroCalPer"
        						label="Calorías por persona mayor que" ><input type=number bind:value="{filterFoodconsumption.caloryperperson}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtroGramPer"
        						label="Gramos por persona mayor que" ><input type=number bind:value="{filterFoodconsumption.gramperperson}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtroGramDia"
        						label="Gramos diarios mayor que" ><input type=number bind:value="{filterFoodconsumption.dailygram}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtroCalDia"
        						label="Calorías diarias mayor que" ><input type=number bind:value="{filterFoodconsumption.dailycalory}"></CustomInput></li>
								<br>
								<Button on:click={getFiltro}>Filtrar</Button>
								<Button outline color="secondary" on:click="{getFoodconsumption}">Atrás</Button>
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
					<td>Calorías por persona</td>
					<td>Gramos por persona</td>
					<td>Gramos diarios</td>
					<td>Calorías diarias</td>

				</tr>
			</thead>
			<tbody>

				<tr>
					<td><input id="paisFood" bind:value="{newFoodconsumption.country}"></td>
					<td><input  id="anyoFood" type=number bind:value="{newFoodconsumption.year}"></td>
					<td><input id="caloryFood" type=number bind:value="{newFoodconsumption.caloryperperson}"></td>
					<td><input id="gramFood" type=number bind:value="{newFoodconsumption.gramperperson}"></td>
					<td><input id="dailycalFood" type=number bind:value="{newFoodconsumption.dailygram}"></td>
					<td><input id="dailygramFood" type=number bind:value="{newFoodconsumption.dailycalory}"></td>
					<td><Button id="addFood" on:click={insertFoodconsumption}>Añadir</Button></td>

				</tr>
				{#each foodconsumption as datafood}
					<tr>

					<td><a href="#/foodconsumption-stats/{datafood.country}/{datafood.year}">{datafood.country}</td>
					<td>{datafood.year}</td>
					<td>{datafood.caloryperperson}</td>
					<td>{datafood.gramperperson}</td>
					<td>{datafood.dailygram}</td>
					<td>{datafood.dailycalory}</td>
					<td><Button on:click={deleteFood(datafood.country,datafood.year)}>Borrar</Button></td>

					</tr>
				{/each}

			</tbody>
		
		</Table>
			<div>
    		
      		<Pagination ariaLabel="Web pagination">
        		<PaginationItem class = {c_page === 1 ? "disabled" : ""}>
          			<PaginationLink previous href="#/foodconsumption-stats" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
        		</PaginationItem>
        		{#each range(lastPage, 1) as page}
          			<PaginationItem class = {c_page === page ? "active" : ""}>
            			<PaginationLink previous href="#/foodconsumption-stats">
            				{page}
            			</PaginationLink>
          			</PaginationItem>
        		{/each}
        		<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
          			<PaginationLink next href="#/foodconsumption-stats" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
        		</PaginationItem>
      		</Pagination>
    
    	</div>
		
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