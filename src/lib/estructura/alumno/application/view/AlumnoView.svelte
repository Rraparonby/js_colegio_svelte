<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import AlumnoSearchComp from '@/lib/estructura/alumno/application/component/AlumnoSearchComp.svelte';
import AlumnoTableDataComp from '@/lib/estructura/alumno/application/component/AlumnoTableDataComp.svelte';
import AlumnoFormComp from '@/lib/estructura/alumno/application/component/AlumnoFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Alumno';

//------------------ ACCIONES -------------------
let module = 'estructura';
let controller = 'alumno_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let alumnos =  new Array<Alumno>();
let alumno = new Alumno();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let alumnoSearchComp1 = null; //ref<InstanceType<typeof AlumnoSearchComp> | null>(null);
let alumnoFormComp1 = null; //ref<InstanceType<typeof AlumnoFormComp> | null>(null);

const updateDatos = (alumnos1:any) => {
	alumnos = alumnos1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	alumnoSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	alumnoSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	alumnoSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	alumnoFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (alumno1: any) => {
	alumnoFormComp1?.handleAction_ClickTableRow(alumno1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	alumnoSearchComp1?.getTodosDatos();
	alumnoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	alumnoSearchComp1?.getTodosDatos();
	alumnoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	alumnoSearchComp1?.getTodosDatos();
	alumnoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalalumno">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <AlumnoSearchComp 
				bind:this={alumnoSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <AlumnoTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:alumnos={alumnos}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <AlumnoFormComp 
				bind:this={alumnoFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:alumno_prop={alumno}
				bind:alumnos={alumnos}
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