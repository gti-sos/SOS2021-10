<script>
	import {
    	Button
  	} from 'sveltestrap';
	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let sanity = [];
	let NewSanity={
		"country" :"",
		"year": 0,
		"health_expenditure_in_percentage" : 0.0,
		"doctor_per_1000_habitant" : 0.0,
		"hospital_bed" : 0.0
	}
	
	async function SanityData() {
    	console.log("Loading data...");
   		const res = await fetch("/api/v1/sanity-stats/loadInitialData");
		
        if(res.ok){
			console.log("Ok.");
			getSanity();
		}else{
			console.log("Error");
		}
	}

	async function getSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats");
		
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
   		const res = await fetch("/api/v1/sanity-stats",{method:"Delete"}).then( (res)=>{
			   getSanity();
		   })
  	}
	async function DeleteContact(ContactName,ContactYear) {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats/"+ContactName+"/"+ContactYear,{method:"Delete"}).then( (res)=>{
			   getSanity();
		})
		getSanity();
  	}
	async function PostSanity() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v1/sanity-stats",{
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
   		const res = await fetch("/api/v1/sanity-stats/"+NewSanity.country+"/"+NewSanity.year,{
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
	<Table bordered>
		<thead>
			<tr>
				<td>Pais</td>
				<td>Año</td>
				<td>Porcentaje de gasto en sanidad</td>
				<td>Doctores por cada 1000 habitantes</td>
				<td>Camas de hospital</td>
				<td><Button  on:click={SanityData}>Cargar Datos Iniciales</Button></td>
				<td><Button  on:click={Delete}>Borrar Datos</Button></td>
			</tr>
		</thead>
		<tbody>
			
			<tr>
				<td><input bind:value="{NewSanity.country}"></td>
				<td><input bind:value={NewSanity.year}></td>
				<td><input bind:value={NewSanity.health_expenditure_in_percentage}></td>
				<td><input bind:value={NewSanity.doctor_per_1000_habitant}></td>
				<td><input bind:value={NewSanity.hospital_bed}></td>
				<td><Button on:click={PostSanity(NewSanity)}>Subir Dato</Button></td>
				<td><Button on:click={PutSanity(NewSanity)}>Modificar Dato</Button></td>
			</tr>
			{#each sanity as sani}
				<tr>
				<td>{sani.country}</td>
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
	tr {
		max-width: 90px;
	}
	td{
		max-width: 10px;
	}
	
	input{
		max-width: 90px;
	}
	
</style>