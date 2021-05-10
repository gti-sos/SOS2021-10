<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


	import Alert from "sveltestrap/src/Alert.svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
	
	const colors= [
   	 	'primary',
   		'secondary',
   		 'success',
   		 'danger',
   		 'warning',
   		 'info',
   		 'light',
   		 'dark'
 	];
	

	const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let obesity = {};
	let upCountry = "XXXX";
	let upYear = 12345;
	let upMan_percent = 123.4;
	let upWoman_percent = 123.4;
	let upTotal_population = 12345;
    let errorMsg = "";
 	let okMsg = "";
	let visible = false;
	let visibleOk = false;

    onMount(getObesity);

    async function getObesity() {

        console.log("Fetching data..." + params.country + " " + params.year);
        const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/" + params.country +"/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            obesity = json;
			
			upCountry = obesity.country;
	 		upYear = parseInt(obesity.year);
			upMan_percent = parseFloat(obesity.man_percent);
	 		upWoman_percent = parseFloat(obesity.woman_percent);
	 		upTotal_population = parseFloat(obesity.total_population);
			
			console.log(JSON.stringify(obesity));
            console.log("Received data.");
        } else {
			if(res-status === 404){
            	errorMsg = `No existe dato con pais: ${obesity.country} y fecha: ${obesity.year}`;
            	console.log("ERROR!" + errorMsg);
			} else if (res.status === 500) {
        		errorMsg = "No se han podido acceder a la base de datos";
      		}
			
      		console.log("ERROR!" + errorMsg);
        }
    }


    async function updateObesity() {

        console.log("Updating data..." + JSON.stringify(params.country) + ", " + JSON.stringify(params.year));
		let year = parseInt(params.year);
		
		
        const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/" + params.country +"/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
               	country: params.country,
          		year: year,
          		man_percent: parseFloat(upMan_percent),
          		woman_percent: parseFloat(upWoman_percent),
          		total_population: parseInt(upTotal_population),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
			if(res.ok){
				console.log("Ok.");
				getObesity();
				okMsg = "Actualización correcta";
				visibleOk=true;
				visible=false;
				
			}else{
				if(res.status === 404){
					errorMsg ="El dato solicitado no existe";
					visibleOk=false;
					visible=true;
				}
			}
			
			getObesity();
			console.log("ERROR!" + errorMsg);
            
        });
    }
	
	
</script>
<main>
    <h3>Editar campos <strong>{params.country}</strong><strong>{params.year}</strong></h3>
        <Table bordered>
            <thead>
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
                    <td>{upCountry}</td>
					<td>{upYear}</td>
                    <td><input type=number bind:value="{upMan_percent}"></td>
					<td><input type=number bind:value="{upWoman_percent}"></td>
					<td><input type=number bind:value="{upTotal_population}"></td>
					<td><Button on:click={updateObesity}>Actualizar</Button></td>
                    
                </tr>
        	</tbody>
        </Table>
		
		
		<Button outline color="secondary" on:click="{pop}">Volver</Button>
		
</main>

<style>
  main{
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>