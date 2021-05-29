<script>

    import Header from '../../Header.svelte';
        import {
            onMount
        } from "svelte";
        var NewSpain={
            "country" :"",
            "year": 0,
            "health_expenditure_in_percentage" : 0.0,
            "doctor_per_1000_habitant" : 0.0,
            "hospital_bed" : 0.0
        }
        var NewLife={
            "date": 0,
            "country" :"",
            "education_expenditure_per_millions" : 0.0,
            "education_expenditure_per_public_expenditure" : 0.0,
            "education_expenditure_gdp" : 0.0,
            "education_expenditure_per_capita":0.0
        }
  var years=[];
  var spyears=[];
  var lfyears=[];
    var country = [];
        var country = [];
        var sanity=[];
        var life=[];
    async function loadGraph(){
        console.log(2)
        Highcharts.chart('container', {
      chart: {
        type: 'column'
    },
  title: {
    text: 'Integración G04-Education API'
  },

  subtitle: {
    text: 'Datos de España desde '+years[0]+' hasta '+years[years.length-1]
  },

  yAxis: {
    title: {
      text: '%'
    }
  },

  xAxis: {
    title: {
      text: 'Año'
    },
    categories:years
  },

  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      }
    }
  },

  series: [{
    name: 'Gasto en sanidad',
    data: sanity
  },{
    name: 'Gasto en educación',
    data: life
  }],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }
    });
console.log(3);
  }
    
      
      async function getsanity(){
            console.log("Fetching sanity...");
            const res = await fetch("api/v2/sanity-stats/statistics?country=Spain");
            if(res.ok){
                console.log("Ok.");
                const json = await res.json();
                country = json;
                country.sort((a, b) => (a.year > b.year) ? 1 : -1)
                console.log(json);
                console.log(country);
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){
                    NewSpain=country[i];
                    if(!years.includes(NewSpain.year)){
                    years.push(NewSpain.year);
                    }
                    spyears.push(NewSpain.year);
                    if(NewSpain.year!=(spyears[spyears.length-2]+1)){
                        for(let i=spyears[spyears.length-2];i<(NewSpain.year-1);i++){
                        if(!years.includes(i+1)){
                            years.push(i+1);
                        }
                        sanity.push(null);
                        }
                    }
                    sanity.push(NewSpain.health_expenditure_in_percentage);
                    i++;
                }
            }else{
                console.log("Error!");
            }
            console.log(1)
            const res2 = await fetch("https://education-expenditures.herokuapp.com/api/v1");
            if(res2.ok){
                console.log("Ok.");
                const json = await res2.json();
                country = json;
                country.sort((a, b) => (a.year > b.year) ? 1 : -1)
                console.log(json);
                console.log(country);
                console.log("made");
                console.log(`We have received ${country.length} sanity points.`);
                let i=0;
                while(i<country.length){
                    NewLife=country[i]
                    if(NewLife.country=="Spain"){
                        if(!years.includes(NewLife.year)){
                        years.push(NewLife.year);
                        }
                        lfyears.push(NewLife.year);
                        if(NewLife.year!=(lfyears[lfyears.length-2]+1)){
                            for(let i=lfyears[lfyears.length-2];i<(NewLife.year-1);i++){
                                if(!years.includes(i+1)){
                                    years.push(i+1);
                                }
                                life.push(null);
                            }
                        }
                        life.push(NewLife.education_expenditure_per_public_expenditure);
                    }
                    i++;
                }
                console.log(life)
            }else{
                console.log("Error!");
            }
            console.log(5)
console.log(lfyears)
console.log(spyears)
            if(lfyears[0]<spyears[0]){
                for(let i=lfyears[0];i<spyears[0];i++){
                    spyears.unshift(i+1);
                    sanity.unshift(null);
                    if(!years.includes(i+1)){
                        years.push(i+1);
                    }
                }
            }
            else if(lfyears[0]>spyears[0]){
                console.log(lfyears[0]+" " + spyears[0])
                for(let i=lfyears[0];i>spyears[0];i--){
                    console.log("algo")
                    lfyears.unshift(i-1);
                    life.unshift(null);
                    if(!years.includes(i-1)){
                        years.push(i-1);
                    }
                }
            }

            years.sort((a, b) => (a > b) ? 1 : -1)

            loadGraph();
        }   
       
        onMount(getsanity);
    </script>
    
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </svelte:head>
    
    <main>
      <Header/>
      <button style="margin-left:10px;"> <a style="text-decoration: none" href="#/integrations">Volver a Integraciones </a></button>
      <figure class="highcharts-figure">
        <br><br> <p style="text-align: center">
            <div id="container"></div>
            
        </figure>  
    </main>
    <style>
    
    </style>