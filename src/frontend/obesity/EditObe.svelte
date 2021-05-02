<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

	const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let obesity = {};
	let upCountry = "XXXX";
	let upYear = 12345;
	let upMan_percent = 999.9;
	let upWoman_percent = 999.9;
	let upTotal_population = 999;
    let errorMsg = "";
 	let okMsg = "";

    onMount(getObesity);

    async function getObesity() {

        console.log("Fetching data..." + params.country + " " + params.year);
        const res = await fetch(BASE_CONTACT_API_PATH +"/obesity-stats/" + params.country +"/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            obesity = json;
			
			upCountry = obesity[0].country;
	 		upYear = parseInt(obesity[0].year);
			upMan_percent = parseFloat(obesity[0].man_percent);
	 		upWoman_percent = parseFloat(obesity[0].woman_percent);
	 		upTotal_population = parseFloat(obesity[0].total_population);
			
			console.log(JSON.stringify(obesity));
            console.log("Received data.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
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
            getObesity();
        });
    }
	
	
</script>
<main>
    <h3>Editar campos <strong>{params.country}</strong><strong>{params.year}</strong></h3>
        <Table bordered>
            <thead>
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
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
</main>

<style>
  main{
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>