<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Sueldo} from '@/lib/financiero/sueldo/domain/entity/Sueldo';
import type {SueldoReturnView} from '@/lib/financiero/sueldo/application/util/return/SueldoReturnView';

import type {SueldoFKReturnView} from '@/lib/financiero/sueldo/application/util/return/SueldoFKReturnView';

import type {SueldoCreateRequest} from '@/lib/financiero/sueldo/application/util/request/SueldoCreateRequest';
import type {SueldoUpdateRequest} from '@/lib/financiero/sueldo/application/util/request/SueldoUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		,
		getFksData
		} from '@/lib/financiero/sueldo/infrastructure/data/SueldoData';

/*FKs*/
import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let sueldos: Array = new Array<Sueldo>()
export let sueldo_prop: Sueldo = new Sueldo()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Sueldo';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let sueldo = new Sueldo();

/*FKs*/

let docentesFK = new Array<Docente>();

let aux = "aux";

onMount(() => {
	//FKs
	getFks();
});
	
export const home = () => {
	navigate('/main');
};

export const nuevoPreparar = () => {
	
	tipo_accion=Constantes.NUEVO;	
	abrirModalFormGeneral();
	
	emit('ocultarMensajeAlertaView');
	//ocultarMensajeAlerta();
	
	/*id = -1;*/
	text_id_aux='-1';
	
	
	sueldo.id=-1;
	sueldo.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	sueldo.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	sueldo.id_docente=-1;
	sueldo.anio=0;
	sueldo.mes=0;
	sueldo.valor=0.0;
	sueldo.cobrado=false;
};

export const cancelar = () => {			
	tipo_accion=Constantes.CANCELAR;			
	cerrarModalFormGeneral();
};

export const abrirModalFormGeneral = () => {
	display='block';
};

export const cerrarModalFormGeneral = () => {
	display='none';
};

export const showConfirm = (mensaje:string) => {
	return window.confirm(mensaje);
};

export const handleAction_ClickTableRow = (sueldo1:Sueldo) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = sueldo1.id.toString();
	}
				
	sueldo.id = sueldo1.id;
	sueldo.created_at = sueldo1.created_at;
	
	sueldo.updated_at = sueldo1.updated_at;
	sueldo.id_docente = sueldo1.id_docente;
	sueldo.anio = sueldo1.anio;
	sueldo.mes = sueldo1.mes;
	sueldo.valor = sueldo1.valor;
	sueldo.cobrado = Boolean(sueldo1.cobrado);	
};

export const actualizar = () => {
	
	if(tipo_accion == Constantes.NUEVO) {
		nuevoDatos();				
		
	} else if(tipo_accion == Constantes.SELECCIONAR) {
		actualizarDatos();			
		
	} else if(tipo_accion == Constantes.ELIMINAR) {
		eliminarDatos();
	}
};

export const eliminar = () => {			
	tipo_accion = Constantes.ELIMINAR;
	
	if(showConfirm(Constantes.MENSAJE_ELIMINAR_SINO)) {
		actualizar();
	}
};

export const nuevoDatos = async () => {
	
	const data_json:SueldoReturnView = await nuevoDatosData(module,controller,sueldo);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:SueldoReturnView = await actualizarDatosData(module,controller,sueldo);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:SueldoReturnView = await eliminarDatosData(module,controller,sueldo);
	
	emit('handleAction_EliminarDatosView',data_json);		
};

/*FKs*/
const getFks = async () => {
	
	const data:SueldoReturnView = await getFksData(module,controller);
	
	
	docentesFK = data.docentesFK;
};


</script>


<!-- The Modal -->
<div id="divModal_sueldo_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_sueldo_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_sueldo_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Sueldo
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_sueldo_form_general">
			
				<form id="sueldo_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={sueldo.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={sueldo.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={sueldo.updated_at} />
							
					
					<label for="id_docente" class="form-label"> Docente</label>
					<select id="id_docente" name="id_docente"
							class="form-select" placeholder=" Docente"
							bind:value={sueldo.id_docente} >
						
						{#each docentesFK as docente}
						<option value={docente.id}>
							{ docente.nombre }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="anio" class="form-label">Anio</label>
					<input  type="text" 
							id="anio" name="anio"
							class="form-control" placeholder="Anio"
							bind:value={sueldo.anio} />
					
					<label for="mes" class="form-label">Mes</label>
					<input  type="text" 
							id="mes" name="mes"
							class="form-control" placeholder="Mes"
							bind:value={sueldo.mes} />
					
					<label for="valor" class="form-label">Valor</label>
					<input  type="text" 
							id="valor" name="valor"
							class="form-control" placeholder="Valor"
							bind:value={sueldo.valor} />
					
					<label for="cobrado" class="form-label">Cobrado</label>
					<input  type="checkbox" 
							id="cobrado" name="cobrado" 
							value="true" placeholder="Cobrado"
							class="form-control"
							bind:checked={sueldo.cobrado} />
						
									
				</form>
				
			</div>
			
			<div id="div_sueldo_actions_form_general">
				
				<form id="sueldo_actions_form_general" 
					class="actions_form_general">				
					
					<button type="button" id="actualizar_button" name="actualizar_button" 
							class="btn btn-primary" value="Actualizar" 
							on:click={actualizar}>
						<fai icon="fa-solid fa-save" />
						Actualizar
					</button>
					
					<button type="button" id="eliminar_button" name="eliminar_button" 
							class="btn btn-primary" value="Eliminar" 
							on:click={eliminar}>
						<fai icon="fa-solid fa-times-circle" />
						Eliminar
					</button>
					
					<button type="button" id="cancelar_button" name="cancelar_button" 
							class="btn btn-primary" value="Cancelar"
							on:click={cancelar}>
						<fai icon="fa-solid fa-minus-circle" />
						Cancelar
					</button>
					
				</form>
				
			</div>
			
		</div>
		
	</div>
	
</div>


<style lang="scss">

/*------------------ BUTTON GENERAL ----------------------*/
@import "@/scss/components/button/button_general";
/*------------------ FORM GENERAL ----------------------*/
@import "@/scss/components/form/form_general";
/*------------------ FORM ACTIONS GENERAL ----------------------*/
@import "@/scss/components/form/actions_form_general";
/*------------------ FORM MODAL GENERAL ----------------------*/
@import "@/scss/components/form/modal_form_general";


/*------------------ RESPONSIVE FORM GENERAL ----------------------*/
@import "@/scss/responsive/form/form_general_responsive";
/*------------------ RESPONSIVE ACTIONS GENERAL ----------------------*/
@import "@/scss/responsive/form/actions_form_general_responsive";

</style>
