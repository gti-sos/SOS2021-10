
<script>
    import {
                onMount
            } from "svelte";
    import Header from '../../Header.svelte';
        var NewSpain={
                "country" :"",
                "year": 0,
                "health_expenditure_in_percentage" : 0.0,
                "doctor_per_1000_habitant" : 0.0,
                "hospital_bed" : 0.0
            }
        
            var country = [];
        var years=[];
        var grafica={};
        var grafica1={};
        var grafica2={};
        var idk=[];
        var idk1=[];
        var idk2=[];
        var datos = [];
        var datos1 = [];
        var datos2 = [];
            onMount(getsanity);
        async function getsanity() {
                console.log("Fetching sanity...");
                grafica=new Array();
                const res = await fetch("https://servicios.ine.es/wstempus/js/es/DATOS_TABLA/30725?tip=AM");
                if(res.ok){
                    console.log("Ok.");
                    const json = await res.json();
                    country = json;
                    datos=country[0].Data;
                    datos1=country[1].Data;
                    datos2=country[2].Data;
                    let i=0;
                    while(i<datos.length){
                        if( grafica[datos[i].NombrePeriodo]){
                        grafica[datos[i].NombrePeriodo].push(parseInt(datos[i].Valor));
                        grafica1[datos1[i].NombrePeriodo].push(parseInt(datos1[i].Valor));
                        grafica2[datos2[i].NombrePeriodo].push(parseInt(datos2[i].Valor));
                        }

                        else{
                            
                        grafica[datos[i].NombrePeriodo]=parseInt(datos[i].Valor);
                        grafica1[datos1[i].NombrePeriodo]=parseInt(datos1[i].Valor);
                        grafica2[datos2[i].NombrePeriodo]=parseInt(datos2[i].Valor);
                        }


                        years.push(parseInt(datos[i].NombrePeriodo));
                        i++;
                    }
                }else{
                    console.log("Error!");
                }
                console.log(grafica)
            console.log(3)

            Object.entries(grafica).forEach(([key, value]) => {
                idk.push([key,value])
            });
            Object.entries(grafica1).forEach(([key, value]) => {
                idk1.push([key,value])
            });
            Object.entries(grafica2).forEach(([key, value]) => {
                idk2.push([key,value])
            });
            
            console.log(idk)
            console.log(idk1)
            console.log(idk2)
            loadGraph();
            }   
        
        
            function loadGraph() {
            
                var chart = JSC.chart('chartDiv', { 
  debug: true, 
  legend_position: 'bottom right', 
  type: 'area spline', 
  defaultSeries: { shape_opacity: 0.5 }, 
  xAxis: { 
    crosshair_enabled: true, 
    scale: years 
  }, 
  title_label_text: 'Quimicos colegiados en España', 
  yAxis: { formatString: '' }, 
  series: [ 
    { 
      name: 'Total', 
      points: idk
    }, 
    { 
      name: 'Hombres', 
      points: idk1
    }, 
    { 
      name: 'Mujeres', 
      points: idk2
    } 
  ] 
});
            
            }
            </script>
            <svelte:head>
                <script src="https://code.jscharting.com/latest/jscharting.js"></script>
            </svelte:head>
            <main>
              <Header/>
              <button id="volver" style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
            <div id="chartDiv"></div>
        
            </main>