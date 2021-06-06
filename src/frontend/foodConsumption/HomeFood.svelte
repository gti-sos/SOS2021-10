<script>
	import Header from '../Header.svelte';
	import TableFood from './TableFood.svelte';
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Breadcrumb,
		BreadcrumbItem
	} from 'sveltestrap';

	let open = false;
	
	const toggle = () =>{
		(open = !open);
	}  
</script>

<main>
	<Header/>
	<br>
	<Button outline color="secondary" onclick="window.location.href='#/info'">Volver</Button>
	<h2>
		<strong>API</strong>
	</h2>
	<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats">Estaditicas del Consumo de azúcares y grasas v1</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Alicia Pérez Bolaños</BreadcrumbItem>
			</Breadcrumb>
			<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/foodconsumption-stats">Estaditicas del Consumo de azúcares y grasas v2</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Alicia Pérez Bolaños </BreadcrumbItem>
			</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estadísticas del Consumo de azúcares y grasas:</h5>
			
			  <Button outline color="warning" on:click={toggle}>Abrir</Button>
			  <Modal isOpen={open} {toggle} size="xl">
				<ModalHeader {toggle}>Estadísticas del Consumo de azúcares y grasas:</ModalHeader>
				
					<ModalBody>
						<TableFood/>
					</ModalBody>
				
				<ModalFooter>
				  <Button color="secondary" on:click={toggle}>Cerrar</Button>
				</ModalFooter>
			  </Modal>
	<h5>Gráfica del Consumo de azúcares y grasas:</h5>
			
		<Button outline color="warning" onclick="window.location.href='#/foodconsumption-stats/graphfood'">Gráfico Highcharts</Button>
		<Button outline color="warning" onclick="window.location.href='#/foodconsumption-stats/graphfoodbubbles'">Gráfico FusionCharts</Button>
			
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estadísticas del Consumo de azúcares y grasas </BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14948248/TzJoDfvx">Food_postman v1</a></BreadcrumbItem>
		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14948248/TzRXARnX">Food_postman v2</a></BreadcrumbItem>
	</Breadcrumb>
	
	

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
	
	
</style>