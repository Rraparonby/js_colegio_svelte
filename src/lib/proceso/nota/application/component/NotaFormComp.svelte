<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Nota} from '@/lib/proceso/nota/domain/entity/Nota';
import type {NotaReturnView} from '@/lib/proceso/nota/application/util/return/NotaReturnView';

import type {NotaFKReturnView} from '@/lib/proceso/nota/application/util/return/NotaFKReturnView';

import type {NotaCreateRequest} from '@/lib/proceso/nota/application/util/request/NotaCreateRequest';
import type {NotaUpdateRequest} from '@/lib/proceso/nota/application/util/request/NotaUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		,
		getFksData
		} from '@/lib/proceso/nota/infrastructure/data/NotaData';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';
import type {Materia} from '@/lib/estructura/materia/domain/entity/Materia';
import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let notas: Array = new Array<Nota>()
export let nota_prop: Nota = new Nota()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Nota';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let nota = new Nota();

/*FKs*/

let alumnosFK = new Array<Alumno>();
let materiasFK = new Array<Materia>();
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
	
	
	nota.id=-1;
	nota.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	nota.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	nota.id_alumno=-1;
	nota.id_materia=-1;
	nota.id_docente=-1;
	nota.nota_prueba=0.0;
	nota.nota_trabajo=0.0;
	nota.nota_examen=0.0;
	nota.nota_final=0.0;
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

export const handleAction_ClickTableRow = (nota1:Nota) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = nota1.id.toString();
	}
				
	nota.id = nota1.id;
	nota.created_at = nota1.created_at;
	
	nota.updated_at = nota1.updated_at;
	nota.id_alumno = nota1.id_alumno;
	nota.id_materia = nota1.id_materia;
	nota.id_docente = nota1.id_docente;
	nota.nota_prueba = nota1.nota_prueba;
	nota.nota_trabajo = nota1.nota_trabajo;
	nota.nota_examen = nota1.nota_examen;
	nota.nota_final = nota1.nota_final;
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
	
	const data_json:NotaReturnView = await nuevoDatosData(module,controller,nota);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:NotaReturnView = await actualizarDatosData(module,controller,nota);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:NotaReturnView = await eliminarDatosData(module,controller,nota);
	
	emit('handleAction_EliminarDatosView',data_json);		
};

/*FKs*/
const getFks = async () => {
	
	const data:NotaReturnView = await getFksData(module,controller);
	
	
	alumnosFK = data.alumnosFK;
	materiasFK = data.materiasFK;
	docentesFK = data.docentesFK;
};


</script>


<!-- The Modal -->
<div id="divModal_nota_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_nota_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_nota_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Nota
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_nota_form_general">
			
				<form id="nota_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={nota.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={nota.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={nota.updated_at} />
							
					
					<label for="id_alumno" class="form-label"> Alumno</label>
					<select id="id_alumno" name="id_alumno"
							class="form-select" placeholder=" Alumno"
							bind:value={nota.id_alumno} >
						
						{#each alumnosFK as alumno}
						<option value={alumno.id}>
							{ alumno.nombre }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="id_materia" class="form-label"> Materia</label>
					<select id="id_materia" name="id_materia"
							class="form-select" placeholder=" Materia"
							bind:value={nota.id_materia} >
						
						{#each materiasFK as materia}
						<option value={materia.id}>
							{ materia.codigo }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="id_docente" class="form-label"> Docente</label>
					<select id="id_docente" name="id_docente"
							class="form-select" placeholder=" Docente"
							bind:value={nota.id_docente} >
						
						{#each docentesFK as docente}
						<option value={docente.id}>
							{ docente.nombre }
						</option>
						{/each}
						
					</select>	
						
					
					<label for="nota_prueba" class="form-label">Nota Prueba</label>
					<input  type="text" 
							id="nota_prueba" name="nota_prueba"
							class="form-control" placeholder="Nota Prueba"
							bind:value={nota.nota_prueba} />
					
					<label for="nota_trabajo" class="form-label">Nota Trabajo</label>
					<input  type="text" 
							id="nota_trabajo" name="nota_trabajo"
							class="form-control" placeholder="Nota Trabajo"
							bind:value={nota.nota_trabajo} />
					
					<label for="nota_examen" class="form-label">Nota Examen</label>
					<input  type="text" 
							id="nota_examen" name="nota_examen"
							class="form-control" placeholder="Nota Examen"
							bind:value={nota.nota_examen} />
					
					<label for="nota_final" class="form-label">Nota Final</label>
					<input  type="text" 
							id="nota_final" name="nota_final"
							class="form-control" placeholder="Nota Final"
							bind:value={nota.nota_final} />
									
				</form>
				
			</div>
			
			<div id="div_nota_actions_form_general">
				
				<form id="nota_actions_form_general" 
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
