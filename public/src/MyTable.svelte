<script>

	import {
		onMount
	} from "svelte";
	
	import Table from "sveltestrap/src/Table.svelte";
	let contacts = [];
	
	async function getContacts(){
		console.log("Fetching contacts...");
		const res = await fetch("/contacts");
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			contacts = json;
			console.log('We have ${contacts.length} contacts.');
		}else{
			console.log("Error!");
		}
	}
	
	onMount(getContacts);
	
</script>

<main>
	<Table bordered>
		<thead>
			<tr>
				<td>Name</td>
				<td>Phone</td>
			</tr>
		</thead>
		<tbody>
			{#each contacts as contact}
				<tr>
				<td>{contact.name}</td>
				<td>{contact.phone}</td>
				
				</tr>
			{/each}
			
		</tbody>
	</Table>
</main>
