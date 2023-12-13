<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  
  import { Router, Link, Route } from "svelte-routing";

  //import LoginView from '@lib/base/application/view/LoginView.svelte';
  //import MainView from '@lib/base/application/view/MainView.svelte';

  import AlumnoView from '@/lib/estructura/alumno/application/view/AlumnoView.svelte';
  import AlumnoMateriaView from '@/lib/estructura/alumno_materia/application/view/AlumnoMateriaView.svelte';
  import ContratoView from '@/lib/financiero/contrato/application/view/ContratoView.svelte';
  import DocenteView from '@/lib/estructura/docente/application/view/DocenteView.svelte';
  import DocenteMateriaView from '@/lib/estructura/docente_materia/application/view/DocenteMateriaView.svelte';
  import MateriaView from '@/lib/estructura/materia/application/view/MateriaView.svelte';
  import MatriculaView from '@/lib/proceso/matricula/application/view/MatriculaView.svelte';
  import NotaView from '@/lib/proceso/nota/application/view/NotaView.svelte';
  import PensionView from '@/lib/financiero/pension/application/view/PensionView.svelte';
  import SueldoView from '@/lib/financiero/sueldo/application/view/SueldoView.svelte';


  import MateriaLoteView from '@/lib/estructura/materia/application/view_lote/MateriaLoteView.svelte';
  

</script>

<main>

  <h1>App</h1>

  <Router>
    
    <div class="wrapper">
      <nav>
        <ul class="navbar_general">
          <li>  <Link to="/">Home</Link>  </li>
          
          <li>	<Link to="/alumno">Alumnos</Link>	</li>
          <li>	<Link to="/alumno_materia">AlumnoMaterias</Link>	</li>
          <li>	<Link to="/contrato">Contratos</Link>	</li>
          <li>	<Link to="/docente">Docentes</Link>	</li>
          <li>	<Link to="/docente_materia">DocenteMaterias</Link>	</li>
          <li>	<Link to="/materia">Materias</Link>	</li>
          <li>	<Link to="/matricula">Matriculas</Link>	</li>
          <li>	<Link to="/nota">Notas</Link>	</li>
          <li>	<Link to="/pension">Pensions</Link>	</li>
          <li>	<Link to="/sueldo">Sueldos</Link>	</li>

        </ul>

        <ul class="navbar_general">
          <li>  <Link to="/materia_lote">Materias Lotes</Link>  </li>
        </ul>

      </nav>
    </div>

		<Route path="/">
      <MateriaView></MateriaView>
		</Route>

    <Route path="/alumno">
      <AlumnoView></AlumnoView>
    </Route>
		
    <Route path="/alumno_materia">
      <AlumnoMateriaView></AlumnoMateriaView>
    </Route>
      
    <Route path="/contrato">
      <ContratoView></ContratoView>
    </Route>
      
    <Route path="/docente">
      <DocenteView></DocenteView>
    </Route>
      
    <Route path="/docente_materia">
      <DocenteMateriaView></DocenteMateriaView>
    </Route>
      
    <Route path="/materia">
      <MateriaView></MateriaView>
    </Route>
      
    <Route path="/matricula">
      <MatriculaView></MatriculaView>
    </Route>
      
    <Route path="/nota">
      <NotaView></NotaView>
    </Route>
      
    <Route path="/pension">
      <PensionView></PensionView>
    </Route>
      
    <Route path="/sueldo">
      <SueldoView></SueldoView>
    </Route>



    <Route path="/materia_lote">
      <MateriaLoteView></MateriaLoteView>
    </Route>

	</Router>

</main>

<style lang="scss">

/*------------------ PAGE GENERAL ----------------------*/
@import "@/scss/page/page_general";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

ul.navbar_general {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}
  
ul.navbar_general {
    
    li {
        color: white;
        float: left;
    }

    li {
        
        a {
            display: block;
            color: white;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
        }

        a:hover:not(.active) {
            background-color: #111;
        }

        a.active {
            background-color: #04AA6D;
        }
    }

    li.right {
        float: right;
    }
}

  /*
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
  */
</style>
