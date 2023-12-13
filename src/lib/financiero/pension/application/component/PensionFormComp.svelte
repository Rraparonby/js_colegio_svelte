<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Pension} from '@/lib/financiero/pension/domain/entity/Pension';
import type {PensionReturnView} from '@/lib/financiero/pension/application/util/return/PensionReturnView';

import type {PensionFKReturnView} from '@/lib/financiero/pension/application/util/return/PensionFKReturnView';

import type {PensionCreateRequest} from '@/lib/financiero/pension/application/util/request/PensionCreateRequest';
import type {PensionUpdateRequest} from '@/lib/financiero/pension/application/util/request/PensionUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		,
		getFksData
		} from '@/lib/financiero/pension/infrastructure/data/PensionData';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let pensions: Array = new Array<Pension>()
export let pension_prop: Pension = new Pension()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Pension';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let pension = new Pension();

/*FKs*/

let alumnosFK = new Array<Alumno>();

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
	
	
	pension.id=-1;
	pension.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	pension.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	pension.id_alumno=-1;
	pension.anio=0;
	pension.mes=0;
	pension.valor=0.0;
	pension.cobrado=false;
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

export const handleAction_ClickTableRow = (pension1:Pension) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = pension1.id.toString();
	}
				
	pension.id = pension1.id;
	pension.created_at = pension1.created_at;
	
	pension.updated_at = pension1.updated_at;
	pension.id_alumno = pension1.id_alumno;
	pension.anio = pension1.anio;
	pension.mes = pension1.mes;
	pension.valor = pension1.valor;
	pension.cobrado = Boolean(pension1.cobrado);	
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
	
	const data_json:PensionReturnView = await nuevoDatosData(module,controller,pension);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:PensionReturnView = await actualizarDatosData(module,controller,pension);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:PensionReturnView = await eliminarDatosData(module,controller,pension);
	
	emit('handleAction_EliminarDatosView',data_json);		
};

/*FKs*/
const getFks = async () => {
	
	const data:PensionReturnView = await getFksData(module,controller);
	
	
	alumnosFK = data.alumnosFK;
};


</script>


<!-- The Modal -->
<div id="divModal_pension_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_pension_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_pension_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Pension
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_pension_form_general">
			
				<form id="pension_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={pension.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={pension.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={pension.updated_at} />
							
					
					<label for="id_alumno" class="form-label"> Alumno</label>
					<select id="id_alumno" name="id_alumno"
							class="form-select" placeholder=" Alumno"
							bind:value={pension.id_alumno} >
						
						{#each alumnosFK as alumno}
						<option value={alumno.id}>
							{ alumno.nombre }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="anio" class="form-label">Anio</label>
					<input  type="text" 
							id="anio" name="anio"
							class="form-control" placeholder="Anio"
							bind:value={pension.anio} />
					
					<label for="mes" class="form-label">Mes</label>
					<input  type="text" 
							id="mes" name="mes"
							class="form-control" placeholder="Mes"
							bind:value={pension.mes} />
					
					<label for="valor" class="form-label">Valor</label>
					<input  type="text" 
							id="valor" name="valor"
							class="form-control" placeholder="Valor"
							bind:value={pension.valor} />
					
					<label for="cobrado" class="form-label">Cobrado</label>
					<input  type="checkbox" 
							id="cobrado" name="cobrado" 
							value="true" placeholder="Cobrado"
							class="form-control"
							bind:checked={pension.cobrado} />
						
									
				</form>
				
			</div>
			
			<div id="div_pension_actions_form_general">
				
				<form id="pension_actions_form_general" 
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
