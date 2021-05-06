<script>

	import Header from '../Header.svelte';
	import Alert from 'sveltestrap/src/Alert.svelte';
	let visible = false;

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
	let updatedFoodtype = "XXXX";
	let updatedCaloryperperson = 12345;
	let updatedGramperperson = 12345;
    let updatedDailygram = 12345;
	let updatedDailycalory = 12345;
    let errorMsg = "";

    onMount(getFoodconsumption);

    async function getFoodconsumption() {

        console.log("Fetching contact...");
        const res = await fetch("/api/v1/foodconsumption-stats/" + params.country + "/" + params.year + "/" + params.foodtype);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            foodconsumption = json;
            updatedCountry = foodconsumption.country;
            updatedyear = parseInt(foodconsumption.year);
			updatedFoodtype = foodconsumption.foodtype;
			updatedCaloryperperson = parseInt(foodconsumption.caloryperperson);
			updatedGramperperson = parseInt(foodconsumption.gramperperson);
			updatedDailygram = parseInt(foodconsumption.dailygram);
			updatedDailycalory = parseInt(foodconsumption.dailycalory);
			visible = false;
            console.log("Received foodconsumption.");
        } else {
			visible = true;
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateFoodconsumption() {

        console.log("Updating foodconsumption..." + JSON.stringify(params.country) + ", " + JSON.stringify(params.year) + ", " + JSON.stringify(params.foodtype));
		let year = parseInt(params.year);
        const res = await fetch("/api/v1/foodconsumption-stats/" + params.country + "/" + params.year + "/" + params.foodtype, {
            method: "PUT",
            body: JSON.stringify({
                country:params.country,
				year:year,
				foodtype: params.foodtype,
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
        });



    }
</script>
<main>
    <Header/>
	<br>
    <h3>Editar consumo de comida <strong>{params.country},{params.year},{params.foodtype}</strong></h3>
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
					<th>Tipo de comida</th>
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
					<td>{updatedFoodtype}</td>
                    <td><input type=number bind:value="{updatedCaloryperperson}"></td>
					<td><input type=number bind:value="{updatedGramperperson}"></td>
					<td><input type=number bind:value="{updatedDailygram}"></td>
					<td><input type=number bind:value="{updatedDailycalory}"></td>
                    <td> <Button outline  color="primary" on:click={updateFoodconsumption}>Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
 
       <Alert
			color="danger"
			isOpen={visible}
			>
			
			No se encuentra este dato.
		</Alert>

    <Button outline color="secondary" on:click="{pop}">Back</Button>
</main>