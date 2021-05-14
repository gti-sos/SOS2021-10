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
		
	let open = false;
    let opensa = false;
    let openob = false;
    const toggle = () =>{
  	
		(open = !open);
	  }  
	  const togglesa = () =>{

		(opensa = !opensa);
	  } 

	  const toggleob = () =>{

		(openob = !openob);
  } 
  
  
</script>


<main>
	<Header/>




	<div class="position">
	<h1>
		<strong>SOS2021-10</strong>
	</h1>
	<h2>
		Integrantes:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem active>Antonio José Díaz González</BreadcrumbItem>
			<BreadcrumbItem active><a href="https://github.com/AntonioJoseDiaz">Enlace a Github</a></BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Almudena González López de Letona</BreadcrumbItem>
			<BreadcrumbItem active><a href="https://github.com/almgonlop">Enlace a Github</a></BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Alicia Pérez Bolaños</BreadcrumbItem>
			<BreadcrumbItem active><a href="https://github.com/aliperbol">Enlace a Github</a></BreadcrumbItem>
		</Breadcrumb>
		
			
	</ul>
	<h2>
		Descripción del proyecto:
	</h2>
	<p>
		Nuestras fuentes de información estan orientadas a analizar la relación que existe entre la obesidad, el consumo de distintos tipos de comida y la sanidad en el mundo.
	</p>
	<p>
		<strong>Repositorio: </strong> <a href="https://github.com/gti-sos/SOS2021-10">https://github.com/gti-sos/SOS2021-10</a> 
	</p>
	<p>
		<strong>URL: </strong><a href="http://sos2021-10.herokuapp.com">http://sos2021-10.herokuapp.com</a> 
	</p>
	<h2>
		APIs desarrolladas:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/sanity-stats">Estaditicas de Sanidad v1</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Antonio José Díaz González</BreadcrumbItem>
			
		</Breadcrumb>
		<Breadcrumb class="peque">
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/sanity-stats">Estaditicas de Sanidad v2</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Antonio José Díaz González</BreadcrumbItem>
			
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/obesity-stats">Estaditicas de Obesidad v1</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/obesity-stats">Estaditicas de Obesidad v2</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats">Estaditicas del Consumo de Comida v1</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Alicia Pérez Bolaños</BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem><a href="https://sos2021-10.herokuapp.com/api/v2/foodconsumption-stats">Estaditicas del Consumo de Comida v2</a></BreadcrumbItem>
			<BreadcrumbItem active>Desarrollado por Alicia Pérez Bolaños</BreadcrumbItem>
		</Breadcrumb>
		
			
	</ul>
	
	<h2>
		Documentación en Postman:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem active>Estaditicas de Sanidad</BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/9683594/TzJoE1Qx">Sanity_postman</a></BreadcrumbItem>
			
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Estaditicas de Obesidad </BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14950492/TzJoDfvw">Obesity_postman</a></BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Estaditicas del Consumo de Comida </BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14948248/TzJoDfvx">Food_postman</a></BreadcrumbItem>
			
			</Breadcrumb>
		
			
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