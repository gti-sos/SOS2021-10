<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	
	import ObesitySv from './obesity/ObesitySv.svelte';
	import HomeSanity from './sanity/HomeSanity.svelte';
	import EditFood from './foodConsumption/EditFood.svelte';
	import Info from './Info.svelte';
	import Landing from './Landing.svelte';
	import integrations from './Integrations.svelte';
	
	import HomeFood from './foodConsumption/HomeFood.svelte';
	import GraphFood from './foodConsumption/GraphFood.svelte';
	import GraphFoodBubbles from './foodConsumption/GraphFoodBubbles.svelte';
	import IntegrationAPI from './foodConsumption/IntegrationAPI.svelte';
	import intfood1 from './Integrations/FoodIntegration/G02-nuts-production.svelte';
	import intfood2 from './Integrations/FoodIntegration/G24-children-out.svelte';

	
	import HomeObesity from './obesity/HomeObesity.svelte';
	import EditObe from './obesity/EditObe.svelte';
	import graphconj from './Graphconj.svelte';

	import GraphObeV2 from './obesity/GraphObeV2.svelte';
	import GraphObe from './obesity/GraphObe.svelte';
	import IntegrationObe from './obesity/IntegrationObe.svelte';

	import JustOneSanity from './sanity/JustOneSanity.svelte';
	import graph from './sanity/Graph.svelte';
	import graphV2 from './sanity/GraphV2.svelte';
	
	import intsan1 from './Integrations/SanityIntegrations/G01-life.svelte';
	import intsan2 from './Integrations/SanityIntegrations/G04-education.svelte';

	
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/integrations": integrations,
		"/graphconj": graphconj,
		"/foodconsumption-stats": HomeFood,
		"/foodconsumption-stats/:country/:year": EditFood,
		"/foodconsumption-stats/graphfood": GraphFood,
		"/foodconsumption-stats/graphfoodbubbles": GraphFoodBubbles,
		"/foodconsumption-stats/IntegrationAPI": IntegrationAPI,
		"/foodconsumption-stats/nuts-production-Integration": intfood1,
		"/foodconsumption-stats/children-out-school": intfood2,
		
		"/obesity-stats": HomeObesity,
		"/obesity-stats/:country/:year": EditObe,
		"/obesity-stats/graph": GraphObe,
		"/obesity-stats/graphv2": GraphObeV2,
		"/obesity-stats/IntegrationObe": IntegrationObe,
		"/sanity-stats": HomeSanity,
		"/sanity-stats/:country/:year": JustOneSanity,
		"/sanity-stats-graph/:country": graph,
		"/sanity-stats-graphv2": graphV2,
		"/sanity-stats-integrations/1": intsan1,
		"/sanity-stats-integrations/2": intsan2,

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