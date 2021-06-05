<script>
	import Header from '../Header.svelte';
	import ObesitySv from './ObesitySv.svelte';
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Breadcrumb,
		BreadcrumbItem,
	} from 'sveltestrap';
	
	let openob = false;
	
	const toggleob = () =>{
		(openob = !openob);
	}  
</script>

<main>
	<Header/>
	
	<h2>
		<strong>API</strong>
	</h2>
	<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/obesity-stats">Estaditicas de Obesidad</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
	</Breadcrumb>
	<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/obesity-stats">Estaditicas de Obesidad v2</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
	</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estaditicas de Obesidad:</h5>
	
		<Button outline color="warning" on:click={toggleob}>Abrir</Button>
		<Modal isOpen={openob} {toggleob} size= 'xl'>
			<ModalHeader {toggleob}>Estadísticas de obesidad</ModalHeader>
			<ModalBody>
				<ObesitySv/>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" on:click={toggleob}>Cerrar</Button>
			</ModalFooter>
		</Modal>
	<br/>	
	<h5>Gráfica de Obesidad:</h5>		
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graph'" >Gráfica 1(AnyChart)</Button>
		<Button  class="secondary" onclick="window.location.href='#/obesity-stats/graphv2'" >Gráfica 2(HighCharts)</Button>
	<br/>
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estaditicas de Obesidad </BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14950492/TzJoDfvw">Obesity_postman</a></BreadcrumbItem>
	</Breadcrumb>
	
	

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
</style>