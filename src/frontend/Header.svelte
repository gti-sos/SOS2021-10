<script>
	let sdf=0;
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink
	} from 'sveltestrap';
	
	let isOpen = false;
  const toggleNav = () => (isOpen = !isOpen);
  
</script>
<main>

<Navbar style="background-color:#24355C;" dark
class="fixed-top">
  <NavbarBrand href="/" class="mr-auto"><strong>SOS2021-10</strong></NavbarBrand>
  <NavbarToggler on:click={toggleNav} className="mr-2" />
  <Collapse {isOpen} navbar>
    <Nav navbar>
      <NavItem>
        <NavLink href="#/foodconsumption-stats">Estadísticas de consumo de comida</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/obesity-stats">Estadísticas de obesidad</NavLink>
      </NavItem>
	  <NavItem>
        <NavLink href="#/sanity-stats">Estadísticas de sanidad</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/about">Sobre nosotros</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

</main>