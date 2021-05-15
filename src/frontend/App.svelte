<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	
	import ObesitySv from './obesity/ObesitySv.svelte';
	import HomeSanity from './sanity/HomeSanity.svelte';
	import EditFood from './foodConsumption/EditFood.svelte';
	import Info from './Info.svelte';
	import Landing from './Landing.svelte';
	import HomeFood from './foodConsumption/HomeFood.svelte';
	import GraphFood from './foodConsumption/GraphFood.svelte';
	import HomeObesity from './obesity/HomeObesity.svelte';
	import EditObe from './obesity/EditObe.svelte';
	import graphconj from './Graphconj.svelte';

	import GraphObeV2 from './obesity/GraphObeV2.svelte';
	import GraphObe from './obesity/GraphObe.svelte';

	import JustOneSanity from './sanity/JustOneSanity.svelte';
	import graph from './sanity/Graph.svelte';
	import graphV2 from './sanity/GraphV2.svelte';

	
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/graphconj": graphconj,
		"/foodconsumption-stats": HomeFood,
		"/foodconsumption-stats/:country/:year": EditFood,
		"/foodconsumption-stats/graphfood": GraphFood,
		"/obesity-stats": HomeObesity,
		"/obesity-stats/:country/:year": EditObe,
		"/obesity-stats/graph": GraphObe,
		"/obesity-stats/graphv2": GraphObeV2,
		"/sanity-stats": HomeSanity,
		"/sanity-stats/:country/:year": JustOneSanity,
		"/sanity-stats-graph/:country": graph,
		"/sanity-stats-graphv2": graphV2,

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