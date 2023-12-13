<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Sueldo} from '@/lib/financiero/sueldo/domain/entity/Sueldo';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import SueldoSearchComp from '@/lib/financiero/sueldo/application/component/SueldoSearchComp.svelte';
import SueldoTableDataComp from '@/lib/financiero/sueldo/application/component/SueldoTableDataComp.svelte';
import SueldoFormComp from '@/lib/financiero/sueldo/application/component/SueldoFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Sueldo';

//------------------ ACCIONES -------------------
let module = 'financiero';
let controller = 'sueldo_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let sueldos =  new Array<Sueldo>();
let sueldo = new Sueldo();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let sueldoSearchComp1 = null; //ref<InstanceType<typeof SueldoSearchComp> | null>(null);
let sueldoFormComp1 = null; //ref<InstanceType<typeof SueldoFormComp> | null>(null);

const updateDatos = (sueldos1:any) => {
	sueldos = sueldos1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	sueldoSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	sueldoSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	sueldoSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	sueldoFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (sueldo1: any) => {
	sueldoFormComp1?.handleAction_ClickTableRow(sueldo1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	sueldoSearchComp1?.getTodosDatos();
	sueldoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	sueldoSearchComp1?.getTodosDatos();
	sueldoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	sueldoSearchComp1?.getTodosDatos();
	sueldoFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalsueldo">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <SueldoSearchComp 
				bind:this={sueldoSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <SueldoTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:sueldos={sueldos}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <SueldoFormComp 
				bind:this={sueldoFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:sueldo_prop={sueldo}
				bind:sueldos={sueldos}
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