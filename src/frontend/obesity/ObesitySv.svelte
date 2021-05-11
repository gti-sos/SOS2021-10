<script>

	import {
		onMount
	} from "svelte";
	const placement = 'right';


	import Alert from 'sveltestrap/src/Alert.svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Popover from 'sveltestrap/src/Popover.svelte';
	import { CustomInput, Form, FormGroup, Label } from 'sveltestrap';
	import {Pagination, PaginationItem, PaginationLink } from "sveltestrap";
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
	
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;
	
	const BASE_CONTACT_API_PATH = "/api/v2";
	
	async function ObesityData() {
    	console.log("Loading data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/loadInitialData").then( (res)=> {
						getObesity();
						okMsg = "Los datos se introdujeron correctamente";
						visibleOk=true;
						visible=false;
						})
		
  	}
	
	async function getObesity() {
    	console.log("Fetching data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			obesity = json;
			console.log(`We have ${obesity.length} obesity.`);
			paginacion();
		}else{
			console.log("Error");
			
		}
  	}

let filterObesity= {
		country:"",
		fromyear:0,
		toyear:0,
		man_percent: 0.0,
		woman_percent:0.0,
		total_population:0
	}
	
	
	async function getFiltro(){
		let dbquery= "?";
		var e = document.getElementById("myselect");
		
		
		if (document.getElementById('filtroPais').checked){
            dbquery += `country=${filterObesity.country}`;
			if(document.getElementById('filtroAnyoFrom').checked || document.getElementById('filtroAnyoTo').checked || document.getElementById('filtroMan').checked || document.getElementById('filtroWoman').checked || document.getElementById('filtroTotal').checked){
			dbquery +=`&`;
			}
		}
		
		if (document.getElementById('filtroAnyoFrom').checked) {
            dbquery += `fromyear=${filterObesity.fromyear}`;
			if(document.getElementById('filtroAnyoTo').checked || document.getElementById('filtroMan').checked || document.getElementById('filtroWoman').checked || document.getElementById('filtroTotal').checked ){
				dbquery +=`&`;
			}
			
		}
		
		if (document.getElementById('filtroAnyoTo').checked) {
            dbquery += `toyear=${filterObesity.toyear}`;
			if(document.getElementById('filtroMan').checked || document.getElementById('filtroWoman').checked || document.getElementById('filtroTotal').checked ){
				dbquery +=`&`;
			}
			
		}
		
		if (document.getElementById('filtroMan').checked) {
            dbquery += `man_percent=${filterObesity.man_percent}`;
			if(document.getElementById('filtroWoman').checked || document.getElementById('filtroTotal').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroWoman').checked) {
            dbquery += `woman_percent=${filterObesity.woman_percent}`;
			if(document.getElementById('filtroTotal').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroTotal').checked) {
            dbquery += `total_population=${filterObesity.total_population}`
			
		}
		const res = await fetch("/api/v2/obesity-stats" + dbquery);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			obesity= json ;
			if(obesity.length>0){
			okMsg = "Datos filtrados";
			visibleOk=true;
			visible=false;
			console.log(`We have ${obesity.length} obesity.`);
			console.log(JSON.stringify(obesity));
			}else{
			errorMsg = "No se encuentran datos con los filtros seleccionados";
			visibleOk=false;
			visible=true;
			console.log("Error!");
			
		}
		
		}
		
	}


	async function paginacion() {
      const data = await fetch(BASE_CONTACT_API_PATH + "/obesity-stats");
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
        getObesity();
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
								okMsg = "Dato eliminado";
								visibleOk=true;
								visible=false;
							})
	}
	
	async function deleteAll(country, year) {
    	console.log("Deleting all data");
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats",{
								method: "DELETE"
								
							}).then( function (res) {
							if(res.ok){
								getObesity();
								okMsg = "Todos los datos se han eliminado";
								visibleOk=true;
								visible=false;
							}else{
								errorMsg = "No hay datos que borrar";
								visibleOk=false;
								visible=true;
							}
							})
	}
	
	onMount(getObesity);
	
</script>

<main>
	
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
	
	
	<div class="mt-3" style="position: absolute; right:80px;">
    	<Button id={`btn-${placement}`}>Buscar</Button>
   		<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
			<Form>
  				<FormGroup>
   						 
					<CustomInput type="checkbox" id="filtroPais" label="País" ><input bind:value="{filterObesity.country}"></CustomInput>
					<CustomInput type="checkbox" id="filtroAnyoFrom" label="Desde el año:" ><input type=number bind:value="{filterObesity.fromyear}"></CustomInput>
					<CustomInput type="checkbox" id="filtroAnyoTo" label="Antes el año:" ><input type=number bind:value="{filterObesity.toyear}"></CustomInput>
					<CustomInput type="checkbox" id="filtroMan" label="Porcentaje de hombres" ><input type=number bind:value="{filterObesity.man_percent}"></CustomInput>
					<CustomInput type="checkbox" id="filtroWoman" label="Porcentaje de mujeres" ><input type=number bind:value="{filterObesity.woman_percent}"></CustomInput>
					<CustomInput type="checkbox" id="filtroTotal" label="Población total" ><input type=number bind:value="{filterObesity.total_population}"></CustomInput>
					<br>
					<Button on:click={getFiltro}>Filtrar</Button>
					<Button outline color="secondary" on:click="{getObesity}">Atrás</Button>
				</FormGroup>
			</Form>
    	</Popover>
  	</div>
	
	
	
	<Table responsive>
	
		<thead>
			<tr>
				<td><Button on:click={ObesityData}>Cargar datos</Button></td>
				<td><Button on:click={deleteAll}>Borrar datos</Button></td>
					
			</tr>
			
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
		<div>
    		
      		<Pagination ariaLabel="Web pagination">
        		<PaginationItem class = {c_page === 1 ? "enable" : ""}>
          			<PaginationLink previous href="#/obesity-stats" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
        		</PaginationItem>
        		{#each range(lastPage, 1) as page}
          			<PaginationItem class = {c_page === page ? "active" : ""}>
            			<PaginationLink previous href="#/obesity-stats" on:click={() => cambiapag(page, (page - 1) * 10)}>
            				{page}
            			</PaginationLink>
          			</PaginationItem>
        		{/each}
        		<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
          			<PaginationLink next href="#/obesity-stats" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
        		</PaginationItem>
      		</Pagination>
    
    	</div>
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
