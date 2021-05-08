<script>
		const placement = 'right';
	import {
    	Button
  	} from 'sveltestrap';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";

	import Alert from 'sveltestrap/src/Alert.svelte';
	import Popover from 'sveltestrap/src/Popover.svelte';
	import { CustomInput, Form, FormGroup, Label } from 'sveltestrap';

	
	let visible = false;
	let mensaje="";
	let sanity = [];
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

	async function getFiltro(){
		console.log("Fetching foodconsumption...");
		console.log(filterSanity);
		const res = await fetch("/api/v2/sanity-stats/statistics?country="+filterSanity.country+"&fromyear="+filterSanity.fromyear+"&toyear="+filterSanity.toyear+"&fromhealth="+filterSanity.fromhealth+"&tohealth="+filterSanity.tohealth+"&fromdoctor="+filterSanity.fromdoctor+"&todoctor="+filterSanity.todoctor+"&frombed="+filterSanity.frombed+"&tobed="+filterSanity.tobed);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			sanity= json ;
			console.log(`We have ${sanity.length} sanity.`);
			console.log(JSON.stringify(sanity));
		}
		else{
			console.log("Error!");	
		}
	}



	async function SanityData() {
    	console.log("Loading data...");
   		const res = await fetch("/api/v2/sanity-stats/loadInitialData");
		
        if(res.ok){
			console.log("Ok.");
			getSanity();
		}else{
			console.log("Error");
		}
	}

	async function getSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats");
		
        if(res.ok){
          console.log("Ok.");
          const json = await res.json();
          sanity = json;
          console.log(`We have ${sanity.length} Sanity.`)
        }else{
          console.log("Error");
        }
		if(res.status == 404){
			mensaje="No hemos encontrado ese dato, sorry";
			visible = true;
		}
		if(res.status == 500){
			mensaje="Ups, el server petó, intentalo de nuevo en unos segundos";
			visible = true;
		}
  	}
	async function Delete() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats",{method:"Delete"}).then( (res)=>{
			if(res.status == 404){
				console.log("No hemos encontrado ese dato, sorry");
				visible = true;
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
			}
			if(res.status == 409){
				mensaje="Intestas modificar otro dato CUIDAO";
				visible = true;
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
			}
			if(res.status == 409){
				mensaje="Intestas modificar otro dato CUIDAO";
				visible = true;
			}
			if(res.status == 404){
				mensaje="No hemos encontrado ese dato, sorry";
				visible = true;
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
			
			{mensaje}
		</Alert>
		<div class="mt-3" style="position: absolute; right:80px;">
    					<Button id={`btn-${placement}`}>Filtrar</Button>
   						<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
							<Form>
  								<FormGroup>

								<CustomInput
        						type="checkbox"
       							 id="pais"
        						label="País" ><input bind:value="{filterSanity.country}"></CustomInput>

								<CustomInput
        						type="checkbox"
       							 id="filtrodesdeaño"
        						label="Año desde" ><input type=number bind:value="{filterSanity.fromyear}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrohastaaño"
        						label="Año hasta" ><input type=number bind:value="{filterSanity.toyear}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrodesdesanidad"
        						label="Costes sanidad desde" ><input type=number bind:value="{filterSanity.fromhealth}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrohastasanidad"
        						label="Costes sanidad hasta" ><input type=number bind:value="{filterSanity.tohealth}"></CustomInput><CustomInput
        						type="checkbox"
       							 id="filtrodesdemedicos"
        						label="Médicos desde" ><input type=number bind:value="{filterSanity.fromdoctor}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrohastamedicos"
        						label="Médicos hasta" ><input type=number bind:value="{filterSanity.todoctor}"></CustomInput><CustomInput
        						type="checkbox"
       							 id="filtrodesdecamas"
        						label="Camas desde" ><input type=number bind:value="{filterSanity.frombed}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrohastacamas"
        						label="Camas hasta" ><input type=number bind:value="{filterSanity.tobed}"></CustomInput>
								<br>
								<Button on:click={getFiltro}>Filtrar</Button>
								</FormGroup>
							</Form>
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