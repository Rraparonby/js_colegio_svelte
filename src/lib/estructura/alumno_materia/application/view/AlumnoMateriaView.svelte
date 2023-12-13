<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {AlumnoMateria} from '@/lib/estructura/alumno_materia/domain/entity/AlumnoMateria';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import AlumnoMateriaSearchComp from '@/lib/estructura/alumno_materia/application/component/AlumnoMateriaSearchComp.svelte';
import AlumnoMateriaTableDataComp from '@/lib/estructura/alumno_materia/application/component/AlumnoMateriaTableDataComp.svelte';
import AlumnoMateriaFormComp from '@/lib/estructura/alumno_materia/application/component/AlumnoMateriaFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Alumno Materia';

//------------------ ACCIONES -------------------
let module = 'estructura';
let controller = 'alumno_materia_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let alumno_materias =  new Array<AlumnoMateria>();
let alumno_materia = new AlumnoMateria();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let alumno_materiaSearchComp1 = null; //ref<InstanceType<typeof AlumnoMateriaSearchComp> | null>(null);
let alumno_materiaFormComp1 = null; //ref<InstanceType<typeof AlumnoMateriaFormComp> | null>(null);

const updateDatos = (alumno_materias1:any) => {
	alumno_materias = alumno_materias1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	alumno_materiaSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	alumno_materiaSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	alumno_materiaSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	alumno_materiaFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (alumno_materia1: any) => {
	alumno_materiaFormComp1?.handleAction_ClickTableRow(alumno_materia1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	alumno_materiaSearchComp1?.getTodosDatos();
	alumno_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	alumno_materiaSearchComp1?.getTodosDatos();
	alumno_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	alumno_materiaSearchComp1?.getTodosDatos();
	alumno_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalalumno_materia">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <AlumnoMateriaSearchComp 
				bind:this={alumno_materiaSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <AlumnoMateriaTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:alumno_materias={alumno_materias}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <AlumnoMateriaFormComp 
				bind:this={alumno_materiaFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:alumno_materia_prop={alumno_materia}
				bind:alumno_materias={alumno_materias}
				on:ocultarMensajeAlertaView={ocultarMensajeAlerta}
				on:handleAction_ActualizarDatosView={handleAction_ActualizarDatos}
				on:handleAction_NuevoDatosView={handleAction_NuevoDatos}
				on:handleAction_EliminarDatosView={handleAction_EliminarDatos}/>
	
	<div id="div_auxiliar"></div>
	
	<FooterComp/>
	
</div>
	
<style lang="scss">

/*------------------ TITLE GENERAL ----------------------*/
@import "@/scss/components/title/titulo_general";

</style>