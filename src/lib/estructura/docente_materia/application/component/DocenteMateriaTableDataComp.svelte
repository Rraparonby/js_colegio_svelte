<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte'
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {DocenteMateria} from '@/lib/estructura/docente_materia/domain/entity/DocenteMateria';
import {DocenteMateriaReturnView} from '@/lib/estructura/docente_materia/application/util/return/DocenteMateriaReturnView';

import DocenteMateriaTableRowDataComp from '@/lib/estructura/docente_materia/application/component/DocenteMateriaTableRowDataComp.svelte';

/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let docente_materias: Array = new Array<DocenteMateria>()


const emit = createEventDispatcher()
							
//------------------ GENERAL --------------------
let title = 'Tabla Datos Docente Materia';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let style_id_column = '';


const home = () => {
	navigate('/main');
};

const atras = () => {
	window.history.back();
};

const getTodosDatos = () => {
	emit('getTodosDatosView');
};

const anteriores = () => {
	emit('anterioresView');
};

const siguientes = () => {
	emit('siguientesView');
};

const nuevoPreparar = () => {
	emit('nuevoPrepararView');
};

const handleAction_ClickTableRowTableView = async (docente_materia1: DocenteMateria) => {		
	tipo_accion = Constantes.SELECCIONAR;			
	
	emit('handleAction_ClickTableRowView',docente_materia1.detail);
};

</script>

<div id="divCompGlobalTabladocente_materia">
	
	<div id="div_docente_materia_tabla_general">					
		
		<input type="hidden" id="docente_materia_tabla_general_length" name="docente_materia_tabla_general_length" 
				value="{ docente_materias.length }" />
		
		<table id="docente_materia_tabla_general" 
				class="table table-striped table-bordered">
			
			<thead>
				<tr class="table-primary">					
					<th style={ style_id_column }>Id</th>
					<th style="display:none;">Created At</th>
					<th style="display:none;">Updated At</th>
					<th> Docente</th>
					<th> Materia</th>
				</tr>
			</thead>
			
			<tbody>
				
				{#each docente_materias as docente_materia1}
				
				<DocenteMateriaTableRowDataComp 
					bind:module={module}
					bind:controller={controller}
					bind:style_id_column={style_id_column}
					bind:docente_materia1={docente_materia1} 
					on:handleAction_ClickTableRowTableView={handleAction_ClickTableRowTableView} >
					
				</DocenteMateriaTableRowDataComp>
				
				{/each}
				
			</tbody>
			
		</table>
	</div>
	
	
	<div id="div_docente_materia_pagination_form_general">
		
		<form id="docente_materia_pagination_form_general" class="pagination_form_general">							
			
			<button type="button" id="anteriores_button" name="anteriores_button" 
					value="Anteriores" class="btn btn-primary" 
					on:click={anteriores}>
				<fai icon="fa-solid fa-arrow-alt-circle-left" />
				Anteriores
			</button>
			
			<button type="button" id="siguientes_button" name="siguientes_button" 
					value="Siguientes" class="btn btn-primary" 
					on:click={siguientes}>
				<fai icon="fa-solid fa-arrow-alt-circle-right" />
				Siguientes
			</button>
			
		</form>
	</div>
	
	<div id="div_docente_materia_actions_general">
	
		<form id="docente_materia_actions_general" class="actions_form_general">
			
			<button type="button" id="home_button" name="home_button"
					value="Home" class="btn btn-primary"
					on:click={home}>
				<fai icon="fa-solid fa-home" />
				Home
			</button>
			
			<button type="button" id="atras_button" name="atras_button" 
					value="Atras" class="btn btn-primary" 
					on:click={atras}>
				<fai icon="fa-solid fa-arrow-circle-left" />
				Atras
			</button>
			
			<button type="button" id="recargar_button" name="recargar_button" 
					value="Recargar" class="btn btn-primary" 
					on:click={getTodosDatos}>
				<fai icon="fa-solid fa-sync" />
				Recargar
			</button>
			
			<button type="button" id="nuevo_preparar_button" name="nuevo_preparar_button" 
					value="Nuevo" class="btn btn-primary" 
					on:click={nuevoPreparar}>
				<fai icon="fa-solid fa-plus-circle" />
				Nuevo
			</button>
			
		</form>
	</div>		
</div>
  

<style lang="scss">

/*------------------ GENERAL (Importado en table_general.scss) ----------------------*/
//@import "@/scss/general";
/*------------------ BUTTON GENERAL ----------------------*/
@import "@/scss/components/button/button_general";
/*------------------ TABLE GENERAL ----------------------*/
@import "@/scss/components/table/table_general";
/*------------------ FORM PAGINATION GENERAL ----------------------*/
@import "@/scss/components/form/pagination_form_general";
/*------------------ FORM ACTIONS GENERAL ----------------------*/
@import "@/scss/components/form/actions_form_general";


/*------------------ RESPONSIVE TABLE GENERAL ----------------------*/
@import "@/scss/responsive/table/table_general_responsive";
/*------------------ RESPONSIVE ACTIONS GENERAL ----------------------*/
@import "@/scss/responsive/form/actions_form_general_responsive";
/*------------------ RESPONSIVE FORM PAGINATION GENERAL ----------------------*/
@import "@/scss/responsive/form/pagination_form_general_responsive";

</style>
