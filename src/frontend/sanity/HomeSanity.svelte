<script>
	import Header from '../Header.svelte';
	import SanityTable from './SanityAPI.svelte';
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Breadcrumb,
		BreadcrumbItem,
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
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/sanity-stats">Estaditicas de Sanidad V1</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Antonio José Díaz González</BreadcrumbItem>
			</Breadcrumb>
			<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/sanity-stats">Estaditicas de Sanidad V2</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Antonio José Díaz González</BreadcrumbItem>
			</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estaditicas de Sanidad:</h5>
			
			  <Button outline id="tablaDatos"color="warning" on:click={toggle}>Abrir</Button>
			  <Modal isOpen={open} {toggle} size="xl">
				<ModalHeader {toggle}>Estadísticas de sanidad</ModalHeader>
				
					<ModalBody>
						<SanityTable/>
					</ModalBody>
				
				<ModalFooter>
				  <Button id="cerrar" color="secondary" on:click={toggle}>Cerrar</Button>
				</ModalFooter>

			  </Modal>
			  <Button outline id="canvas" color="warning">
				  <a style="text-decoration: none" href="#/sanity-stats-grafica">Gráfica Canvasjs</a></Button>
				<Button outline id="otragrafica" color="warning">
					<a style="text-decoration: none" href="#/sanity-stats-graphv2">Gráfica 2</a></Button>
			
			
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estaditicas de Sanidad</BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/9683594/TzJoE1Qx">Sanity_postmanv1</a></BreadcrumbItem>
	</Breadcrumb>
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estaditicas de Sanidad</BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/9683594/TzRShoHD">Sanity_postmanv2</a></BreadcrumbItem>
	</Breadcrumb>
	
	<Button outline id="integraciones" color="warning">
		<a style="text-decoration: none" href="#/Integrations">Integraciones</a></Button>

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
	
	
</style>