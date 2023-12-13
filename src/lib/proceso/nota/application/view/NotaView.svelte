<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Nota} from '@/lib/proceso/nota/domain/entity/Nota';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import NotaSearchComp from '@/lib/proceso/nota/application/component/NotaSearchComp.svelte';
import NotaTableDataComp from '@/lib/proceso/nota/application/component/NotaTableDataComp.svelte';
import NotaFormComp from '@/lib/proceso/nota/application/component/NotaFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Nota';

//------------------ ACCIONES -------------------
let module = 'proceso';
let controller = 'nota_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let notas =  new Array<Nota>();
let nota = new Nota();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let notaSearchComp1 = null; //ref<InstanceType<typeof NotaSearchComp> | null>(null);
let notaFormComp1 = null; //ref<InstanceType<typeof NotaFormComp> | null>(null);

const updateDatos = (notas1:any) => {
	notas = notas1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	notaSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	notaSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	notaSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	notaFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (nota1: any) => {
	notaFormComp1?.handleAction_ClickTableRow(nota1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	notaSearchComp1?.getTodosDatos();
	notaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	notaSearchComp1?.getTodosDatos();
	notaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	notaSearchComp1?.getTodosDatos();
	notaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalnota">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <NotaSearchComp 
				bind:this={notaSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <NotaTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:notas={notas}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <NotaFormComp 
				bind:this={notaFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:nota_prop={nota}
				bind:notas={notas}
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