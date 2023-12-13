<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Docente} from '@/lib/estructura/docente/domain/entity/Docente';




import type {DocenteCreateRequest} from '@/lib/estructura/docente/application/util/request/DocenteCreateRequest';
import type {DocenteUpdateRequest} from '@/lib/estructura/docente/application/util/request/DocenteUpdateRequest';

/*FKs*/


let titulo = 'Docentes Lote';

let module = "estructura";
let controller = "docente_api";


let docentes =  new Array<Docente>();
let docente = new Docente();

let id_new = 0;
let docentes_eliminar = new Array<Docente>();


let accion = 'CANCELAR';

let form_deshabilitado = true;
let nuevo_preparar_display = 'block';
let actualizar_display = 'none';
let eliminar_display = 'none';

	
const onClickRowTable = async (id:number) => {

    let docente2:Docente | undefined  = docentes.find(docente1 => docente1.id==id);

    Object.assign(docente,docente2);
	
	docente = docente2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    docentes = new Array<Docente>();

    let data_json = {
        pagination: {
            skip: 0,
            limit: 25
        }
    };
    
    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_TODOS);
                
    const response_json = await fetch(url_controller, request_options);

    const data = await response_json.json();

    console.log(data);

    docentes = data.docentes;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    docente = new Docente();
    
	docente.id =-1;
	docente.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	docente.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	docente.nombre='';
	docente.apellido='';
	docente.fecha_nacimiento=FuncionGeneral.GetLabelDate(new Date());
	docente.anios_experiencia=0;
	docente.nota_evaluacion=0.0;
	

    id_new--;
    docente.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    docente = new Docente();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        docente.id=id_new;
        docentes.push(docente);
		
		docentes = [...docentes];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let docente1 of docentes) {
            if(docente1.id == docente.id) {
                Object.assign(docente1,docente);
                break;
            }
        }                
		
		docentes = [...docentes];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let docentes2 = docentes.filter((docente1, index, arr) => { 
        return docente1.id != docente.id;
    });

    docentes = docentes2;

    if(docente.id>0) {
        docentes_eliminar.push(docente);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_docente();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_docente = () => {
    let data_json_final = {};
    
    let docentes_nuevos = [];
    let docentes_nuevos_final = [];

    let docentes_actualizars = [];
	let docentes_actualizars_final = [];
	
    let ids_docentes_eliminars = [];
    
    let updates_columnas =['nombre','apellido'];

    docentes_nuevos = docentes.filter((docente1:Docente, index, arr) => { 
        return docente1.id < 0 ;
    });

    docentes_nuevos_final = getDocentesNuevosFinal(docentes_nuevos);

    docentes_actualizars = docentes.filter((docente1, index, arr) => { 
        return docente1.id > 0 ;
    });
	
	docentes_actualizars_final = getDocentesActualizarsFinal(docentes_actualizars);
	
    ids_docentes_eliminars = getIdsDocentesEliminars();
    
    
    data_json_final = {
        news_docentes : docentes_nuevos_final,
        updates_docentes : docentes_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_docentes: ids_docentes_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsDocentesEliminars = () => {
    let ids_docentes_eliminars:Array<number> = [];

    for(let docente1 of docentes_eliminar) {
        ids_docentes_eliminars.push(docente1.id);
    }

    return ids_docentes_eliminars;
};

const getDocentesNuevosFinal = (docentes_nuevos:Array<Docente>) => {
    let docentes_nuevos_final:Array<DocenteCreateRequest> = [];
    
    for(let docente1 of docentes_nuevos) {

        let docente_nuevo_final:DocenteCreateRequest = {
			created_at : docente1.created_at,
			updated_at : docente1.updated_at,
			nombre : docente1.nombre,
			apellido : docente1.apellido,
			fecha_nacimiento : docente1.fecha_nacimiento,
			anios_experiencia : docente1.anios_experiencia,
			nota_evaluacion : docente1.nota_evaluacion,
        };

        docentes_nuevos_final.push(docente_nuevo_final);
    }

    return docentes_nuevos_final;
};

const getDocentesActualizarsFinal = (docentes_actualizars:Array<Docente>) => {
    let docentes_actualizars_final:Array<DocenteUpdateRequest> = [];
    
    for(let docente1 of docentes_actualizars) {

        let docente_actualizar_final:DocenteUpdateRequest = {
			id : Number(docente1.id),		
			created_at : docente1.created_at,
			updated_at : docente1.updated_at,
			nombre : docente1.nombre,
			apellido : docente1.apellido,
			fecha_nacimiento : docente1.fecha_nacimiento,
			anios_experiencia : docente1.anios_experiencia,
			nota_evaluacion : docente1.nota_evaluacion,
        };

        docentes_actualizars_final.push(docente_actualizar_final);
    }

    return docentes_actualizars_final;

};




</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_docente">
	
	<!-- Modal content -->
	<div id="div_docente_form_general" 
		class="form_general">
		
		<h2>
			Docentes Lote
		</h2>			
				
		
		<form id="docente_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={docente.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={docente.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={docente.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={docente.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="nombre">Nombre</label>
			<input  type="text" id="nombre" name="nombre" placeholder="Nombre"
					bind:value={docente.nombre} 
					disabled={form_deshabilitado} />
			
			<label for="apellido">Apellido</label>
			<input  type="text" id="apellido" name="apellido" placeholder="Apellido"
					bind:value={docente.apellido} 
					disabled={form_deshabilitado} />
			
			<label for="fecha_nacimiento">Fecha Nacimiento</label>
			<input  type="date" id="fecha_nacimiento" name="fecha_nacimiento" placeholder="Fecha Nacimiento"
					bind:value={docente.fecha_nacimiento} 
					disabled={form_deshabilitado} />
			
			<label for="anios_experiencia">Anios Experiencia</label>
			<input  type="text" id="anios_experiencia" name="anios_experiencia" placeholder="Anios Experiencia"
					bind:value={docente.anios_experiencia} 
					disabled={form_deshabilitado} />
			
			<label for="nota_evaluacion">Nota Evaluacion</label>
			<input  type="text" id="nota_evaluacion" name="nota_evaluacion" placeholder="Nota Evaluacion"
					bind:value={docente.nota_evaluacion} 
					disabled={form_deshabilitado} />
							
		</form>
	</div>
	
	<div id="div_docente_actions_form_general">
		
		<form id="docente_actions_form_general" 
			class="actions_form_general">				
			
			<button type="button" id="recargar_button" name="recargar_button" 
					value="Recargar" class="button_general" 
					on:click={getTodosDatos}>
				<fai icon="fa-solid fa-sync" />
				Recargar
			</button>
			
			<button type="button" id="nuevo_preparar_button" name="nuevo_preparar_button" 
					value="Nuevo" class="button_general" 
					on:click={nuevoPreparar}
					style="display:{nuevo_preparar_display}">
				<fai icon="fa-solid fa-plus-circle" />
				Nuevo
			</button>
			
			<button type="button" id="actualizar_button" name="actualizar_button" 
					class="button_general" value="Actualizar" 
					on:click={actualizar}
					style="display:{actualizar_display}">
				<fai icon="fa-solid fa-save" />
				Actualizar
			</button>
			
			<button type="button" id="eliminar_button" name="eliminar_button" 
					class="button_general" value="Eliminar" 
					on:click={eliminar}
					style="display:{eliminar_display}">
				<fai icon="fa-solid fa-times-circle" />
				Eliminar
			</button>
			
			<button type="button" id="cancelar_button" name="cancelar_button" 
					class="button_general" value="Cancelar"
					on:click={cancelar}>
				<fai icon="fa-solid fa-minus-circle" />
				Cancelar
			</button>
			
			<button type="button" id="guardar_button" name="guardar_button" 
					class="button_general" value="Guardar"
					on:click={guardar}>
				<fai icon="fa-solid fa-minus-circle" />
				Guardar
			</button>
			
		</form>
		
	</div>
	
	<div id="div_docente_tabla_general">					
				
		<table id="docente_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Fecha Nacimiento</th>
					<th style="text-align:center;">Anios Experiencia</th>
					<th style="text-align:center;">Nota Evaluacion</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each docentes as docente1}			
				<tr on:click={event => onClickRowTable(docente1.id)}>						
					<td data-label="Id"> { docente1.id } </td>
					<td data-label="Created At"> { docente1.created_at } </td>
					<td data-label="Updated At"> { docente1.updated_at } </td>
					<td data-label="Nombre"> { docente1.nombre } </td>
					<td data-label="Apellido"> { docente1.apellido } </td>
					<td data-label="Fecha Nacimiento"> { docente1.fecha_nacimiento } </td>
					<td data-label="Anios Experiencia" style="text-align:center;"> { docente1.anios_experiencia } </td>
					<td data-label="Nota Evaluacion" style="text-align:center;"> { docente1.nota_evaluacion } </td>
				</tr>	
				{/each}
				
			</tbody>
			
		</table>
	</div>
	
</div>


<style lang="scss">

/*------------------ TITLE GENERAL ----------------------*/
@import "@/scss/components/title/titulo_general";


/*----------------------------- FORMULARIO ---------------------------------*/

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


/*----------------------------- TABLA DATOS ---------------------------------*/

/*------------------ TABLE GENERAL ----------------------*/
@import "@/scss/components/table/table_general";
/*------------------ FORM PAGINATION GENERAL ----------------------*/
@import "@/scss/components/form/pagination_form_general";


/*------------------ RESPONSIVE TABLE GENERAL ----------------------*/
@import "@/scss/responsive/table/table_general_responsive";
/*------------------ RESPONSIVE FORM PAGINATION GENERAL ----------------------*/
@import "@/scss/responsive/form/pagination_form_general_responsive";

</style>