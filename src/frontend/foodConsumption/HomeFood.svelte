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
	
	<h2>
		<strong>API</strong>
	</h2>
	<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats">Estaditicas del Consumo de Comida</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Alicia Pérez Bolaños</BreadcrumbItem>
			</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estaditicas del Consumo de Comida:</h5>
			
			  <Button outline color="warning" on:click={toggle}>Abrir</Button>
			  <Modal isOpen={open} {toggle} size="xl">
				<ModalHeader {toggle}>Estadísticas de consumo de comida</ModalHeader>
				
					<ModalBody>
						<TableFood/>
					</ModalBody>
				
				<ModalFooter>
				  <Button color="secondary" on:click={toggle}>Cerrar</Button>
				</ModalFooter>
			  </Modal>
	<h5>Gráfica del Consumo de Comida:</h5>
			
		<Button outline color="warning"><a href="#/foodconsumption-stats/graphfood">Abrir</a></Button>
			
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estaditicas del Consumo de Comida </BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14948248/TzJoDfvx">Food_postman</a></BreadcrumbItem>
	</Breadcrumb>
	
	

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
	
	
</style>