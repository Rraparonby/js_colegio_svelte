<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';
import type {DocenteReturnView} from '@/lib/estructura/docente/application/util/return/DocenteReturnView';

import {procesarTodosDatosData} from '@/lib/estructura/docente/infrastructure/data/DocenteData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Docente';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let docentes = new Array<Docente>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,docentes);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:DocenteReturnView = await procesarTodosDatosData(module,controller,pagination1);

	docentes = data.docentes;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,docentes);
};

export const siguientes = async () => {
	
	if(docentes != null && docentes.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,docentes);
};

export const procesarBuscar = async () => {
	
	if(accion_busqueda == 'todos') {
		await procesarTodosDatos();

	} else if(accion_busqueda == 'buscar') {
		//await getBuscarGeneralDatos();
	}
};



	
</script>

<div id="div_docente_form_buscar" class="div_buscar_general">
		
		<div class="tabs_general">


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
