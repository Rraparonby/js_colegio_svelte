<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Materia} from '@/lib/estructura/materia/domain/entity/Materia';




import type {MateriaCreateRequest} from '@/lib/estructura/materia/application/util/request/MateriaCreateRequest';
import type {MateriaUpdateRequest} from '@/lib/estructura/materia/application/util/request/MateriaUpdateRequest';

/*FKs*/


let titulo = 'Materias Lote';

let module = "estructura";
let controller = "materia_api";


let materias =  new Array<Materia>();
let materia = new Materia();

let id_new = 0;
let materias_eliminar = new Array<Materia>();


let accion = 'CANCELAR';

let form_deshabilitado = true;
let nuevo_preparar_display = 'block';
let actualizar_display = 'none';
let eliminar_display = 'none';

	
const onClickRowTable = async (id:number) => {

    let materia2:Materia | undefined  = materias.find(materia1 => materia1.id==id);

    Object.assign(materia,materia2);
	
	materia = materia2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    materias = new Array<Materia>();

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

    materias = data.materias;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    materia = new Materia();
    
	materia.id =-1;
	materia.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	materia.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	materia.codigo='';
	materia.nombre='';
	materia.activo=false;
	

    id_new--;
    materia.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    materia = new Materia();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        materia.id=id_new;
        materias.push(materia);
		
		materias = [...materias];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let materia1 of materias) {
            if(materia1.id == materia.id) {
                Object.assign(materia1,materia);
                break;
            }
        }                
		
		materias = [...materias];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let materias2 = materias.filter((materia1, index, arr) => { 
        return materia1.id != materia.id;
    });

    materias = materias2;

    if(materia.id>0) {
        materias_eliminar.push(materia);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_materia();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_materia = () => {
    let data_json_final = {};
    
    let materias_nuevos = [];
    let materias_nuevos_final = [];

    let materias_actualizars = [];
	let materias_actualizars_final = [];
	
    let ids_materias_eliminars = [];
    
    let updates_columnas =['codigo','nombre'];

    materias_nuevos = materias.filter((materia1:Materia, index, arr) => { 
        return materia1.id < 0 ;
    });

    materias_nuevos_final = getMateriasNuevosFinal(materias_nuevos);

    materias_actualizars = materias.filter((materia1, index, arr) => { 
        return materia1.id > 0 ;
    });
	
	materias_actualizars_final = getMateriasActualizarsFinal(materias_actualizars);
	
    ids_materias_eliminars = getIdsMateriasEliminars();
    
    
    data_json_final = {
        news_materias : materias_nuevos_final,
        updates_materias : materias_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_materias: ids_materias_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsMateriasEliminars = () => {
    let ids_materias_eliminars:Array<number> = [];

    for(let materia1 of materias_eliminar) {
        ids_materias_eliminars.push(materia1.id);
    }

    return ids_materias_eliminars;
};

const getMateriasNuevosFinal = (materias_nuevos:Array<Materia>) => {
    let materias_nuevos_final:Array<MateriaCreateRequest> = [];
    
    for(let materia1 of materias_nuevos) {

        let materia_nuevo_final:MateriaCreateRequest = {
			created_at : materia1.created_at,
			updated_at : materia1.updated_at,
			codigo : materia1.codigo,
			nombre : materia1.nombre,
			activo : materia1.activo,
        };

        materias_nuevos_final.push(materia_nuevo_final);
    }

    return materias_nuevos_final;
};

const getMateriasActualizarsFinal = (materias_actualizars:Array<Materia>) => {
    let materias_actualizars_final:Array<MateriaUpdateRequest> = [];
    
    for(let materia1 of materias_actualizars) {

        let materia_actualizar_final:MateriaUpdateRequest = {
			id : Number(materia1.id),		
			created_at : materia1.created_at,
			updated_at : materia1.updated_at,
			codigo : materia1.codigo,
			nombre : materia1.nombre,
			activo : materia1.activo,
        };

        materias_actualizars_final.push(materia_actualizar_final);
    }

    return materias_actualizars_final;

};



const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_materia">
	
	<!-- Modal content -->
	<div id="div_materia_form_general" 
		class="form_general">
		
		<h2>
			Materias Lote
		</h2>			
				
		
		<form id="materia_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={materia.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={materia.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={materia.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={materia.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="codigo">Codigo</label>
			<input  type="text" id="codigo" name="codigo" placeholder="Codigo"
					bind:value={materia.codigo} 
					disabled={form_deshabilitado} />
			
			<label for="nombre">Nombre</label>
			<input  type="text" id="nombre" name="nombre" placeholder="Nombre"
					bind:value={materia.nombre} 
					disabled={form_deshabilitado} />
			
			<label for="activo">Activo</label>
			<input  type="checkbox" id="activo" name="activo" placeholder="Activo"
					bind:checked={materia.activo} 
					disabled={form_deshabilitado} />
				
							
		</form>
	</div>
	
	<div id="div_materia_actions_form_general">
		
		<form id="materia_actions_form_general" 
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
	
	<div id="div_materia_tabla_general">					
				
		<table id="materia_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th>Codigo</th>
					<th>Nombre</th>
					<th style="text-align:center;">Activo</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each materias as materia1}			
				<tr on:click={event => onClickRowTable(materia1.id)}>						
					<td data-label="Id"> { materia1.id } </td>
					<td data-label="Created At"> { materia1.created_at } </td>
					<td data-label="Updated At"> { materia1.updated_at } </td>
					<td data-label="Codigo"> { materia1.codigo } </td>
					<td data-label="Nombre"> { materia1.nombre } </td>
					<td data-label="Activo" style="text-align:center;"> { GetLabelBoolean(materia1.activo) } </td>
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