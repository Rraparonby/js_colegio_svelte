<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Contrato} from '@/lib/financiero/contrato/domain/entity/Contrato';


import type {ContratoFKReturnView} from '@/lib/financiero/contrato/application/util/return/ContratoFKReturnView';


import type {ContratoCreateRequest} from '@/lib/financiero/contrato/application/util/request/ContratoCreateRequest';
import type {ContratoUpdateRequest} from '@/lib/financiero/contrato/application/util/request/ContratoUpdateRequest';

/*FKs*/
import type {Docente} from '@/lib/estructura/docente/domain/entity/Docente';


let titulo = 'Contratos Lote';

let module = "financiero";
let controller = "contrato_api";


let contratos =  new Array<Contrato>();
let contrato = new Contrato();

let id_new = 0;
let contratos_eliminar = new Array<Contrato>();

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

    let contrato2:Contrato | undefined  = contratos.find(contrato1 => contrato1.id==id);

    Object.assign(contrato,contrato2);
	
	contrato = contrato2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    contratos = new Array<Contrato>();

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

    contratos = data.contratos;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    contrato = new Contrato();
    
	contrato.id =-1;
	contrato.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	contrato.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	contrato.anio=0;
	contrato.valor=0.0;
	contrato.fecha=FuncionGeneral.GetLabelDate(new Date());
	contrato.firmado=false;
	

    id_new--;
    contrato.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    contrato = new Contrato();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        contrato.id=id_new;
        contratos.push(contrato);
		
		contratos = [...contratos];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let contrato1 of contratos) {
            if(contrato1.id == contrato.id) {
                Object.assign(contrato1,contrato);
                break;
            }
        }                
		
		contratos = [...contratos];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let contratos2 = contratos.filter((contrato1, index, arr) => { 
        return contrato1.id != contrato.id;
    });

    contratos = contratos2;

    if(contrato.id>0) {
        contratos_eliminar.push(contrato);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_contrato();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_contrato = () => {
    let data_json_final = {};
    
    let contratos_nuevos = [];
    let contratos_nuevos_final = [];

    let contratos_actualizars = [];
	let contratos_actualizars_final = [];
	
    let ids_contratos_eliminars = [];
    
    let updates_columnas =['anio','valor'];

    contratos_nuevos = contratos.filter((contrato1:Contrato, index, arr) => { 
        return contrato1.id < 0 ;
    });

    contratos_nuevos_final = getContratosNuevosFinal(contratos_nuevos);

    contratos_actualizars = contratos.filter((contrato1, index, arr) => { 
        return contrato1.id > 0 ;
    });
	
	contratos_actualizars_final = getContratosActualizarsFinal(contratos_actualizars);
	
    ids_contratos_eliminars = getIdsContratosEliminars();
    
    
    data_json_final = {
        news_contratos : contratos_nuevos_final,
        updates_contratos : contratos_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_contratos: ids_contratos_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsContratosEliminars = () => {
    let ids_contratos_eliminars:Array<number> = [];

    for(let contrato1 of contratos_eliminar) {
        ids_contratos_eliminars.push(contrato1.id);
    }

    return ids_contratos_eliminars;
};

const getContratosNuevosFinal = (contratos_nuevos:Array<Contrato>) => {
    let contratos_nuevos_final:Array<ContratoCreateRequest> = [];
    
    for(let contrato1 of contratos_nuevos) {

        let contrato_nuevo_final:ContratoCreateRequest = {
			created_at : contrato1.created_at,
			updated_at : contrato1.updated_at,
			anio : contrato1.anio,
			valor : contrato1.valor,
			fecha : contrato1.fecha,
			firmado : contrato1.firmado,
        };

        contratos_nuevos_final.push(contrato_nuevo_final);
    }

    return contratos_nuevos_final;
};

const getContratosActualizarsFinal = (contratos_actualizars:Array<Contrato>) => {
    let contratos_actualizars_final:Array<ContratoUpdateRequest> = [];
    
    for(let contrato1 of contratos_actualizars) {

        let contrato_actualizar_final:ContratoUpdateRequest = {
			id : Number(contrato1.id),		
			created_at : contrato1.created_at,
			updated_at : contrato1.updated_at,
			anio : contrato1.anio,
			valor : contrato1.valor,
			fecha : contrato1.fecha,
			firmado : contrato1.firmado,
        };

        contratos_actualizars_final.push(contrato_actualizar_final);
    }

    return contratos_actualizars_final;

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
	const data:ContratoFKReturnView = await response_json.json();
	
	
	docentesFK = data.docentesFK;			
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_contrato">
	
	<!-- Modal content -->
	<div id="div_contrato_form_general" 
		class="form_general">
		
		<h2>
			Contratos Lote
		</h2>			
				
		
		<form id="contrato_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={contrato.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={contrato.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={contrato.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={contrato.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="anio">Anio</label>
			<input  type="text" id="anio" name="anio" placeholder="Anio"
					bind:value={contrato.anio} 
					disabled={form_deshabilitado} />
			
			<label for="valor">Valor</label>
			<input  type="text" id="valor" name="valor" placeholder="Valor"
					bind:value={contrato.valor} 
					disabled={form_deshabilitado} />
			
			<label for="fecha">Fecha</label>
			<input  type="date" id="fecha" name="fecha" placeholder="Fecha"
					bind:value={contrato.fecha} 
					disabled={form_deshabilitado} />
			
			<label for="firmado">Firmado</label>
			<input  type="checkbox" id="firmado" name="firmado" placeholder="Firmado"
					bind:checked={contrato.firmado} 
					disabled={form_deshabilitado} />
				
							
		</form>
	</div>
	
	<div id="div_contrato_actions_form_general">
		
		<form id="contrato_actions_form_general" 
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
	
	<div id="div_contrato_tabla_general">					
				
		<table id="contrato_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th></th>
					<th>Created At</th>
					<th>Updated At</th>
					<th style="text-align:center;">Anio</th>
					<th style="text-align:center;">Valor</th>
					<th>Fecha</th>
					<th style="text-align:center;">Firmado</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each contratos as contrato1}			
				<tr on:click={event => onClickRowTable(contrato1.id)}>						
					<td data-label=""> { contrato1?.docente?.nombre } </td>
					<td data-label="Created At"> { contrato1.created_at } </td>
					<td data-label="Updated At"> { contrato1.updated_at } </td>
					<td data-label="Anio" style="text-align:center;"> { contrato1.anio } </td>
					<td data-label="Valor" style="text-align:center;"> { contrato1.valor } </td>
					<td data-label="Fecha"> { contrato1.fecha } </td>
					<td data-label="Firmado" style="text-align:center;"> { GetLabelBoolean(contrato1.firmado) } </td>
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