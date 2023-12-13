<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Materia} from '@/lib/estructura/materia/domain/entity/Materia';
import type {MateriaReturnView} from '@/lib/estructura/materia/application/util/return/MateriaReturnView';


import type {MateriaCreateRequest} from '@/lib/estructura/materia/application/util/request/MateriaCreateRequest';
import type {MateriaUpdateRequest} from '@/lib/estructura/materia/application/util/request/MateriaUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		} from '@/lib/estructura/materia/infrastructure/data/MateriaData';

/*FKs*/


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let materias: Array = new Array<Materia>()
export let materia_prop: Materia = new Materia()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Materia';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let materia = new Materia();


let aux = "aux";

	
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
	
	
	materia.id=-1;
	materia.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	materia.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	materia.codigo='';
	materia.nombre='';
	materia.activo=false;
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

export const handleAction_ClickTableRow = (materia1:Materia) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = materia1.id.toString();
	}
				
	materia.id = materia1.id;
	materia.created_at = materia1.created_at;
	
	materia.updated_at = materia1.updated_at;
	materia.codigo = materia1.codigo;
	materia.nombre = materia1.nombre;
	materia.activo = Boolean(materia1.activo);	
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
	
	const data_json:MateriaReturnView = await nuevoDatosData(module,controller,materia);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:MateriaReturnView = await actualizarDatosData(module,controller,materia);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:MateriaReturnView = await eliminarDatosData(module,controller,materia);
	
	emit('handleAction_EliminarDatosView',data_json);		
};


</script>


<!-- The Modal -->
<div id="divModal_materia_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_materia_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_materia_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Materia
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_materia_form_general">
			
				<form id="materia_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={materia.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={materia.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={materia.updated_at} />
							
					
					<label for="codigo" class="form-label">Codigo</label>
					<input  type="text" 
							id="codigo" name="codigo"
							class="form-control" placeholder="Codigo"
							bind:value={materia.codigo} />
					
					<label for="nombre" class="form-label">Nombre</label>
					<input  type="text" 
							id="nombre" name="nombre"
							class="form-control" placeholder="Nombre"
							bind:value={materia.nombre} />
					
					<label for="activo" class="form-label">Activo</label>
					<input  type="checkbox" 
							id="activo" name="activo" 
							value="true" placeholder="Activo"
							class="form-control"
							bind:checked={materia.activo} />
						
									
				</form>
				
			</div>
			
			<div id="div_materia_actions_form_general">
				
				<form id="materia_actions_form_general" 
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
