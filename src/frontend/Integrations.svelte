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
		<Button href="/#/sanity-stats-integrations/1"> G01-Life</Button>
		<Button href="/#/sanity-stats-integrations/2"> G02-Oil Production</Button>
		<Button href="/#/sanity-stats-integrations/3"> G03-Air Pollution</Button>
		<Button href="/#/sanity-stats-integrations/4"> G04-Education</Button>
		<Button href="/#/sanity-stats-integrations/5"> G20-Founds Research</Button>
		<Button href="/#/sanity-stats-integrations/6"> G25-Sales</Button>
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