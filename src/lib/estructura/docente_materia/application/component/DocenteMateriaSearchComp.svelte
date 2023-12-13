<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {DocenteMateria} from '@/lib/estructura/docente_materia/domain/entity/DocenteMateria';
import type {DocenteMateriaReturnView} from '@/lib/estructura/docente_materia/application/util/return/DocenteMateriaReturnView';

import {procesarTodosDatosData} from '@/lib/estructura/docente_materia/infrastructure/data/DocenteMateriaData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Docente Materia';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let docente_materias = new Array<DocenteMateria>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,docente_materias);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:DocenteMateriaReturnView = await procesarTodosDatosData(module,controller,pagination1);

	docente_materias = data.docente_materias;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,docente_materias);
};

export const siguientes = async () => {
	
	if(docente_materias != null && docente_materias.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,docente_materias);
};

export const procesarBuscar = async () => {
	
	if(accion_busqueda == 'todos') {
		await procesarTodosDatos();

	} else if(accion_busqueda == 'buscar') {
		//await getBuscarGeneralDatos();
	}
};

const mostrarTabActual = (evt:Event,tab1:string) => {
	FuncionGeneral.mostrarTabActual(evt,tab1);
};


const buscar_FK_Iddocente = async () => {
		//mostrarLoader();

		getPaginationInicializar();

		accion_busqueda = 'FK_Iddocente';

		procesar_FK_Iddocente();
	};

const procesar_FK_Iddocente = async () => {

		let url_global_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_BUSCAR + '_FK_Iddocente');

		const data_json = { 
			pagination : pagination1
		};

		try {

			const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);

			const response_json = await fetch(url_global_controller, request_options);

			if(response_json?.ok) {

				const data:DocenteMateriaReturnView = await response_json.json();
					docente_materias = data.docente_materias;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
const buscar_FK_Idmateria = async () => {
		//mostrarLoader();

		getPaginationInicializar();

		accion_busqueda = 'FK_Idmateria';

		procesar_FK_Idmateria();
	};

const procesar_FK_Idmateria = async () => {

		let url_global_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_BUSCAR + '_FK_Idmateria');

		const data_json = { 
			pagination : pagination1
		};

		try {

			const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);

			const response_json = await fetch(url_global_controller, request_options);

			if(response_json?.ok) {

				const data:DocenteMateriaReturnView = await response_json.json();
					docente_materias = data.docente_materias;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_docente_materia_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Iddocente')}>FK_Iddocente</button>
			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Idmateria')}>FK_Idmateria</button>

		</div>

					
		<div id="div_FK_Iddocente" class="tab_item">
			<form id="docente_materia_FK_Iddocente_form_buscar" class="form_buscar_general">
				<label for="id_docente_FK_Iddocente"> Docente</label>
				<input 	type="text" id="id_docente_FK_Iddocente" name="id_docente_FK_Iddocente" 
						placeholder=" Docente">				
				
				<p></p>
				<button type="button" id="buscar_button_FK_Iddocente" name="buscar_button_FK_Iddocente" 
						value="Buscar" class="btn btn-primary" 
						on:click={buscar_FK_Iddocente}>
					<fai icon="fa-solid fa-search" />
					Buscar
				</button>
				
			</form>
		</div>
					
		<div id="div_FK_Idmateria" class="tab_item">
			<form id="docente_materia_FK_Idmateria_form_buscar" class="form_buscar_general">
				<label for="id_materia_FK_Idmateria"> Materia</label>
				<input 	type="text" id="id_materia_FK_Idmateria" name="id_materia_FK_Idmateria" 
						placeholder=" Materia">				
				
				<p></p>
				<button type="button" id="buscar_button_FK_Idmateria" name="buscar_button_FK_Idmateria" 
						value="Buscar" class="btn btn-primary" 
						on:click={buscar_FK_Idmateria}>
					<fai icon="fa-solid fa-search" />
					Buscar
				</button>
				
			</form>
		</div>
</div>  

<style lang="scss">

/*------------------ BUSCAR GENERAL ----------------------*/
@import "@/scss/components/div/div_buscar_general";
/*------------------ TABS GENERAL ----------------------*/
@import "@/scss/components/tabs/tabs_general";


/*------------------ RESPONSIVE FORM BUSCAR GENERAL ----------------------*/
@import "@/scss/responsive/form/form_buscar_general_responsive";

</style>
