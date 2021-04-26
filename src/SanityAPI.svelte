<script>
  import {
    Nav,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    NavItem,
    NavLink,
    Button,
    Table,
    UncontrolledAlert ,
  } from "sveltestrap";
  const carga = () => {
    loadData();
  };
  const borra = () => {
    deleteData();
  };
  //API
  let sanityStats = [];
  //Functions
  async function loadData() {
    console.log("Loading data...");
    const res = await fetch("api/v1/sanity-stats/loadInitialData").then(
      function (res) {
        if (res.ok) {
          console.log("OK");
          getStats();
          error = 0;
        } else if (res.status == 409) {
          error = 409;
          console.log("Conflict");
        } else {
          error = 404;
          console.log("Error");
        }
      }
    );
  }
  async function getStats() {
    console.log("Fetching data...");
    const res = await fetch("api/v1/sanity-stats/");
    if (res.ok) {
      console.log("Ok");
      const json = await res.json();
      sanityStats = json;
      console.log(`We have received ${sanityStats.length} contacs.`);
    } else {
      console.log("Error");
    }
  }
  async function deleteData() {
    console.log("Deleting data...");
    const res = await fetch("api/v1/sanity-stats/", {
      method: "DELETE",
    }).then(function (res) {
      if (res.ok) {
        console.log("OK");
        sanityStats = [];
      } else if (res.status = 404) {
        console.log("ERROR Data not found in database");
      }
    });
  }
  getStats();
</script>

<main>
  <Nav>
    <NavItem>
      <NavLink href="/">Volver</NavLink>
    </NavItem>
    <NavItem>
      <NavLink href="#" on:click={carga}>Cargar datos inciales</NavLink>
      
    </NavItem>
    <NavItem>
      <NavLink href="#" on:click={borra}>Borrar todos los datos</NavLink>
      
    </NavItem>
  </Nav>
  <h2>Sanity Stats</h2>

  
<!-- Table -->
  
    <Table borderer>
      <thead>
        <tr>
          <th>country </th>
          <th>year </th>
          <th>health_expenditure_in_percentage </th>
          <th>doctor_per_1000_habitant </th>
          <th>hospital_bed </th>
        </tr>
      </thead>
      <tbody>
        {#each sanityStats as stat}
          <tr>
            <td>{stat.country}</td>
            <td>{stat.year}</td>
            <td>{stat.health_expenditure_in_percentage}</td>
            <td>{stat.doctor_per_1000_habitant}</td>
            <td>{stat.hospital_bed}</td>
          </tr>
        {/each}
      </tbody><tbody />
    </Table>
 
</main>

<style>
 
  h2 {
    text-align:center;

  }
</style>