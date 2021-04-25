<script>
	import MyTable from './MyTable.svelte'; 
	export let name;
</script>

<main>
	<h1>Hello people {name}!</h1>
	<input bind:value={name}>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<MyTable></MyTable>
	<a href="info.html"> View components </a>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>