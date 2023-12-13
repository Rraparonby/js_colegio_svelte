<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';




import type {AlumnoCreateRequest} from '@/lib/estructura/alumno/application/util/request/AlumnoCreateRequest';
import type {AlumnoUpdateRequest} from '@/lib/estructura/alumno/application/util/request/AlumnoUpdateRequest';

/*FKs*/


let titulo = 'Alumnos Lote';

let module = "estructura";
let controller = "alumno_api";


let alumnos =  new Array<Alumno>();
let alumno = new Alumno();

let id_new = 0;
let alumnos_eliminar = new Array<Alumno>();


let accion = 'CANCELAR';

let form_deshabilitado = true;
let nuevo_preparar_display = 'block';
let actualizar_display = 'none';
let eliminar_display = 'none';

	
const onClickRowTable = async (id:number) => {

    let alumno2:Alumno | undefined  = alumnos.find(alumno1 => alumno1.id==id);

    Object.assign(alumno,alumno2);
	
	alumno = alumno2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    alumnos = new Array<Alumno>();

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

    alumnos = data.alumnos;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    alumno = new Alumno();
    
	alumno.id =-1;
	alumno.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	alumno.nombre='';
	alumno.apellido='';
	alumno.fecha_nacimiento=FuncionGeneral.GetLabelDate(new Date());
	

    id_new--;
    alumno.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    alumno = new Alumno();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        alumno.id=id_new;
        alumnos.push(alumno);
		
		alumnos = [...alumnos];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let alumno1 of alumnos) {
            if(alumno1.id == alumno.id) {
                Object.assign(alumno1,alumno);
                break;
            }
        }                
		
		alumnos = [...alumnos];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let alumnos2 = alumnos.filter((alumno1, index, arr) => { 
        return alumno1.id != alumno.id;
    });

    alumnos = alumnos2;

    if(alumno.id>0) {
        alumnos_eliminar.push(alumno);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_alumno();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_alumno = () => {
    let data_json_final = {};
    
    let alumnos_nuevos = [];
    let alumnos_nuevos_final = [];

    let alumnos_actualizars = [];
	let alumnos_actualizars_final = [];
	
    let ids_alumnos_eliminars = [];
    
    let updates_columnas =['nombre','apellido'];

    alumnos_nuevos = alumnos.filter((alumno1:Alumno, index, arr) => { 
        return alumno1.id < 0 ;
    });

    alumnos_nuevos_final = getAlumnosNuevosFinal(alumnos_nuevos);

    alumnos_actualizars = alumnos.filter((alumno1, index, arr) => { 
        return alumno1.id > 0 ;
    });
	
	alumnos_actualizars_final = getAlumnosActualizarsFinal(alumnos_actualizars);
	
    ids_alumnos_eliminars = getIdsAlumnosEliminars();
    
    
    data_json_final = {
        news_alumnos : alumnos_nuevos_final,
        updates_alumnos : alumnos_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_alumnos: ids_alumnos_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsAlumnosEliminars = () => {
    let ids_alumnos_eliminars:Array<number> = [];

    for(let alumno1 of alumnos_eliminar) {
        ids_alumnos_eliminars.push(alumno1.id);
    }

    return ids_alumnos_eliminars;
};

const getAlumnosNuevosFinal = (alumnos_nuevos:Array<Alumno>) => {
    let alumnos_nuevos_final:Array<AlumnoCreateRequest> = [];
    
    for(let alumno1 of alumnos_nuevos) {

        let alumno_nuevo_final:AlumnoCreateRequest = {
			created_at : alumno1.created_at,
			updated_at : alumno1.updated_at,
			nombre : alumno1.nombre,
			apellido : alumno1.apellido,
			fecha_nacimiento : alumno1.fecha_nacimiento,
        };

        alumnos_nuevos_final.push(alumno_nuevo_final);
    }

    return alumnos_nuevos_final;
};

const getAlumnosActualizarsFinal = (alumnos_actualizars:Array<Alumno>) => {
    let alumnos_actualizars_final:Array<AlumnoUpdateRequest> = [];
    
    for(let alumno1 of alumnos_actualizars) {

        let alumno_actualizar_final:AlumnoUpdateRequest = {
			id : Number(alumno1.id),		
			created_at : alumno1.created_at,
			updated_at : alumno1.updated_at,
			nombre : alumno1.nombre,
			apellido : alumno1.apellido,
			fecha_nacimiento : alumno1.fecha_nacimiento,
        };

        alumnos_actualizars_final.push(alumno_actualizar_final);
    }

    return alumnos_actualizars_final;

};




</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_alumno">
	
	<!-- Modal content -->
	<div id="div_alumno_form_general" 
		class="form_general">
		
		<h2>
			Alumnos Lote
		</h2>			
				
		
		<form id="alumno_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={alumno.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={alumno.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={alumno.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={alumno.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="nombre">Nombre</label>
			<input  type="text" id="nombre" name="nombre" placeholder="Nombre"
					bind:value={alumno.nombre} 
					disabled={form_deshabilitado} />
			
			<label for="apellido">Apellido</label>
			<input  type="text" id="apellido" name="apellido" placeholder="Apellido"
					bind:value={alumno.apellido} 
					disabled={form_deshabilitado} />
			
			<label for="fecha_nacimiento">Fecha Nacimiento</label>
			<input  type="date" id="fecha_nacimiento" name="fecha_nacimiento" placeholder="Fecha Nacimiento"
					bind:value={alumno.fecha_nacimiento} 
					disabled={form_deshabilitado} />
							
		</form>
	</div>
	
	<div id="div_alumno_actions_form_general">
		
		<form id="alumno_actions_form_general" 
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
	
	<div id="div_alumno_tabla_general">					
				
		<table id="alumno_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Fecha Nacimiento</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each alumnos as alumno1}			
				<tr on:click={event => onClickRowTable(alumno1.id)}>						
					<td data-label="Id"> { alumno1.id } </td>
					<td data-label="Created At"> { alumno1.created_at } </td>
					<td data-label="Updated At"> { alumno1.updated_at } </td>
					<td data-label="Nombre"> { alumno1.nombre } </td>
					<td data-label="Apellido"> { alumno1.apellido } </td>
					<td data-label="Fecha Nacimiento"> { alumno1.fecha_nacimiento } </td>
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