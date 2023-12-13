<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';
import {Pagination} from '@/lib/base/application/logic/Pagination';

import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';
import type {AlumnoReturnView} from '@/lib/estructura/alumno/application/util/return/AlumnoReturnView';

import {procesarTodosDatosData} from '@/lib/estructura/alumno/infrastructure/data/AlumnoData';

//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''
export let tipo_busqueda:string =''

const emit = createEventDispatcher()

onMount(() => {
	getTodosDatos();
});

			
//------------------ GENERAL --------------------
let title = 'Buscar Alumno';

//------------------ ACCIONES -------------------
let accion_busqueda = 'todos';
let pagination1 = new Pagination();

//------------------ DATOS ----------------------
let alumnos = new Array<Alumno>();

	
export const getTodosDatos = async () => { 			
	//mostrarLoader();
	getPaginationInicializar();
	accion_busqueda = "todos";
	
	await procesarTodosDatos();
	//ocultarLoader();			
	emit(Constantes.UPDATE_DATOS_VIEW,alumnos);
};

const getPaginationInicializar = () => {			
	pagination1 = new Pagination();
	
	pagination1.skip = 0;
	pagination1.limit = Constantes.LIMIT;
};

export const procesarTodosDatos = async () => {
	
	const data:AlumnoReturnView = await procesarTodosDatosData(module,controller,pagination1);

	alumnos = data.alumnos;

};

export const anteriores = async () => {
	
	if(pagination1.skip - pagination1.limit < 0) {
		pagination1.skip = 0;
	} else {
		pagination1.skip = pagination1.skip - pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,alumnos);
};

export const siguientes = async () => {
	
	if(alumnos != null && alumnos.length > 0) {
		pagination1.skip = pagination1.skip + pagination1.limit;
	}
	
	await procesarBuscar();
	
	emit(Constantes.UPDATE_DATOS_VIEW,alumnos);
};

export const procesarBuscar = async () => {
	
	if(accion_busqueda == 'todos') {
		await procesarTodosDatos();

	} else if(accion_busqueda == 'buscar') {
		//await getBuscarGeneralDatos();
	}
};



	
</script>

<div id="div_alumno_form_buscar" class="div_buscar_general">
		
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
