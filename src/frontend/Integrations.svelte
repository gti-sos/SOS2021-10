<script>

	import Header from './Header.svelte';
	import {
			Button,
			Modal,
			ModalBody,
			ModalFooter,
			ModalHeader,
			Breadcrumb,
			BreadcrumbItem,
			Collapse,
			Navbar,
			NavbarToggler,
			NavbarBrand,
			Nav,
			NavItem,
			NavLink
		} from 'sveltestrap';
	
  
  
</script>


<main>
	<Header/>




	<div class="position">
	<h1>
		<strong>SOS2021-10</strong>
	</h1>
	<h2>
		Intregraciones Sanidad:
	</h2>
	<ul>
		<Button id="san1" href="/#/sanity-stats-integrations/1"> G01-Life</Button>
		<Button id="san2" href="/#/sanity-stats-integrations/2"> G02-Oil Production</Button>
		<Button id="san3" href="/#/sanity-stats-integrations/3"> G03-Air Pollution</Button>
		<Button id="san4" href="/#/sanity-stats-integrations/4"> G04-Education</Button>
		<Button id="san5" href="/#/sanity-stats-integrations/5"> G20-Founds Research</Button>
		<Button id="san6" href="/#/sanity-stats-integrations/6"> G25-Sales</Button>
		<Button id="san7" href="/#/sanity-stats-integrations/7"> Stress</Button>
		<Button id="san8" href="/#/sanity-stats-integrations/8"> Children</Button>
		<Button id="san9" href="/#/sanity-stats-integrations/9"> Api ext 1</Button>
		<Button id="san10" href="/#/sanity-stats-integrations/10"> API ext 2</Button>
	</ul>

	<h2>
		Intregraciones Consumo de Azúcares y Grasas:
	</h2>
	<ul>
		<Button  class="secondary" onclick="window.location.href='#/foodconsumption-stats/divorce-stats'" >G01-Divorce stats</Button>
		<Button  class="secondary" onclick="window.location.href='/#/foodconsumption-stats/nuts-production'"> G02-Nuts Production</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/wine-production-stats'"> G02-Wine Production</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/international-tourism'"> G03-International tourism</Button>
		<Button  class="secondary" onclick="window.location.href='/#/foodconsumption-stats/poverty-risks'"> G04-Poverty risks</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/children-out-school'"> G24-Children out of school</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/apiext1'"> API Externa 1</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/apiext2'"> API Externa 2</Button>
	</ul>
	<h2>
		Intregraciones Obesidad:
	</h2>
	<ul>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphnatality'" >G01-natality-stats</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphanxiety'" >G11-anxiety-stats</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphilliteracy'" >G04-illiteracy-stats</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphdrugs'" >G23-drugs-stats</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphmental'" >G23-mental-health-stats</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/externa1'" >API Externa 1</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/externa2'" >API Externa 2</Button>
	
	</ul>

</main>

<style>
	.position {
		padding-top: 1cm;
		text-align: center;
		margin: 0 auto;
	}
	h1 {
		font-family: Lucida Console;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>