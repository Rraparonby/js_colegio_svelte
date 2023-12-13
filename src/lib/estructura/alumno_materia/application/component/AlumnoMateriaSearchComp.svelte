<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {AlumnoMateria} from '@/lib/estructura/alumno_materia/domain/entity/AlumnoMateria';
import type {AlumnoMateriaReturnView} from '@/lib/estructura/alumno_materia/application/util/return/AlumnoMateriaReturnView';

import {procesarTodosDatosData} from '@/lib/estructura/alumno_materia/infrastructure/data/AlumnoMateriaData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Alumno Materia';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let alumno_materias = new Array<AlumnoMateria>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,alumno_materias);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:AlumnoMateriaReturnView = await procesarTodosDatosData(module,controller,pagination1);

	alumno_materias = data.alumno_materias;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,alumno_materias);
};

export const siguientes = async () => {
	
	if(alumno_materias != null && alumno_materias.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,alumno_materias);
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


const buscar_FK_Idalumno = async () => {
		//mostrarLoader();

		getPaginationInicializar();

		accion_busqueda = 'FK_Idalumno';

		procesar_FK_Idalumno();
	};

const procesar_FK_Idalumno = async () => {

		let url_global_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_BUSCAR + '_FK_Idalumno');

		const data_json = { 
			pagination : pagination1
		};

		try {

			const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);

			const response_json = await fetch(url_global_controller, request_options);

			if(response_json?.ok) {

				const data:AlumnoMateriaReturnView = await response_json.json();
					alumno_materias = data.alumno_materias;

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

				const data:AlumnoMateriaReturnView = await response_json.json();
					alumno_materias = data.alumno_materias;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_alumno_materia_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Idalumno')}>FK_Idalumno</button>
			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Idmateria')}>FK_Idmateria</button>

		</div>

					
		<div id="div_FK_Idalumno" class="tab_item">
			<form id="alumno_materia_FK_Idalumno_form_buscar" class="form_buscar_general">
				<label for="id_alumno_FK_Idalumno"> Alumno</label>
				<input 	type="text" id="id_alumno_FK_Idalumno" name="id_alumno_FK_Idalumno" 
						placeholder=" Alumno">				
				
				<p></p>
				<button type="button" id="buscar_button_FK_Idalumno" name="buscar_button_FK_Idalumno" 
						value="Buscar" class="btn btn-primary" 
						on:click={buscar_FK_Idalumno}>
					<fai icon="fa-solid fa-search" />
					Buscar
				</button>
				
			</form>
		</div>
					
		<div id="div_FK_Idmateria" class="tab_item">
			<form id="alumno_materia_FK_Idmateria_form_buscar" class="form_buscar_general">
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
