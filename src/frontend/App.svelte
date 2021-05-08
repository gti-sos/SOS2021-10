<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	
	import ObesitySv from './obesity/ObesitySv.svelte';
	import HomeSanity from './sanity/HomeSanity.svelte';
	import EditFood from './foodConsumption/EditFood.svelte';
	import Info from './Info.svelte';
	import Landing from './Landing.svelte';
	import HomeFood from './foodConsumption/HomeFood.svelte';
	import HomeObesity from './obesity/HomeObesity.svelte';
	import EditObe from './obesity/EditObe.svelte';
	import JustOneSanity from './sanity/JustOneSanity.svelte';
	import FromTo from './sanity/FromTo.svelte';
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/foodconsumption-stats": HomeFood,
		"/foodconsumption-stats/:country/:year/:foodtype": EditFood,
		"/obesity-stats": HomeObesity,
		"/obesity-stats/:country/:year": EditObe,
		"/sanity-stats": HomeSanity,
		"/sanity-stats/:country/:year": JustOneSanity,
	//	"/sanity-stats/statistics/from/:in/to/:t": FromTo,
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