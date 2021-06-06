<script>
import Header from './Header.svelte';
import {
			Breadcrumb,
			BreadcrumbItem
		} from 'sveltestrap';
</script>

<main>
<Header/>
<br>
    <h2>
		Vídeos de presentación:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem active>Vídeo API Sanidad</BreadcrumbItem>
  			<BreadcrumbItem><a href="https://youtu.be/3ZNAJTGD59Y">Enlace a youtube</a></BreadcrumbItem>
			
			
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Vídeo API Obesidad </BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14950492/TzRShoHF">Enlace a youtube</a></BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
  			<BreadcrumbItem active>Vídeo API Consumo de Comida </BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/14948248/TzJoDfvx">Enlace a youtube</a></BreadcrumbItem>
			
			</Breadcrumb>
		
	</ul>

</main>