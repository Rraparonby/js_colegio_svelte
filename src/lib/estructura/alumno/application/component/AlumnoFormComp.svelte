<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';
import type {AlumnoReturnView} from '@/lib/estructura/alumno/application/util/return/AlumnoReturnView';


import type {AlumnoCreateRequest} from '@/lib/estructura/alumno/application/util/request/AlumnoCreateRequest';
import type {AlumnoUpdateRequest} from '@/lib/estructura/alumno/application/util/request/AlumnoUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		} from '@/lib/estructura/alumno/infrastructure/data/AlumnoData';

/*FKs*/


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let alumnos: Array = new Array<Alumno>()
export let alumno_prop: Alumno = new Alumno()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Alumno';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let alumno = new Alumno();


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
	
	
	alumno.id=-1;
	alumno.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno.nombre='';
	alumno.apellido='';
	alumno.fecha_nacimiento=FuncionGeneral.GetLabelDate(new Date());
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

export const handleAction_ClickTableRow = (alumno1:Alumno) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = alumno1.id.toString();
	}
				
	alumno.id = alumno1.id;
	alumno.created_at = alumno1.created_at;
	
	alumno.updated_at = alumno1.updated_at;
	alumno.nombre = alumno1.nombre;
	alumno.apellido = alumno1.apellido;
	alumno.fecha_nacimiento = alumno1.fecha_nacimiento;
	
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
	
	const data_json:AlumnoReturnView = await nuevoDatosData(module,controller,alumno);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:AlumnoReturnView = await actualizarDatosData(module,controller,alumno);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:AlumnoReturnView = await eliminarDatosData(module,controller,alumno);
	
	emit('handleAction_EliminarDatosView',data_json);		
};


</script>


<!-- The Modal -->
<div id="divModal_alumno_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_alumno_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_alumno_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Alumno
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_alumno_form_general">
			
				<form id="alumno_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={alumno.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={alumno.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={alumno.updated_at} />
							
					
					<label for="nombre" class="form-label">Nombre</label>
					<input  type="text" 
							id="nombre" name="nombre"
							class="form-control" placeholder="Nombre"
							bind:value={alumno.nombre} />
					
					<label for="apellido" class="form-label">Apellido</label>
					<input  type="text" 
							id="apellido" name="apellido"
							class="form-control" placeholder="Apellido"
							bind:value={alumno.apellido} />
					
					<label for="fecha_nacimiento" class="form-label">Fecha Nacimiento</label>
					<input  type="date" 
							id="fecha_nacimiento" name="fecha_nacimiento"
							class="form-control" placeholder="Fecha Nacimiento"
							bind:value={alumno.fecha_nacimiento} />
									
				</form>
				
			</div>
			
			<div id="div_alumno_actions_form_general">
				
				<form id="alumno_actions_form_general" 
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
