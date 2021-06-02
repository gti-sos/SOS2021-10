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
	import intfood1 from './Integrations/FoodIntegration/G02-nuts-production.svelte';
	import intfood2 from './Integrations/FoodIntegration/G24-children-out.svelte';
	import intfood3 from './Integrations/FoodIntegration/G01-divorce-stats.svelte';
	import intfood4 from './Integrations/FoodIntegration/G02-wine-production-stats.svelte';
	import intfood5 from './Integrations/FoodIntegration/G03-international-tour.svelte';
	import intfood6 from './Integrations/FoodIntegration/G04-poverty-risks.svelte';
	import intfood7 from './Integrations/FoodIntegration/APIEXT1.svelte';
	import intfood8 from './Integrations/FoodIntegration/APIEXT2.svelte';

	
	import HomeObesity from './obesity/HomeObesity.svelte';
	import EditObe from './obesity/EditObe.svelte';
	import graphconj from './Graphconj.svelte';

	import GraphObeV2 from './obesity/GraphObeV2.svelte';
	import GrafoBueno from './obesity/GrafoBueno.svelte';
	import IntegrationObe from './obesity/IntegrationObe.svelte';
	import intobe1 from './Integrations/ObesityInt/G01-natality.svelte';
	import intobe2 from './Integrations/ObesityInt/G11-anxiety.svelte';
	import intobe3 from './Integrations/ObesityInt/G04-illiteracy.svelte';

	import JustOneSanity from './sanity/JustOneSanity.svelte';
	import graph from './sanity/Graph.svelte';
	import graphV2 from './sanity/GraphV2.svelte';
	
	import intsan1 from './Integrations/SanityIntegrations/G01-life.svelte';
	import intsan2 from './Integrations/SanityIntegrations/G02-oilproduction.svelte';
	import intsan3 from './Integrations/SanityIntegrations/G03-airpollution.svelte';
	import intsan4 from './Integrations/SanityIntegrations/G04-education.svelte';
	import intsan5 from './Integrations/SanityIntegrations/G20-founsresearch.svelte';
	import intsan6 from './Integrations/SanityIntegrations/G25-sales.svelte';
	import ext1 from './Integrations/SanityIntegrations/ext1.svelte';
	import ext2 from './Integrations/SanityIntegrations/ext2.svelte';

	
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/integrations": integrations,
		"/graphconj": graphconj,
		"/foodconsumption-stats": HomeFood,
		"/foodconsumption-stats/:country/:year": EditFood,
		"/foodconsumption-stats/graphfood": GraphFood,
		"/foodconsumption-stats/graphfoodbubbles": GraphFoodBubbles,
		"/foodconsumption-stats/nuts-production": intfood1,
		"/foodconsumption-stats/children-out-school": intfood2,
		"/foodconsumption-stats/divorce-stats": intfood3,
		"/foodconsumption-stats/wine-production-stats": intfood4,
		"/foodconsumption-stats/international-tourism": intfood5,
		"/foodconsumption-stats/poverty-risks": intfood6,
		"/foodconsumption-stats/APIEXT1": intfood7,
		"/foodconsumption-stats/APIEXT2": intfood8,

		
		"/obesity-stats": HomeObesity,
		"/obesity-stats/:country/:year": EditObe,
		"/obesity-stats/graph": GrafoBueno,
		"/obesity-stats/graphv2": GraphObeV2,
		"/obesity-stats/IntegrationObe": IntegrationObe,
		"/obesity-stats/graphnatality": intobe1,
		"/obesity-stats/graphanxiety": intobe2,
		"/obesity-stats/graphilliteracy": intobe3,


		"/sanity-stats": HomeSanity,
		"/sanity-stats/:country/:year": JustOneSanity,
		"/sanity-stats-graph/:country": graph,
		"/sanity-stats-graphv2": graphV2,
		"/sanity-stats-integrations/1": intsan1,
		"/sanity-stats-integrations/2": intsan2,
		"/sanity-stats-integrations/3": intsan3,
		"/sanity-stats-integrations/4": intsan4,
		"/sanity-stats-integrations/5": intsan5,
		"/sanity-stats-integrations/6": intsan6,
		"/sanity-stats-integrations/9": ext1,
		"/sanity-stats-integrations/10": ext2,

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