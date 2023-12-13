<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Contrato} from '@/lib/financiero/contrato/domain/entity/Contrato';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import ContratoSearchComp from '@/lib/financiero/contrato/application/component/ContratoSearchComp.svelte';
import ContratoTableDataComp from '@/lib/financiero/contrato/application/component/ContratoTableDataComp.svelte';
import ContratoFormComp from '@/lib/financiero/contrato/application/component/ContratoFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Contrato';

//------------------ ACCIONES -------------------
let module = 'financiero';
let controller = 'contrato_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let contratos =  new Array<Contrato>();
let contrato = new Contrato();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let contratoSearchComp1 = null; //ref<InstanceType<typeof ContratoSearchComp> | null>(null);
let contratoFormComp1 = null; //ref<InstanceType<typeof ContratoFormComp> | null>(null);

const updateDatos = (contratos1:any) => {
	contratos = contratos1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	contratoSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	contratoSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	contratoSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	contratoFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (contrato1: any) => {
	contratoFormComp1?.handleAction_ClickTableRow(contrato1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	contratoSearchComp1?.getTodosDatos();
	contratoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	contratoSearchComp1?.getTodosDatos();
	contratoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	contratoSearchComp1?.getTodosDatos();
	contratoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalcontrato">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <ContratoSearchComp 
				bind:this={contratoSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <ContratoTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:contratos={contratos}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <ContratoFormComp 
				bind:this={contratoFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:contrato_prop={contrato}
				bind:contratos={contratos}
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