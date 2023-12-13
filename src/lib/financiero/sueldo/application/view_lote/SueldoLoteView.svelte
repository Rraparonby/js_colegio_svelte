<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Sueldo} from '@/lib/financiero/sueldo/domain/entity/Sueldo';


import type {SueldoFKReturnView} from '@/lib/financiero/sueldo/application/util/return/SueldoFKReturnView';


import type {SueldoCreateRequest} from '@/lib/financiero/sueldo/application/util/request/SueldoCreateRequest';
import type {SueldoUpdateRequest} from '@/lib/financiero/sueldo/application/util/request/SueldoUpdateRequest';

/*FKs*/
import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';


let titulo = 'Sueldos Lote';

let module = "financiero";
let controller = "sueldo_api";


let sueldos =  new Array<Sueldo>();
let sueldo = new Sueldo();

let id_new = 0;
let sueldos_eliminar = new Array<Sueldo>();

/*FKs*/

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

    let sueldo2:Sueldo | undefined  = sueldos.find(sueldo1 => sueldo1.id==id);

    Object.assign(sueldo,sueldo2);
	
	sueldo = sueldo2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    sueldos = new Array<Sueldo>();

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

    sueldos = data.sueldos;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    sueldo = new Sueldo();
    
	sueldo.id =-1;
	sueldo.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	sueldo.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	sueldo.id_docente=-1;
	sueldo.anio=0;
	sueldo.mes=0;
	sueldo.valor=0.0;
	sueldo.cobrado=false;
	

    id_new--;
    sueldo.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    sueldo = new Sueldo();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        sueldo.id=id_new;
        sueldos.push(sueldo);
		
		sueldos = [...sueldos];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let sueldo1 of sueldos) {
            if(sueldo1.id == sueldo.id) {
                Object.assign(sueldo1,sueldo);
                break;
            }
        }                
		
		sueldos = [...sueldos];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let sueldos2 = sueldos.filter((sueldo1, index, arr) => { 
        return sueldo1.id != sueldo.id;
    });

    sueldos = sueldos2;

    if(sueldo.id>0) {
        sueldos_eliminar.push(sueldo);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_sueldo();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_sueldo = () => {
    let data_json_final = {};
    
    let sueldos_nuevos = [];
    let sueldos_nuevos_final = [];

    let sueldos_actualizars = [];
	let sueldos_actualizars_final = [];
	
    let ids_sueldos_eliminars = [];
    
    let updates_columnas =['id_docente','anio'];

    sueldos_nuevos = sueldos.filter((sueldo1:Sueldo, index, arr) => { 
        return sueldo1.id < 0 ;
    });

    sueldos_nuevos_final = getSueldosNuevosFinal(sueldos_nuevos);

    sueldos_actualizars = sueldos.filter((sueldo1, index, arr) => { 
        return sueldo1.id > 0 ;
    });
	
	sueldos_actualizars_final = getSueldosActualizarsFinal(sueldos_actualizars);
	
    ids_sueldos_eliminars = getIdsSueldosEliminars();
    
    
    data_json_final = {
        news_sueldos : sueldos_nuevos_final,
        updates_sueldos : sueldos_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_sueldos: ids_sueldos_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsSueldosEliminars = () => {
    let ids_sueldos_eliminars:Array<number> = [];

    for(let sueldo1 of sueldos_eliminar) {
        ids_sueldos_eliminars.push(sueldo1.id);
    }

    return ids_sueldos_eliminars;
};

const getSueldosNuevosFinal = (sueldos_nuevos:Array<Sueldo>) => {
    let sueldos_nuevos_final:Array<SueldoCreateRequest> = [];
    
    for(let sueldo1 of sueldos_nuevos) {

        let sueldo_nuevo_final:SueldoCreateRequest = {
			created_at : sueldo1.created_at,
			updated_at : sueldo1.updated_at,
			id_docente : sueldo1.id_docente,
			anio : sueldo1.anio,
			mes : sueldo1.mes,
			valor : sueldo1.valor,
			cobrado : sueldo1.cobrado,
        };

        sueldos_nuevos_final.push(sueldo_nuevo_final);
    }

    return sueldos_nuevos_final;
};

const getSueldosActualizarsFinal = (sueldos_actualizars:Array<Sueldo>) => {
    let sueldos_actualizars_final:Array<SueldoUpdateRequest> = [];
    
    for(let sueldo1 of sueldos_actualizars) {

        let sueldo_actualizar_final:SueldoUpdateRequest = {
			id : Number(sueldo1.id),		
			created_at : sueldo1.created_at,
			updated_at : sueldo1.updated_at,
			id_docente : sueldo1.id_docente,
			anio : sueldo1.anio,
			mes : sueldo1.mes,
			valor : sueldo1.valor,
			cobrado : sueldo1.cobrado,
        };

        sueldos_actualizars_final.push(sueldo_actualizar_final);
    }

    return sueldos_actualizars_final;

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
	const data:SueldoFKReturnView = await response_json.json();
	
	
	docentesFK = data.docentesFK;			
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_sueldo">
	
	<!-- Modal content -->
	<div id="div_sueldo_form_general" 
		class="form_general">
		
		<h2>
			Sueldos Lote
		</h2>			
				
		
		<form id="sueldo_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={sueldo.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={sueldo.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={sueldo.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={sueldo.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="id_docente"> Docente</label>
			<select id="id_docente" name="id_docente" placeholder=" Docente"
					bind-value={sueldo.id_docente}
					disabled={form_deshabilitado} >
				
				{#each docentesFK as docente}
				<option value={docente.id}>
					{ docente.nombre }
				</option>
				{/each}
				
			</select>	
				
			
			<label for="anio">Anio</label>
			<input  type="text" id="anio" name="anio" placeholder="Anio"
					bind:value={sueldo.anio} 
					disabled={form_deshabilitado} />
			
			<label for="mes">Mes</label>
			<input  type="text" id="mes" name="mes" placeholder="Mes"
					bind:value={sueldo.mes} 
					disabled={form_deshabilitado} />
			
			<label for="valor">Valor</label>
			<input  type="text" id="valor" name="valor" placeholder="Valor"
					bind:value={sueldo.valor} 
					disabled={form_deshabilitado} />
			
			<label for="cobrado">Cobrado</label>
			<input  type="checkbox" id="cobrado" name="cobrado" placeholder="Cobrado"
					bind:checked={sueldo.cobrado} 
					disabled={form_deshabilitado} />
				
							
		</form>
	</div>
	
	<div id="div_sueldo_actions_form_general">
		
		<form id="sueldo_actions_form_general" 
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
	
	<div id="div_sueldo_tabla_general">					
				
		<table id="sueldo_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th> Docente</th>
					<th style="text-align:center;">Anio</th>
					<th style="text-align:center;">Mes</th>
					<th style="text-align:center;">Valor</th>
					<th style="text-align:center;">Cobrado</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each sueldos as sueldo1}			
				<tr on:click={event => onClickRowTable(sueldo1.id)}>						
					<td data-label="Id"> { sueldo1.id } </td>
					<td data-label="Created At"> { sueldo1.created_at } </td>
					<td data-label="Updated At"> { sueldo1.updated_at } </td>
					<td data-label=" Docente"> { sueldo1?.docente?.nombre } </td>
					<td data-label="Anio" style="text-align:center;"> { sueldo1.anio } </td>
					<td data-label="Mes" style="text-align:center;"> { sueldo1.mes } </td>
					<td data-label="Valor" style="text-align:center;"> { sueldo1.valor } </td>
					<td data-label="Cobrado" style="text-align:center;"> { GetLabelBoolean(sueldo1.cobrado) } </td>
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