
<script>
     import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";


    async function getData(){
        console.log("Fetching data...");
        const res = await fetch("https://datos.alcobendas.org/api/3/action/datastore_search");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            console.log(res);
        }else{
            console.log("Error!");
        }
    }
onMount(getData)
</script>