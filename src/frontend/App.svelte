<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	
	import ObesitySv from './obesity/ObesitySv.svelte';
	import TableSanity from './sanity/SanityAPI.svelte';
	import EditFood from './foodConsumption/EditFood.svelte';
	import Landing from './Landing.svelte';
	import HomeFood from './foodConsumption/HomeFood.svelte';
	
	
	const routes = {
		"/": Landing,
		"/foodconsumption-stats": HomeFood,
		"/foodconsumption-stats/:country/:year/:foodtype": EditFood,
		"*": NotFound
	}
	
 
  
</script>
<main>
	
	<Router {routes}/>
</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		
	}
	
	ul {
		width: fit-content;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>