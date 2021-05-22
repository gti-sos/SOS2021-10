<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	
	import ObesitySv from './obesity/ObesitySv.svelte';

	
	

	
	import HomeObesity from './obesity/HomeObesity.svelte';
	import EditObe from './obesity/EditObe.svelte';




	
	
	
	const routes = {
		
		"/": HomeObesity,
		"/obesity-stats/:country/:year": EditObe,
		
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
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>