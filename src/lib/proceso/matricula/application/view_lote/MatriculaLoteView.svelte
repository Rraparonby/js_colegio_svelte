<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Matricula} from '@/lib/proceso/matricula/domain/entity/Matricula';


import type {MatriculaFKReturnView} from '@/lib/proceso/matricula/application/util/return/MatriculaFKReturnView';


import type {MatriculaCreateRequest} from '@/lib/proceso/matricula/application/util/request/MatriculaCreateRequest';
import type {MatriculaUpdateRequest} from '@/lib/proceso/matricula/application/util/request/MatriculaUpdateRequest';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';


let titulo = 'Matriculas Lote';

let module = "proceso";
let controller = "matricula_api";


let matriculas =  new Array<Matricula>();
let matricula = new Matricula();

let id_new = 0;
let matriculas_eliminar = new Array<Matricula>();

/*FKs*/

let alumnosFK = new Array<Alumno>();

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

    let matricula2:Matricula | undefined  = matriculas.find(matricula1 => matricula1.id==id);

    Object.assign(matricula,matricula2);
	
	matricula = matricula2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    matriculas = new Array<Matricula>();

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

    matriculas = data.matriculas;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    matricula = new Matricula();
    
	matricula.id =-1;
	matricula.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	matricula.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	matricula.anio=0;
	matricula.costo=0.0;
	matricula.fecha=FuncionGeneral.GetLabelDate(new Date());
	matricula.pagado=false;
	

    id_new--;
    matricula.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    matricula = new Matricula();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        matricula.id=id_new;
        matriculas.push(matricula);
		
		matriculas = [...matriculas];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let matricula1 of matriculas) {
            if(matricula1.id == matricula.id) {
                Object.assign(matricula1,matricula);
                break;
            }
        }                
		
		matriculas = [...matriculas];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let matriculas2 = matriculas.filter((matricula1, index, arr) => { 
        return matricula1.id != matricula.id;
    });

    matriculas = matriculas2;

    if(matricula.id>0) {
        matriculas_eliminar.push(matricula);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_matricula();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_matricula = () => {
    let data_json_final = {};
    
    let matriculas_nuevos = [];
    let matriculas_nuevos_final = [];

    let matriculas_actualizars = [];
	let matriculas_actualizars_final = [];
	
    let ids_matriculas_eliminars = [];
    
    let updates_columnas =['anio','costo'];

    matriculas_nuevos = matriculas.filter((matricula1:Matricula, index, arr) => { 
        return matricula1.id < 0 ;
    });

    matriculas_nuevos_final = getMatriculasNuevosFinal(matriculas_nuevos);

    matriculas_actualizars = matriculas.filter((matricula1, index, arr) => { 
        return matricula1.id > 0 ;
    });
	
	matriculas_actualizars_final = getMatriculasActualizarsFinal(matriculas_actualizars);
	
    ids_matriculas_eliminars = getIdsMatriculasEliminars();
    
    
    data_json_final = {
        news_matriculas : matriculas_nuevos_final,
        updates_matriculas : matriculas_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_matriculas: ids_matriculas_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsMatriculasEliminars = () => {
    let ids_matriculas_eliminars:Array<number> = [];

    for(let matricula1 of matriculas_eliminar) {
        ids_matriculas_eliminars.push(matricula1.id);
    }

    return ids_matriculas_eliminars;
};

const getMatriculasNuevosFinal = (matriculas_nuevos:Array<Matricula>) => {
    let matriculas_nuevos_final:Array<MatriculaCreateRequest> = [];
    
    for(let matricula1 of matriculas_nuevos) {

        let matricula_nuevo_final:MatriculaCreateRequest = {
			created_at : matricula1.created_at,
			updated_at : matricula1.updated_at,
			anio : matricula1.anio,
			costo : matricula1.costo,
			fecha : matricula1.fecha,
			pagado : matricula1.pagado,
        };

        matriculas_nuevos_final.push(matricula_nuevo_final);
    }

    return matriculas_nuevos_final;
};

const getMatriculasActualizarsFinal = (matriculas_actualizars:Array<Matricula>) => {
    let matriculas_actualizars_final:Array<MatriculaUpdateRequest> = [];
    
    for(let matricula1 of matriculas_actualizars) {

        let matricula_actualizar_final:MatriculaUpdateRequest = {
			id : Number(matricula1.id),		
			created_at : matricula1.created_at,
			updated_at : matricula1.updated_at,
			anio : matricula1.anio,
			costo : matricula1.costo,
			fecha : matricula1.fecha,
			pagado : matricula1.pagado,
        };

        matriculas_actualizars_final.push(matricula_actualizar_final);
    }

    return matriculas_actualizars_final;

};



const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

/*FKs*/
const getFks = async () => {
	
	const url_global_controller=FuncionGeneral.GetUrlGlobalController(module,controller,Constantes.RJ_GET_FKS);										
	const data_json = {};
	
	const request_options = FuncionGeneral.GetRequestOptions('POST',data_json);
	
	const response_json = await fetch(url_global_controller, request_options);						
	const data:MatriculaFKReturnView = await response_json.json();
	
	
	alumnosFK = data.alumnosFK;			
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_matricula">
	
	<!-- Modal content -->
	<div id="div_matricula_form_general" 
		class="form_general">
		
		<h2>
			Matriculas Lote
		</h2>			
				
		
		<form id="matricula_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={matricula.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={matricula.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={matricula.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={matricula.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="anio">Anio</label>
			<input  type="text" id="anio" name="anio" placeholder="Anio"
					bind:value={matricula.anio} 
					disabled={form_deshabilitado} />
			
			<label for="costo">Costo</label>
			<input  type="text" id="costo" name="costo" placeholder="Costo"
					bind:value={matricula.costo} 
					disabled={form_deshabilitado} />
			
			<label for="fecha">Fecha</label>
			<input  type="date" id="fecha" name="fecha" placeholder="Fecha"
					bind:value={matricula.fecha} 
					disabled={form_deshabilitado} />
			
			<label for="pagado">Pagado</label>
			<input  type="checkbox" id="pagado" name="pagado" placeholder="Pagado"
					bind:checked={matricula.pagado} 
					disabled={form_deshabilitado} />
				
							
		</form>
	</div>
	
	<div id="div_matricula_actions_form_general">
		
		<form id="matricula_actions_form_general" 
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
	
	<div id="div_matricula_tabla_general">					
				
		<table id="matricula_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th></th>
					<th>Created At</th>
					<th>Updated At</th>
					<th style="text-align:center;">Anio</th>
					<th style="text-align:center;">Costo</th>
					<th>Fecha</th>
					<th style="text-align:center;">Pagado</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each matriculas as matricula1}			
				<tr on:click={event => onClickRowTable(matricula1.id)}>						
					<td data-label=""> { matricula1?.alumno?.nombre } </td>
					<td data-label="Created At"> { matricula1.created_at } </td>
					<td data-label="Updated At"> { matricula1.updated_at } </td>
					<td data-label="Anio" style="text-align:center;"> { matricula1.anio } </td>
					<td data-label="Costo" style="text-align:center;"> { matricula1.costo } </td>
					<td data-label="Fecha"> { matricula1.fecha } </td>
					<td data-label="Pagado" style="text-align:center;"> { GetLabelBoolean(matricula1.pagado) } </td>
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