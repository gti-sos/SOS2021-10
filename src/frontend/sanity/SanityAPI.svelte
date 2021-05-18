<script>

	const placement = 'right';
	import {
    	Button
  	} from 'sveltestrap';
	import {
		onMount
	} from "svelte";
	let prueba=0;
	import Table from "sveltestrap/src/Table.svelte";

	import Alert from 'sveltestrap/src/Alert.svelte';
	import Popover from 'sveltestrap/src/Popover.svelte';
	import { CustomInput, Form, FormGroup, Label } from 'sveltestrap';
	
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	let visible = false;
	let visibleok=false;
	let mensaje="";
	let mensajeOk="";
	let sanity= [];
	let NewSanity={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
	let filterSanity= {
		country:"",
		fromyear:0,
		toyear:0,
		fromhealth:0,
		tohealth:0,
		fromdoctor:0,
		todoctor:0,
		frombed:0,
		tobed:0
	}
///////////////
let numeroRecursos = 10;
	let currentPage = 1; 
	let filtrar = false; 




 function incrementOffset(valor) {
		currentPage += valor;
		if(sanity.length<(currentPage+1)*numeroRecursos){moreData=false}
		getSanity();
	}





	async function paginacion() {
      const data = await fetch("/api/v2/sanity-stats");
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
     // console.log("Last page = " + lastPage);
     if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getSanity();
     }
    } 
///////////////////
	let c_offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;
	async function getFiltro(){
		if(!filtrar){c_page=1;}
		filtrar = true; 
		console.log("Fetching foodconsumption...");
		console.log(filterSanity);
		
		console.log(c_page+" "+lastPage)
        c_offset = (c_page-1)*numeroRecursos;
		console.log(c_offset+" "+limit)
		
		const res2 = await fetch("/api/v2/sanity-stats/statistics?country="+filterSanity.country+"&fromyear="+filterSanity.fromyear+"&toyear="+filterSanity.toyear+"&fromhealth="+filterSanity.fromhealth+"&tohealth="+filterSanity.tohealth+"&fromdoctor="+filterSanity.fromdoctor+"&todoctor="+filterSanity.todoctor+"&frombed="+filterSanity.frombed+"&tobed="+filterSanity.tobed);
		if(res2.ok){
			console.log("Ok.");
			const json = await res2.json();
			let sanity2= json ;
			console.log("san->")
			console.log(sanity2)
			lastPage =Math.ceil(sanity2.length / 10);}
		const res = await fetch("/api/v2/sanity-stats/statistics?country="+filterSanity.country+"&fromyear="+filterSanity.fromyear+"&toyear="+filterSanity.toyear+"&fromhealth="+filterSanity.fromhealth+"&tohealth="+filterSanity.tohealth+"&fromdoctor="+filterSanity.fromdoctor+"&todoctor="+filterSanity.todoctor+"&frombed="+filterSanity.frombed+"&tobed="+filterSanity.tobed+"&offset="+c_offset+"&limit="+limit);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			sanity= json ;
			console.log(`We have ${sanity.length} sanity.`);
			console.log(sanity);
		if(sanity.length>0){
				mensajeOk = "Datos filtrados";
				visibleok=true;
				visible=false;
				console.log(`We have ${sanity.length} sanity.`);
				
			}else{
				mensaje = "No se encuentran datos con los filtros seleccionados";
				visibleok=false;
				visible=true;
				console.log("Error!");
			
			}
		}
	}



	async function SanityData() {
    	console.log("Loading data...");
   		const res = await fetch("/api/v2/sanity-stats/loadInitialData");
		
		 
        if(res.ok){
			console.log("Ok.");
			getSanity();
			if(mensajeOk!=""){
			mensajeOk="GG, datos conseguidos";
			visibleok=true;
			visible=false;}
		}else{
			console.log("Error");
		}
	}

	async function getSanity() {
    	console.log("Fetching data...");
        let offset = (currentPage-1)*numeroRecursos;



		if(filtrar){
			getFiltro();
		}
		else{
			const res = await fetch("/api/v2/sanity-stats?offset="+c_offset+"&limit="+limit);
			console.log(offset+"  lim="+limit);
			if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			sanity = json;
			paginacion();
			console.log(`We have ${sanity.length} Sanity.`)
			}else{
			console.log("Error");
			}
			if(res.status == 404){
				mensaje="No hemos encontrado ese dato, sorry";
				visible = true;
				visibleok=false;
			}
			if(res.status == 500){
				mensaje="Ups, el server petó, intentalo de nuevo en unos segundos";
				visible = true;
				visibleok=false;
			}
		}
  	}
	async function Delete() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats",{method:"Delete"}).then( (res)=>{
			if(res.status == 404){
				mensaje="No hemos encontrado ese dato, sorry";
				visible = true;
				visibleok=false;
			}if(res.ok){
				mensajeOk="datos borrados";
				visible = false;
				visibleok=true;
			}
			   getSanity();
		   })
		   
  	}
	async function DeleteContact(ContactName,ContactYear) {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats/"+ContactName+"/"+ContactYear,{method:"Delete"}).then( (res)=>{
			if(res.status == 404){
				mensaje="No hemos encontrado ese dato, sorry";
			visible = true;
			visibleok=false;
		}if(res.ok){
				mensajeOk=ContactName+" "+ContactYear+" borrado";
				visible = false;
				visibleok=true;
			}
			   getSanity();
		})
		
  	}
	async function PostSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats",{
			   method:"POST", 
			   body:JSON.stringify(NewSanity),
			   headers:{
				   "Content-Type":"application/json"
			   }
			}).then( (res)=>{
				if(res.status == 400){
					mensaje="Campos mal definidos";
				visible = true;
			visibleok=false;
			}if(res.ok){
					mensajeOk="Dato creado";
				visible = false;
			visibleok=true;
			}
			if(res.status == 409){
				mensaje="Dato ya creado";
				visible = true;
			visibleok=false;
			}
			   getSanity();
		   })
		  
			
  	}
	  async function PutSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats/"+NewSanity.country+"/"+NewSanity.year,{
			   method:"PUT", 
			   body:JSON.stringify(NewSanity),
			   headers:{
				   "Content-Type":"application/json"
			   }
			}).then( (res)=>{
				if(res.status == 400){
					mensaje="Campos mal definidos";
				visible = true;
			visibleok=false;
			}
			if(res.status == 409){
				mensaje="Intestas modificar otro dato CUIDAO";
				visible = true;
			visibleok=false;
			}
			if(res.status == 404){
				mensaje="No hemos encontrado ese dato, sorry";
				visible = true;
			visibleok=false;
			}
			   getSanity();
		   })
		   
  	}
	onMount(getSanity);
</script>

<main>
	
		<Alert
			color="danger"
			isOpen={visible}
			toggle={() => (visible = false)}>
			{#if mensaje}
			{mensaje}
			{/if}
		</Alert>
		<Alert
			color="success"
			isOpen={visibleok}
			toggle={() => (visibleok = false)}>
			{#if mensajeOk}
			{mensajeOk}
			{/if}
		</Alert>
		<div class="mt-3" style="position: absolute; right:80px;">
    					<Button id={`btn-${placement}`}>Filtrar</Button>
   						<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
							<ul class="list-inline">

								<li><CustomInput
        						type="checkbox"
       							 id="pais"
        						label="País" ><input bind:value="{filterSanity.country}"></CustomInput></li>

								<li><CustomInput
        						type="checkbox"
       							 id="filtrodesdeaño"
        						label="Año desde" ><input type=number bind:value="{filterSanity.fromyear}"></CustomInput></li>
								
								<li><CustomInput
        						type="checkbox"
       							 id="filtrohastaaño"
        						label="Año hasta" ><input type=number bind:value="{filterSanity.toyear}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtrodesdesanidad"
        						label="Costes sanidad desde" ><input type=number bind:value="{filterSanity.fromhealth}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtrohastasanidad"
        						label="Costes sanidad hasta" ><input type=number bind:value="{filterSanity.tohealth}"></CustomInput></li>
								
								<li><CustomInput
        						type="checkbox"
       							 id="filtrodesdemedicos"
        						label="Médicos desde" ><input type=number bind:value="{filterSanity.fromdoctor}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtrohastamedicos"
        						label="Médicos hasta" ><input type=number bind:value="{filterSanity.todoctor}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtrodesdecamas"
        						label="Camas desde" ><input type=number bind:value="{filterSanity.frombed}"></CustomInput></li>
								<li><CustomInput
        						type="checkbox"
       							 id="filtrohastacamas"
        						label="Camas hasta" ><input type=number bind:value="{filterSanity.tobed}"></CustomInput></li>
								<br>
								<Button on:click={getFiltro}>Filtrar</Button>
							</ul>
    					</Popover>
  					</div>




	<Table responsive>
		<thead>
			<tr>
				<td><Button  on:click={SanityData}>Cargar Datos Iniciales</Button></td>
				<td><Button  on:click={Delete}>Borrar Datos</Button></td>
			</tr>
			<tr>
				<td>Pais</td>
				<td>Año</td>
				<td>Porcentaje de gasto en sanidad</td>
				<td>Doctores por cada 1000 habitantes</td>
				<td>Camas de hospital</td>
			</tr>
		</thead>
		<tbody>
			
			<tr>
				<td><input bind:value="{NewSanity.country}"></td>
				<td><input type=number bind:value={NewSanity.year}></td>
				<td><input type=number bind:value={NewSanity.health_expenditure_in_percentage}></td>
				<td><input type=number bind:value={NewSanity.doctor_per_1000_habitant}></td>
				<td><input type=number bind:value={NewSanity.hospital_bed}></td>
				<td><Button on:click={PostSanity(NewSanity)}>Subir Dato</Button></td>
				<td><Button on:click={PutSanity(NewSanity)}>Modificar Dato</Button></td>
			</tr>
			{#each sanity as sani}
				<tr>
				<td><a href="#/sanity-stats/{sani.country}/{sani.year}">{sani.country}</td>
				<td>{sani.year}</td>
				<td>{sani.health_expenditure_in_percentage}</td>
				<td>{sani.doctor_per_1000_habitant}</td>
				<td>{sani.hospital_bed}</td>
				<td><Button Button color="secondary" on:click={DeleteContact(sani.country,sani.year)}>Borrar Datos</Button></td>
				
				
				</tr>
			{/each}
			
		</tbody>
		
	</Table>

	<Pagination ariaLabel="Web pagination">
		<PaginationItem class = {c_page === 1 ? "disabled" : ""}>
			  <PaginationLink previous href="#/sanity-stats" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
		</PaginationItem>
		{#each range(lastPage, 1) as page}
			  <PaginationItem class = {c_page === page ? "active" : ""}>
				<PaginationLink previous href="#/sanity-stats" on:click={() => cambiapag(page, (page - 1) * 10)}>
					{page}
				</PaginationLink>
			  </PaginationItem>
		{/each}
		<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
			  <PaginationLink next href="#/sanity-stats" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
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