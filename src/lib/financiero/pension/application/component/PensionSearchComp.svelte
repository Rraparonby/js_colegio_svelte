<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Pension} from '@/lib/financiero/pension/domain/entity/Pension';
import type {PensionReturnView} from '@/lib/financiero/pension/application/util/return/PensionReturnView';

import {procesarTodosDatosData} from '@/lib/financiero/pension/infrastructure/data/PensionData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Pension';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let pensions = new Array<Pension>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,pensions);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:PensionReturnView = await procesarTodosDatosData(module,controller,pagination1);

	pensions = data.pensions;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,pensions);
};

export const siguientes = async () => {
	
	if(pensions != null && pensions.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,pensions);
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

				const data:PensionReturnView = await response_json.json();
					pensions = data.pensions;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_pension_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Idalumno')}>FK_Idalumno</button>

		</div>

					
		<div id="div_FK_Idalumno" class="tab_item">
			<form id="pension_FK_Idalumno_form_buscar" class="form_buscar_general">
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
</div>  

<style lang="scss">

/*------------------ BUSCAR GENERAL ----------------------*/
@import "@/scss/components/div/div_buscar_general";
/*------------------ TABS GENERAL ----------------------*/
@import "@/scss/components/tabs/tabs_general";


/*------------------ RESPONSIVE FORM BUSCAR GENERAL ----------------------*/
@import "@/scss/responsive/form/form_buscar_general_responsive";

</style>
