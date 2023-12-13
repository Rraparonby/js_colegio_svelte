<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Matricula} from '@/lib/proceso/matricula/domain/entity/Matricula';
import type {MatriculaReturnView} from '@/lib/proceso/matricula/application/util/return/MatriculaReturnView';

import {procesarTodosDatosData} from '@/lib/proceso/matricula/infrastructure/data/MatriculaData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Matricula';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let matriculas = new Array<Matricula>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,matriculas);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:MatriculaReturnView = await procesarTodosDatosData(module,controller,pagination1);

	matriculas = data.matriculas;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,matriculas);
};

export const siguientes = async () => {
	
	if(matriculas != null && matriculas.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,matriculas);
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


const buscar_FK_Idalumnoid = async () => {
		//mostrarLoader();

		getPaginationInicializar();

		accion_busqueda = 'FK_Idalumnoid';

		procesar_FK_Idalumnoid();
	};

const procesar_FK_Idalumnoid = async () => {

		let url_global_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_BUSCAR + '_FK_Idalumnoid');

		const data_json = { 
			pagination : pagination1
		};

		try {

			const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);

			const response_json = await fetch(url_global_controller, request_options);

			if(response_json?.ok) {

				const data:MatriculaReturnView = await response_json.json();
					matriculas = data.matriculas;

			} else {

				console.log(await response_json.json());

			}
		} catch(error) {
			console.log(error);
		}
	}
	
</script>

<div id="div_matricula_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">

			<button class="tab_button" 
					on:click={mostrarTabActual(event,'div_FK_Idalumnoid')}>FK_Idalumnoid</button>

		</div>

					
		<div id="div_FK_Idalumnoid" class="tab_item">
			<form id="matricula_FK_Idalumnoid_form_buscar" class="form_buscar_general">
				<label for="ConstantesSql.ID_FK_Idalumnoid"></label>
				<input 	type="text" id="ConstantesSql.ID_FK_Idalumnoid" name="ConstantesSql.ID_FK_Idalumnoid" 
						placeholder="">				
				
				<p></p>
				<button type="button" id="buscar_button_FK_Idalumnoid" name="buscar_button_FK_Idalumnoid" 
						value="Buscar" class="btn btn-primary" 
						on:click={buscar_FK_Idalumnoid}>
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
