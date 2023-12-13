<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Nota} from '@/lib/proceso/nota/domain/entity/Nota';


import type {NotaFKReturnView} from '@/lib/proceso/nota/application/util/return/NotaFKReturnView';


import type {NotaCreateRequest} from '@/lib/proceso/nota/application/util/request/NotaCreateRequest';
import type {NotaUpdateRequest} from '@/lib/proceso/nota/application/util/request/NotaUpdateRequest';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';
import type {Materia} from '@/lib/estructura/materia/domain/entity/Materia';
import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';


let titulo = 'Notas Lote';

let module = "proceso";
let controller = "nota_api";


let notas =  new Array<Nota>();
let nota = new Nota();

let id_new = 0;
let notas_eliminar = new Array<Nota>();

/*FKs*/

let alumnosFK = new Array<Alumno>();
let materiasFK = new Array<Materia>();
let docentesFK = new Array<Docente>();

let accion = 'CANCELAR';

let form_deshabilitado = true;
let nuevo_preparar_display = 'block';
let actualizar_display = 'none';
let eliminar_display = 'none';

onMount(() => {
	/*FKs*/
	getFks();		
});
	
const onClickRowTable = async (id:number) => {

    let nota2:Nota | undefined  = notas.find(nota1 => nota1.id==id);

    Object.assign(nota,nota2);
	
	nota = nota2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    notas = new Array<Nota>();

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

    notas = data.notas;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    nota = new Nota();
    
	nota.id =-1;
	nota.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	nota.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	nota.id_alumno=-1;
	nota.id_materia=-1;
	nota.id_docente=-1;
	nota.nota_prueba=0.0;
	nota.nota_trabajo=0.0;
	nota.nota_examen=0.0;
	nota.nota_final=0.0;
	

    id_new--;
    nota.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    nota = new Nota();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        nota.id=id_new;
        notas.push(nota);
		
		notas = [...notas];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let nota1 of notas) {
            if(nota1.id == nota.id) {
                Object.assign(nota1,nota);
                break;
            }
        }                
		
		notas = [...notas];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let notas2 = notas.filter((nota1, index, arr) => { 
        return nota1.id != nota.id;
    });

    notas = notas2;

    if(nota.id>0) {
        notas_eliminar.push(nota);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_nota();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_nota = () => {
    let data_json_final = {};
    
    let notas_nuevos = [];
    let notas_nuevos_final = [];

    let notas_actualizars = [];
	let notas_actualizars_final = [];
	
    let ids_notas_eliminars = [];
    
    let updates_columnas =['id_alumno','id_materia'];

    notas_nuevos = notas.filter((nota1:Nota, index, arr) => { 
        return nota1.id < 0 ;
    });

    notas_nuevos_final = getNotasNuevosFinal(notas_nuevos);

    notas_actualizars = notas.filter((nota1, index, arr) => { 
        return nota1.id > 0 ;
    });
	
	notas_actualizars_final = getNotasActualizarsFinal(notas_actualizars);
	
    ids_notas_eliminars = getIdsNotasEliminars();
    
    
    data_json_final = {
        news_notas : notas_nuevos_final,
        updates_notas : notas_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_notas: ids_notas_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsNotasEliminars = () => {
    let ids_notas_eliminars:Array<number> = [];

    for(let nota1 of notas_eliminar) {
        ids_notas_eliminars.push(nota1.id);
    }

    return ids_notas_eliminars;
};

const getNotasNuevosFinal = (notas_nuevos:Array<Nota>) => {
    let notas_nuevos_final:Array<NotaCreateRequest> = [];
    
    for(let nota1 of notas_nuevos) {

        let nota_nuevo_final:NotaCreateRequest = {
			created_at : nota1.created_at,
			updated_at : nota1.updated_at,
			id_alumno : nota1.id_alumno,
			id_materia : nota1.id_materia,
			id_docente : nota1.id_docente,
			nota_prueba : nota1.nota_prueba,
			nota_trabajo : nota1.nota_trabajo,
			nota_examen : nota1.nota_examen,
			nota_final : nota1.nota_final,
        };

        notas_nuevos_final.push(nota_nuevo_final);
    }

    return notas_nuevos_final;
};

const getNotasActualizarsFinal = (notas_actualizars:Array<Nota>) => {
    let notas_actualizars_final:Array<NotaUpdateRequest> = [];
    
    for(let nota1 of notas_actualizars) {

        let nota_actualizar_final:NotaUpdateRequest = {
			id : Number(nota1.id),		
			created_at : nota1.created_at,
			updated_at : nota1.updated_at,
			id_alumno : nota1.id_alumno,
			id_materia : nota1.id_materia,
			id_docente : nota1.id_docente,
			nota_prueba : nota1.nota_prueba,
			nota_trabajo : nota1.nota_trabajo,
			nota_examen : nota1.nota_examen,
			nota_final : nota1.nota_final,
        };

        notas_actualizars_final.push(nota_actualizar_final);
    }

    return notas_actualizars_final;

};



/*FKs*/
const getFks = async () => {
	
	const url_global_controller=FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_GET_FKS);										
	const data_json = {};
	
	const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);
	
	const response_json = await fetch(url_global_controller, request_options);						
	const data:NotaFKReturnView = await response_json.json();
	
	
	alumnosFK = data.alumnosFK;
	materiasFK = data.materiasFK;
	docentesFK = data.docentesFK;			
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_nota">
	
	<!-- Modal content -->
	<div id="div_nota_form_general" 
		class="form_general">
		
		<h2>
			Notas Lote
		</h2>			
				
		
		<form id="nota_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={nota.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={nota.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={nota.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={nota.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="id_alumno"> Alumno</label>
			<select id="id_alumno" name="id_alumno" placeholder=" Alumno"
					bind-value={nota.id_alumno}
					disabled={form_deshabilitado} >
				
				{#each alumnosFK as alumno}
				<option value={alumno.id}>
					{ alumno.nombre }
				</option>
				{/each}
				
			</select>	
				
			
			<label for="id_materia"> Materia</label>
			<select id="id_materia" name="id_materia" placeholder=" Materia"
					bind-value={nota.id_materia}
					disabled={form_deshabilitado} >
				
				{#each materiasFK as materia}
				<option value={materia.id}>
					{ materia.codigo }
				</option>
				{/each}
				
			</select>	
				
			
			<label for="id_docente"> Docente</label>
			<select id="id_docente" name="id_docente" placeholder=" Docente"
					bind-value={nota.id_docente}
					disabled={form_deshabilitado} >
				
				{#each docentesFK as docente}
				<option value={docente.id}>
					{ docente.nombre }
				</option>
				{/each}
				
			</select>	
				
			
			<label for="nota_prueba">Nota Prueba</label>
			<input  type="text" id="nota_prueba" name="nota_prueba" placeholder="Nota Prueba"
					bind:value={nota.nota_prueba} 
					disabled={form_deshabilitado} />
			
			<label for="nota_trabajo">Nota Trabajo</label>
			<input  type="text" id="nota_trabajo" name="nota_trabajo" placeholder="Nota Trabajo"
					bind:value={nota.nota_trabajo} 
					disabled={form_deshabilitado} />
			
			<label for="nota_examen">Nota Examen</label>
			<input  type="text" id="nota_examen" name="nota_examen" placeholder="Nota Examen"
					bind:value={nota.nota_examen} 
					disabled={form_deshabilitado} />
			
			<label for="nota_final">Nota Final</label>
			<input  type="text" id="nota_final" name="nota_final" placeholder="Nota Final"
					bind:value={nota.nota_final} 
					disabled={form_deshabilitado} />
							
		</form>
	</div>
	
	<div id="div_nota_actions_form_general">
		
		<form id="nota_actions_form_general" 
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
	
	<div id="div_nota_tabla_general">					
				
		<table id="nota_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th> Alumno</th>
					<th> Materia</th>
					<th> Docente</th>
					<th style="text-align:center;">Nota Prueba</th>
					<th style="text-align:center;">Nota Trabajo</th>
					<th style="text-align:center;">Nota Examen</th>
					<th style="text-align:center;">Nota Final</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each notas as nota1}			
				<tr on:click={event => onClickRowTable(nota1.id)}>						
					<td data-label="Id"> { nota1.id } </td>
					<td data-label="Created At"> { nota1.created_at } </td>
					<td data-label="Updated At"> { nota1.updated_at } </td>
					<td data-label=" Alumno"> { nota1?.alumno?.nombre } </td>
					<td data-label=" Materia"> { nota1?.materia?.codigo } </td>
					<td data-label=" Docente"> { nota1?.docente?.nombre } </td>
					<td data-label="Nota Prueba" style="text-align:center;"> { nota1.nota_prueba } </td>
					<td data-label="Nota Trabajo" style="text-align:center;"> { nota1.nota_trabajo } </td>
					<td data-label="Nota Examen" style="text-align:center;"> { nota1.nota_examen } </td>
					<td data-label="Nota Final" style="text-align:center;"> { nota1.nota_final } </td>
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