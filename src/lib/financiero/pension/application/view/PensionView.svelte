<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Pension} from '@/lib/financiero/pension/domain/entity/Pension';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import PensionSearchComp from '@/lib/financiero/pension/application/component/PensionSearchComp.svelte';
import PensionTableDataComp from '@/lib/financiero/pension/application/component/PensionTableDataComp.svelte';
import PensionFormComp from '@/lib/financiero/pension/application/component/PensionFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Pension';

//------------------ ACCIONES -------------------
let module = 'financiero';
let controller = 'pension_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let pensions =  new Array<Pension>();
let pension = new Pension();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let pensionSearchComp1 = null; //ref<InstanceType<typeof PensionSearchComp> | null>(null);
let pensionFormComp1 = null; //ref<InstanceType<typeof PensionFormComp> | null>(null);

const updateDatos = (pensions1:any) => {
	pensions = pensions1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	pensionSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	pensionSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	pensionSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	pensionFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (pension1: any) => {
	pensionFormComp1?.handleAction_ClickTableRow(pension1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	pensionSearchComp1?.getTodosDatos();
	pensionFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	pensionSearchComp1?.getTodosDatos();
	pensionFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	pensionSearchComp1?.getTodosDatos();
	pensionFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalpension">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <PensionSearchComp 
				bind:this={pensionSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <PensionTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:pensions={pensions}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <PensionFormComp 
				bind:this={pensionFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:pension_prop={pension}
				bind:pensions={pensions}
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