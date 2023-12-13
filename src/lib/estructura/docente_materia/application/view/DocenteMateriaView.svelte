<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {DocenteMateria} from '@/lib/estructura/docente_materia/domain/entity/DocenteMateria';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import DocenteMateriaSearchComp from '@/lib/estructura/docente_materia/application/component/DocenteMateriaSearchComp.svelte';
import DocenteMateriaTableDataComp from '@/lib/estructura/docente_materia/application/component/DocenteMateriaTableDataComp.svelte';
import DocenteMateriaFormComp from '@/lib/estructura/docente_materia/application/component/DocenteMateriaFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Docente Materia';

//------------------ ACCIONES -------------------
let module = 'estructura';
let controller = 'docente_materia_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let docente_materias =  new Array<DocenteMateria>();
let docente_materia = new DocenteMateria();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let docente_materiaSearchComp1 = null; //ref<InstanceType<typeof DocenteMateriaSearchComp> | null>(null);
let docente_materiaFormComp1 = null; //ref<InstanceType<typeof DocenteMateriaFormComp> | null>(null);

const updateDatos = (docente_materias1:any) => {
	docente_materias = docente_materias1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	docente_materiaSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	docente_materiaSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	docente_materiaSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	docente_materiaFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (docente_materia1: any) => {
	docente_materiaFormComp1?.handleAction_ClickTableRow(docente_materia1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	docente_materiaSearchComp1?.getTodosDatos();
	docente_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	docente_materiaSearchComp1?.getTodosDatos();
	docente_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	docente_materiaSearchComp1?.getTodosDatos();
	docente_materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobaldocente_materia">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <DocenteMateriaSearchComp 
				bind:this={docente_materiaSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <DocenteMateriaTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:docente_materias={docente_materias}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <DocenteMateriaFormComp 
				bind:this={docente_materiaFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:docente_materia_prop={docente_materia}
				bind:docente_materias={docente_materias}
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