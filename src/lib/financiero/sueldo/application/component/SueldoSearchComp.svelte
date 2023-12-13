<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Sueldo} from '@/lib/financiero/sueldo/domain/entity/Sueldo';
import type {SueldoReturnView} from '@/lib/financiero/sueldo/application/util/return/SueldoReturnView';

import {procesarTodosDatosData} from '@/lib/financiero/sueldo/infrastructure/data/SueldoData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Sueldo';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let sueldos = new Array<Sueldo>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,sueldos);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:SueldoReturnView = await procesarTodosDatosData(module,controller,pagination1);

	sueldos = data.sueldos;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,sueldos);
};

export const siguientes = async () => {
	
	if(sueldos != null && sueldos.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,sueldos);
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

				const data:SueldoReturnView = await response_json.json();
					sueldos = data.sueldos;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_sueldo_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Iddocente')}>FK_Iddocente</button>

		</div>

					
		<div id="div_FK_Iddocente" class="tab_item">
			<form id="sueldo_FK_Iddocente_form_buscar" class="form_buscar_general">
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
</div>  

<style lang="scss">

/*------------------ BUSCAR GENERAL ----------------------*/
@import "@/scss/components/div/div_buscar_general";
/*------------------ TABS GENERAL ----------------------*/
@import "@/scss/components/tabs/tabs_general";


/*------------------ RESPONSIVE FORM BUSCAR GENERAL ----------------------*/
@import "@/scss/responsive/form/form_buscar_general_responsive";

</style>
