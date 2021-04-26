<script>
	import TableFood from './TableFood.svelte';
	import ObesitySv from './ObesitySv.svelte';
	import {
    	Button,
    	Modal,
    	ModalBody,
   		ModalFooter,
   		 ModalHeader
  	} from 'sveltestrap';
  let open = false;
  let openob = false;
  const toggle = () =>{
  	
  	(open = !open);
  } 
  
  const toggleob = () =>{
  	
  	(openob = !openob);
  } 
</script>

<main>
	
	<h1>
		<strong>SOS2021-10</strong>
	</h1>
	<h2>
		Team
	</h2>
	<ul>
		<li>Antonio José Díaz González (https://github.com/AntonioJoseDiaz)</li>
		<li>Almudena González López de Letona (https://github.com/almgonlop)</li>
		<li>Alicia Pérez Bolaños (https://github.com/aliperbol)</li>
			
	</ul>
	<h2>
		Project description:
	</h2>
	<p>
		Nuestras fuentes de información esta orientadas a analizar la relación que existe entre la obesidad, el consumo de distintos tipos de comida y la sanidad en el mundo.
	</p>
	<p>
		<strong>Repository: </strong> [gti-sos/SOS2021-10](https://github.com/gti-sos/SOS2021-10) 
	</p>
	<p>
		<strong>URL: </strong> http://sos2021-10.herokuapp.com 
	</p>
	<p>
		<strong>APIs: </strong>
	</p>
	
		<ul>
			<li><a href="https://sos2021-10.herokuapp.com/api/v1/sanity-stats">sanity-stats</a> (developed by Antonio José Díaz González)</li>
			<li><a href="https://sos2021-10.herokuapp.com/api/v1/obesity-stats">obesity-stats</a> (developed by Almudena González López de Letona)</li>
			<li><a href="https://sos2021-10.herokuapp.com/api/v1/foodconsumption-stats">foodconsumption-stats</a> (developed by Alicia Pérez Bolaños)</li>
		</ul>
		
		<p>
		<strong>Front-end Svelte:</strong>
	</p>
		
		<ul>
	
			<li>Obesity-stats: 
				<p>
			  		<Button outline color="warning" on:click={toggleob}>Open</Button>
			  		<Modal isOpen={openob} {toggleob} size= 'lg'>
						<ModalHeader {toggleob}>Estadísticas de obesidad</ModalHeader>
						<ModalBody>
							<ObesitySv/>
						</ModalBody>
						<ModalFooter>
				  			<Button color="secondary" on:click={toggleob}>Close</Button>
						</ModalFooter>
			  		</Modal>
				</p>
			</li>
			<li>FoodConsumption-stats:
			<p>
			  <Button outline color="warning" on:click={toggle}>Open</Button>
			  <Modal isOpen={open} {toggle} size= 'lg'>
				<ModalHeader {toggle}>Estadísticas de consumo de comida</ModalHeader>
				<ModalBody>
					<TableFood/>
				</ModalBody>
				<ModalFooter>
				  <Button color="secondary" on:click={toggle}>Close</Button>
				</ModalFooter>
			  </Modal>
			</p>
			
			</li>
			<li>Sanity-stats: <a href="sanity.html">Sanity_Front-end</a></li>
		</ul>
		
	<p>
		<strong>Postman's Documentation:</strong>
	</p>
		
		<ul>
	
			<li>Obesity-stats: <a href="https://documenter.getpostman.com/view/14950492/TzJoDfvw">Obesity_postman</a></li>
			<li>FoodConsumption-stats: <a href="https://documenter.getpostman.com/view/14948248/TzJoDfvx">Food_postman</a></li>
			<li>Sanity-stats: <a href="https://documenter.getpostman.com/view/9683594/TzJoE1Qx">Sanity_postman</a></li>
		</ul>
		
		

</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>