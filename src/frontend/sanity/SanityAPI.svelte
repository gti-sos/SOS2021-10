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
import Sanityfilter from './Sanityfilter.svelte';
import { get } from 'svelte/store';
	
	let visible = false;

	let sanity = [];
	let NewSanity={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
	let filterSanity= {
		from:0,
		to:0
	}

	async function getFiltro(){
		let dbquery= {};
		console.log("Fetching foodconsumption...");
		console.log(filterSanity);
		const res = await fetch("/api/v2/sanity-stats/statistics?from="+filterSanity.from+"&to="+filterSanity.to);
		
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
  	}
	async function Delete() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats",{method:"Delete"}).then( (res)=>{
			   getSanity();
		   })
  	}
	async function DeleteContact(ContactName,ContactYear) {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/sanity-stats/"+ContactName+"/"+ContactYear,{method:"Delete"}).then( (res)=>{
			   getSanity();
		})
		getSanity();
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
			
			Error en los campos al añadir un dato.
		</Alert>
		<div class="mt-3" style="position: absolute; right:80px;">
    					<Button id={`btn-${placement}`}>Buscar</Button>
   						<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
							<Form>
  								<FormGroup>
   						 
								<CustomInput
        						type="checkbox"
       							 id="filtrodesde"
        						label="Desde" ><input type=number bind:value="{filterSanity.from}"></CustomInput>
								<CustomInput
        						type="checkbox"
       							 id="filtrohasta"
        						label="Hasta" ><input type=number bind:value="{filterSanity.to}"></CustomInput>
								<br>
								<Button on:click={getFiltro}>Filtrar</Button>
								</FormGroup>
							</Form>
    					</Popover>
  					</div>




	<Table responsive>
		<thead>
			<tr>
				<td><Button  on:click={SanityData}>Cargar Datos</Button></td>
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