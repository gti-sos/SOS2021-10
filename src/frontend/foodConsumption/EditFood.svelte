<script>

	import Header from '../Header.svelte';
	import Alert from 'sveltestrap/src/Alert.svelte';
	let visible = false;
	let color="";

    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};
    let foodconsumption = {};
	
    let updatedCountry = "XXXX";
	let updatedyear = 12345;
	let updatedCaloryperperson = 12345;
	let updatedGramperperson = 12345;
    let updatedDailygram = 12345;
	let updatedDailycalory = 12345;
    let errorMsg = "";

    onMount(getFoodconsumption);

    async function getFoodconsumption() {

        console.log("Fetching contact...");
        const res = await fetch("/api/v2/foodconsumption-stats/" + params.country + "/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            foodconsumption = json;
            updatedCountry = foodconsumption.country;
            updatedyear = parseInt(foodconsumption.year);
			updatedCaloryperperson = parseInt(foodconsumption.caloryperperson);
			updatedGramperperson = parseInt(foodconsumption.gramperperson);
			updatedDailygram = parseInt(foodconsumption.dailygram);
			updatedDailycalory = parseInt(foodconsumption.dailycalory);
		
            console.log("Received foodconsumption.");
        } else {
			errorMsg= "El dato con país " + params.country + "con año " + params.year + " no existe." ;
			visible = true;
			color="danger";
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateFoodconsumption() {

        console.log("Updating foodconsumption..." + JSON.stringify(params.country) + ", " + JSON.stringify(params.year));
		let year = parseInt(params.year);
        const res = await fetch("/api/v2/foodconsumption-stats/" + params.country + "/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
                country:params.country,
				year:year,
				caloryperperson:updatedCaloryperperson,
				gramperperson:updatedGramperperson,
				dailygram: updatedDailygram,
				dailycalory: updatedDailycalory
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getFoodconsumption();
			if(res.ok){
				errorMsg= "Dato actualizado correctamente.";
				visible = true;
				color="success";
			}
			
        });



    }
</script>
<main>
    <Header/>
	<br>
    <h3>Editar consumo de azúcares y grasas <strong>{params.country}, {params.year}</strong></h3>
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
					
					<th>Calorías por persona</th>
					<th>Gramos por persona</th>
					<th>Gramos diarios</th>
					<th>Calorías diarias</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
					<td>{updatedyear}</td>
					<td><input type=number bind:value="{updatedCaloryperperson}"></td>
					<td><input type=number bind:value="{updatedGramperperson}"></td>
					<td><input type=number bind:value="{updatedDailygram}"></td>
					<td><input type=number bind:value="{updatedDailycalory}"></td>
                    <td> <Button outline  color="primary" on:click={updateFoodconsumption}>Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
 
       <Alert
			color={color}
			isOpen={visible}
			toggle={() => (visible = false)}>
			{#if errorMsg}
                <p style="color: #063257 ">{errorMsg}</p>
        	{/if}
		
		</Alert>

    <Button outline color="secondary" on:click="{pop}">Back</Button>
</main>