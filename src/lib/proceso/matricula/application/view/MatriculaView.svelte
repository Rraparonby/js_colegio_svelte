<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Matricula} from '@/lib/proceso/matricula/domain/entity/Matricula';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import MatriculaSearchComp from '@/lib/proceso/matricula/application/component/MatriculaSearchComp.svelte';
import MatriculaTableDataComp from '@/lib/proceso/matricula/application/component/MatriculaTableDataComp.svelte';
import MatriculaFormComp from '@/lib/proceso/matricula/application/component/MatriculaFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Matricula';

//------------------ ACCIONES -------------------
let module = 'proceso';
let controller = 'matricula_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let matriculas =  new Array<Matricula>();
let matricula = new Matricula();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let matriculaSearchComp1 = null; //ref<InstanceType<typeof MatriculaSearchComp> | null>(null);
let matriculaFormComp1 = null; //ref<InstanceType<typeof MatriculaFormComp> | null>(null);

const updateDatos = (matriculas1:any) => {
	matriculas = matriculas1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	matriculaSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	matriculaSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	matriculaSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	matriculaFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (matricula1: any) => {
	matriculaFormComp1?.handleAction_ClickTableRow(matricula1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	matriculaSearchComp1?.getTodosDatos();
	matriculaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	matriculaSearchComp1?.getTodosDatos();
	matriculaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	matriculaSearchComp1?.getTodosDatos();
	matriculaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalmatricula">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <MatriculaSearchComp 
				bind:this={matriculaSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <MatriculaTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:matriculas={matriculas}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <MatriculaFormComp 
				bind:this={matriculaFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:matricula_prop={matricula}
				bind:matriculas={matriculas}
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