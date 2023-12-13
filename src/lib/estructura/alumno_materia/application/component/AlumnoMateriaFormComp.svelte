<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {AlumnoMateria} from '@/lib/estructura/alumno_materia/domain/entity/AlumnoMateria';
import type {AlumnoMateriaReturnView} from '@/lib/estructura/alumno_materia/application/util/return/AlumnoMateriaReturnView';

import type {AlumnoMateriaFKReturnView} from '@/lib/estructura/alumno_materia/application/util/return/AlumnoMateriaFKReturnView';

import type {AlumnoMateriaCreateRequest} from '@/lib/estructura/alumno_materia/application/util/request/AlumnoMateriaCreateRequest';
import type {AlumnoMateriaUpdateRequest} from '@/lib/estructura/alumno_materia/application/util/request/AlumnoMateriaUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		,
		getFksData
		} from '@/lib/estructura/alumno_materia/infrastructure/data/AlumnoMateriaData';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';
import type {Materia} from '@/lib/estructura/materia/domain/entity/Materia';


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let alumno_materias: Array = new Array<AlumnoMateria>()
export let alumno_materia_prop: AlumnoMateria = new AlumnoMateria()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Alumno Materia';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let alumno_materia = new AlumnoMateria();

/*FKs*/

let alumnosFK = new Array<Alumno>();
let materiasFK = new Array<Materia>();

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
	
	
	alumno_materia.id=-1;
	alumno_materia.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno_materia.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno_materia.id_alumno=-1;
	alumno_materia.id_materia=-1;
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

export const handleAction_ClickTableRow = (alumno_materia1:AlumnoMateria) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = alumno_materia1.id.toString();
	}
				
	alumno_materia.id = alumno_materia1.id;
	alumno_materia.created_at = alumno_materia1.created_at;
	
	alumno_materia.updated_at = alumno_materia1.updated_at;
	alumno_materia.id_alumno = alumno_materia1.id_alumno;
	alumno_materia.id_materia = alumno_materia1.id_materia;
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
	
	const data_json:AlumnoMateriaReturnView = await nuevoDatosData(module,controller,alumno_materia);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:AlumnoMateriaReturnView = await actualizarDatosData(module,controller,alumno_materia);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:AlumnoMateriaReturnView = await eliminarDatosData(module,controller,alumno_materia);
	
	emit('handleAction_EliminarDatosView',data_json);		
};

/*FKs*/
const getFks = async () => {
	
	const data:AlumnoMateriaReturnView = await getFksData(module,controller);
	
	
	alumnosFK = data.alumnosFK;
	materiasFK = data.materiasFK;
};


</script>


<!-- The Modal -->
<div id="divModal_alumno_materia_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_alumno_materia_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_alumno_materia_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Alumno Materia
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_alumno_materia_form_general">
			
				<form id="alumno_materia_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={alumno_materia.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={alumno_materia.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={alumno_materia.updated_at} />
							
					
					<label for="id_alumno" class="form-label"> Alumno</label>
					<select id="id_alumno" name="id_alumno"
							class="form-select" placeholder=" Alumno"
							bind:value={alumno_materia.id_alumno} >
						
						{#each alumnosFK as alumno}
						<option value={alumno.id}>
							{ alumno.nombre }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="id_materia" class="form-label"> Materia</label>
					<select id="id_materia" name="id_materia"
							class="form-select" placeholder=" Materia"
							bind:value={alumno_materia.id_materia} >
						
						{#each materiasFK as materia}
						<option value={materia.id}>
							{ materia.codigo }
						</option>
						{/each}
						
					</select>	
						
									
				</form>
				
			</div>
			
			<div id="div_alumno_materia_actions_form_general">
				
				<form id="alumno_materia_actions_form_general" 
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
