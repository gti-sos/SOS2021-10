<script>
import Header from '../Header.svelte';
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    import {
        onMount
    } from "svelte";
    import Button from "sveltestrap/src/Button.svelte";

var BASE_CONTACT_API_PATH= "/api/v2";

async function getData(){
    const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
    const res2 = await fetch("https://endpoint-poverty-risks.herokuapp.com/api/v1");
        if(resDataEXT.ok){
            console.log("Ok."); 
            const json = await res.json();
            const json2 = await res2.json();
           console.log(json);
        }else{
            console.log("Error!");
        }

    }
    onMount(getData);
    
</script>
