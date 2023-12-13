<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Contrato} from '@/lib/financiero/contrato/domain/entity/Contrato';
import type {ContratoReturnView} from '@/lib/financiero/contrato/application/util/return/ContratoReturnView';

import {procesarTodosDatosData} from '@/lib/financiero/contrato/infrastructure/data/ContratoData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Contrato';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let contratos = new Array<Contrato>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,contratos);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:ContratoReturnView = await procesarTodosDatosData(module,controller,pagination1);

	contratos = data.contratos;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,contratos);
};

export const siguientes = async () => {
	
	if(contratos != null && contratos.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,contratos);
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


const buscar_FK_Iddocenteid = async () => {
		//mostrarLoader();

		getPaginationInicializar();

		accion_busqueda = 'FK_Iddocenteid';

		procesar_FK_Iddocenteid();
	};

const procesar_FK_Iddocenteid = async () => {

		let url_global_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_BUSCAR + '_FK_Iddocenteid');

		const data_json = { 
			pagination : pagination1
		};

		try {

			const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);

			const response_json = await fetch(url_global_controller, request_options);

			if(response_json?.ok) {

				const data:ContratoReturnView = await response_json.json();
					contratos = data.contratos;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_contrato_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Iddocenteid')}>FK_Iddocenteid</button>

		</div>

					
		<div id="div_FK_Iddocenteid" class="tab_item">
			<form id="contrato_FK_Iddocenteid_form_buscar" class="form_buscar_general">
				<label for="ConstantesSql.ID_FK_Iddocenteid"></label>
				<input 	type="text" id="ConstantesSql.ID_FK_Iddocenteid" name="ConstantesSql.ID_FK_Iddocenteid" 
						placeholder="">				
				
				<p></p>
				<button type="button" id="buscar_button_FK_Iddocenteid" name="buscar_button_FK_Iddocenteid" 
						value="Buscar" class="btn btn-primary" 
						on:click={buscar_FK_Iddocenteid}>
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
