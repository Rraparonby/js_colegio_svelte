<script lang="ts">

/*import {ref} from 'vue';*/

import {Constantes} from '@/lib/base/util/Constantes';
//import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Materia} from '@/lib/estructura/materia/domain/entity/Materia';

import HeaderComp from '@/lib/base/application/component/HeaderComp.svelte';
import FooterComp from '@/lib/base/application/component/FooterComp.svelte';
import AlertComp from '@/lib/base/application/component/AlertComp.svelte';

import MateriaSearchComp from '@/lib/estructura/materia/application/component/MateriaSearchComp.svelte';
import MateriaTableDataComp from '@/lib/estructura/materia/application/component/MateriaTableDataComp.svelte';
import MateriaFormComp from '@/lib/estructura/materia/application/component/MateriaFormComp.svelte';

			
//------------------ GENERAL --------------------
let title = 'Materia';

//------------------ ACCIONES -------------------
let module = 'estructura';
let controller = 'materia_api';
let tipo_busqueda = 'ninguno';

//------------------ DATOS ----------------------
let materias =  new Array<Materia>();
let materia = new Materia();

//------------------ MENSAJE ALERT --------------
let tipo_mensaje = 'NONE';
let mensaje = 'NONE';
		
let headerComp1 = null; //ref<InstanceType<typeof HeaderComp> | null>(null);
let alertComp1 = null; //ref<InstanceType<typeof AlertComp> | null>(null);
//let footerComp1 = null; //ref<InstanceType<typeof FooterComp> | null>(null);

let materiaSearchComp1 = null; //ref<InstanceType<typeof MateriaSearchComp> | null>(null);
let materiaFormComp1 = null; //ref<InstanceType<typeof MateriaFormComp> | null>(null);

const updateDatos = (materias1:any) => {
	materias = materias1.detail;
};

const getTodosDatos = () => {
	headerComp1?.mostrarLoader();
	materiaSearchComp1?.getTodosDatos();
	headerComp1?.ocultarLoader();
};

const anteriores = () => {
	headerComp1?.mostrarLoader();
	materiaSearchComp1?.anteriores();
	headerComp1?.ocultarLoader();
};

const siguientes = () => {
	headerComp1?.mostrarLoader();
	materiaSearchComp1?.siguientes();
	headerComp1?.ocultarLoader();
};

const ocultarMensajeAlerta = () => {
	tipo_mensaje = "NONE";
    mensaje = "";
	
    alertComp1?.closeAlertGeneral();
};

const nuevoPreparar = () => {
	materiaFormComp1?.nuevoPreparar();
};

const handleAction_ClickTableRow = (materia1: any) => {
	materiaFormComp1?.handleAction_ClickTableRow(materia1.detail);
};

const handleAction_NuevoDatos = () => { 
	//data_json
	materiaSearchComp1?.getTodosDatos();
	materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_INGRESADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_ActualizarDatos = () => { //data_json
	materiaSearchComp1?.getTodosDatos();
	materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ACTUALIZADO);
	
	headerComp1?.ocultarLoader();
};

const handleAction_EliminarDatos = () => { //data_json
	materiaSearchComp1?.getTodosDatos();
	materiaFormComp1?.cerrarModalFormGeneral();
	
	setMensajeAlerta(Constantes.SUCCESS,Constantes.MENSAJE_ELIMINADO);
	
	headerComp1?.ocultarLoader();
};

const setMensajeAlerta = (tipo_mensaje1:string,mensaje1:string) => {
	tipo_mensaje = tipo_mensaje1;
	mensaje = mensaje1;
	
	alertComp1?.setMensajeAlerta();
};

</script>

<div id="divViewGlobalmateria">

	<HeaderComp bind:this={headerComp1}/>
	
    <h3 class="titulo_general">
		{title}
	</h3>
	
	<AlertComp 	bind:this={alertComp1}
				bind:tipo_mensaje={tipo_mensaje}
				bind:mensaje={mensaje}/>
    
    <MateriaSearchComp 
				bind:this={materiaSearchComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:tipo_busqueda={tipo_busqueda}
				on:updateDatosView={updateDatos}/>
				
    <MateriaTableDataComp 
				bind:module={module} 
				bind:controller={controller}
				bind:materias={materias}
				on:getTodosDatosView={getTodosDatos}
				on:anterioresView={anteriores} 
				on:siguientesView={siguientes}
				on:nuevoPrepararView={nuevoPreparar}
				on:handleAction_ClickTableRowView={handleAction_ClickTableRow}/>
				
    <MateriaFormComp 
				bind:this={materiaFormComp1}
				bind:module={module} 
				bind:controller={controller}
				bind:materia_prop={materia}
				bind:materias={materias}
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