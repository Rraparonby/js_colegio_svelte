<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Docente} from '@/lib/estructura/docente/domain/entity/Docente';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import DocenteSearchComp from '@/lib/estructura/docente/application/component/DocenteSearchComp.svelte';
import DocenteTableDataComp from '@/lib/estructura/docente/application/component/DocenteTableDataComp.svelte';
import DocenteFormComp from '@/lib/estructura/docente/application/component/DocenteFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Docente';

//------------------ ACCIONES -------------------
let module = 'estructura';
let controller = 'docente_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let docentes =  new Array<Docente>();
let docente = new Docente();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let docenteSearchComp1 = null; //ref<InstanceType<typeof DocenteSearchComp> | null>(null);
let docenteFormComp1 = null; //ref<InstanceType<typeof DocenteFormComp> | null>(null);

const updateDatos = (docentes1:any) => {
	docentes = docentes1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	docenteSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	docenteSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	docenteSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	docenteFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (docente1: any) => {
	docenteFormComp1?.handleAction_ClickTableRow(docente1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	docenteSearchComp1?.getTodosDatos();
	docenteFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	docenteSearchComp1?.getTodosDatos();
	docenteFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	docenteSearchComp1?.getTodosDatos();
	docenteFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobaldocente">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <DocenteSearchComp 
				bind:this={docenteSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <DocenteTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:docentes={docentes}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <DocenteFormComp 
				bind:this={docenteFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:docente_prop={docente}
				bind:docentes={docentes}
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