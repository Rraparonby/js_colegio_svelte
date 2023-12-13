<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';
import {navigate} from 'svelte-routing';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Matricula} from '@/lib/proceso/matricula/domain/entity/Matricula';
import type {MatriculaReturnView} from '@/lib/proceso/matricula/application/util/return/MatriculaReturnView';

import type {MatriculaFKReturnView} from '@/lib/proceso/matricula/application/util/return/MatriculaFKReturnView';

import type {MatriculaCreateRequest} from '@/lib/proceso/matricula/application/util/request/MatriculaCreateRequest';
import type {MatriculaUpdateRequest} from '@/lib/proceso/matricula/application/util/request/MatriculaUpdateRequest';

import {nuevoDatosData,
		actualizarDatosData,
		eliminarDatosData
		,
		getFksData
		} from '@/lib/proceso/matricula/infrastructure/data/MatriculaData';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';


/*const router = useRouter();*/


//------------------ ACCIONES -------------------
export let module:string = ''
export let controller:string = ''

//------------------ DATOS ----------------------
export let matriculas: Array = new Array<Matricula>()
export let matricula_prop: Matricula = new Matricula()

const emit = createEventDispatcher()

//------------------ GENERAL --------------------
let title = 'Formulario Matricula';

//------------------ ACCIONES -------------------
let tipo_accion = Constantes.CANCELAR;

//------------------ ESTILOS -------------------
let display = 'none';
let style_id_column = '';

//------------------ DATOS ----------------------
/*let id = -1;*/
let text_id_aux = '-1';

let matricula = new Matricula();

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
	
	
	matricula.id=-1;
	matricula.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	matricula.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	matricula.anio=0;
	matricula.costo=0.0;
	matricula.fecha=FuncionGeneral.GetLabelDate(new Date());
	matricula.pagado=false;
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

export const handleAction_ClickTableRow = (matricula1:Matricula) => {
	//ocultarMensajeAlerta();			
	tipo_accion = Constantes.SELECCIONAR;			
	abrirModalFormGeneral();
	
	if(Constantes.IS_DEVELOPING == true) {
		text_id_aux = matricula1.id.toString();
	}
				
	matricula.id = matricula1.id;
	matricula.created_at = matricula1.created_at;
	
	matricula.updated_at = matricula1.updated_at;
	matricula.anio = matricula1.anio;
	matricula.costo = matricula1.costo;
	matricula.fecha = matricula1.fecha;
	
	matricula.pagado = Boolean(matricula1.pagado);	
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
	
	const data_json:MatriculaReturnView = await nuevoDatosData(module,controller,matricula);

	emit('handleAction_NuevoDatosView',data_json);
};

export const actualizarDatos = async () => {	
	
	tipo_accion = Constantes.SELECCIONAR;
		
	const data_json:MatriculaReturnView = await actualizarDatosData(module,controller,matricula);
		
	emit('handleAction_ActualizarDatosView',data_json);
			
};

export const eliminarDatos = async () => {
	
	const data_json:MatriculaReturnView = await eliminarDatosData(module,controller,matricula);
	
	emit('handleAction_EliminarDatosView',data_json);		
};

/*FKs*/
const getFks = async () => {
	
	const data:MatriculaReturnView = await getFksData(module,controller);
	
	
	alumnosFK = data.alumnosFK;
};


</script>


<!-- The Modal -->
<div id="divModal_matricula_form_general" 
		class="modal_form_general"
		style="display:{display}">
	
	<!-- Modal content -->
	<div id="divModalContent_matricula_form_general" 
		class="modal_form_general_content">
		
		<div class="modal_form_general_header">
			
			<span id="spanCloseModal_matricula_form_general"
					class="close_modal_form_general" 
					on:click={cerrarModalFormGeneral}>
				&times;
			</span>
			<h2>
				Matricula
			</h2>
			
		</div>
		
		<div class="modal_form_general_body">
		
			<div id="div_matricula_form_general">
			
				<form id="matricula_form_general" 
					class="form_general">

					<input type="hidden" id="id" name="id" 
							bind:value={matricula.id} />
					
					<label id="label_id" name="label_id" for="text_id_aux" class="form-label"
							style="{ style_id_column }">Id</label>				
					<input type="text" id="text_id_aux" name="text_id_aux" 
							class="form-control" style="{ style_id_column }"
							bind:value={text_id_aux} placeholder="Id" readonly/>
					
					<label for="created_at" class="form-label" style="display:none;">Created At</label>
					<input type="text" id="created_at" name="created_at" style="display:none;" 
							class="form-control" placeholder="Created At"
							bind:value={matricula.created_at} />
					
					<label for="updated_at" class="form-label" style="display:none;">Updated At</label>
					<input type="text" id="updated_at" name="updated_at" style="display:none;"
							class="form-control" placeholder="Updated At"
							bind:value={matricula.updated_at} />
							
					
					<label for="anio" class="form-label">Anio</label>
					<input  type="text" 
							id="anio" name="anio"
							class="form-control" placeholder="Anio"
							bind:value={matricula.anio} />
					
					<label for="costo" class="form-label">Costo</label>
					<input  type="text" 
							id="costo" name="costo"
							class="form-control" placeholder="Costo"
							bind:value={matricula.costo} />
					
					<label for="fecha" class="form-label">Fecha</label>
					<input  type="date" 
							id="fecha" name="fecha"
							class="form-control" placeholder="Fecha"
							bind:value={matricula.fecha} />
					
					<label for="pagado" class="form-label">Pagado</label>
					<input  type="checkbox" 
							id="pagado" name="pagado" 
							value="true" placeholder="Pagado"
							class="form-control"
							bind:checked={matricula.pagado} />
						
									
				</form>
				
			</div>
			
			<div id="div_matricula_actions_form_general">
				
				<form id="matricula_actions_form_general" 
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
