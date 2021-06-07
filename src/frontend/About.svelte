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

	<div class="card-deck">
        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
              <iframe width="816" height="441" src="https://www.youtube.com/embed/3ZNAJTGD59Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Vídeo API Sanidad</h5>
            <p class="card-text"></p>
          </div>
        </div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe width="900" height="506" src="https://www.youtube.com/embed/ZsRnlI9mp2A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Vídeo API Obesidad</h5>
            <p class="card-text"></p>
          </div>
        </div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
              <iframe width="757" height="409" src="https://www.youtube.com/embed/YRzkvq7f7vA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          <div class="card-body">
            <h5 class="card-title">Vídeo API Consumo de Comida</h5>
            <p class="card-text"></p>
          </div>
        </div>
    </div>

	<!-- <ul>
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
		
	</ul> -->

</main>