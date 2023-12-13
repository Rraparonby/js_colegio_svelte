<script lang="ts">

import {onMount,createEventDispatcher} from 'svelte';

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Pension} from '@/lib/financiero/pension/domain/entity/Pension';


import type {PensionFKReturnView} from '@/lib/financiero/pension/application/util/return/PensionFKReturnView';


import type {PensionCreateRequest} from '@/lib/financiero/pension/application/util/request/PensionCreateRequest';
import type {PensionUpdateRequest} from '@/lib/financiero/pension/application/util/request/PensionUpdateRequest';

/*FKs*/
import type {Alumno} from '@/lib/estructura/alumno/domain/entity/Alumno';


let titulo = 'Pensions Lote';

let module = "financiero";
let controller = "pension_api";


let pensions =  new Array<Pension>();
let pension = new Pension();

let id_new = 0;
let pensions_eliminar = new Array<Pension>();

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

    let pension2:Pension | undefined  = pensions.find(pension1 => pension1.id==id);

    Object.assign(pension,pension2);
	
	pension = pension2;
	
    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'block'; 

    accion='ACTUALIZAR';
    //console.log('onClickRowTable');
};

const getTodosDatos = async () => {
    pensions = new Array<Pension>();

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

    pensions = data.pensions;

	//console.log('getTodosDatosParent');
};

const nuevoPreparar = () => {
	//console.log('nuevoPrepararParent');

    pension = new Pension();
    
	pension.id =-1;
	pension.created_at=FuncionGeneral.GetLabelDateTime(new Date());
	pension.updated_at=FuncionGeneral.GetLabelDateTime(new Date());
	pension.id_alumno=-1;
	pension.anio=0;
	pension.mes=0;
	pension.valor=0.0;
	pension.cobrado=false;
	

    id_new--;
    pension.id=id_new;
    
    accion='NUEVO';

    form_deshabilitado=false;

    nuevo_preparar_display= 'none';
    actualizar_display='block';
    eliminar_display= 'none'; 
};

const cancelar = () => {
    pension = new Pension();
    //console.log('cancelar');

    accion='CANCELAR';

    form_deshabilitado=true;

    nuevo_preparar_display= 'block';
    actualizar_display='none';   
    eliminar_display= 'none'; 
};

const actualizar = () => {

    if(accion==='NUEVO') {
        pension.id=id_new;
        pensions.push(pension);
		
		pensions = [...pensions];
		
        cancelar();                

    } else if(accion==='ACTUALIZAR') {
        //console.log('actualizar');
        
        for(let pension1 of pensions) {
            if(pension1.id == pension.id) {
                Object.assign(pension1,pension);
                break;
            }
        }                
		
		pensions = [...pensions];
		
        cancelar();
    }

    //console.log('actualizar');
};

const eliminar = () => {	

    let pensions2 = pensions.filter((pension1, index, arr) => { 
        return pension1.id != pension.id;
    });

    pensions = pensions2;

    if(pension.id>0) {
        pensions_eliminar.push(pension);
    }

    cancelar();
    //console.log('eliminar');
};

const guardar = async () => {	

    let data_json= prepararGuardarCambios_pension();

    let request_options = FuncionGeneral.GetRequestOptions('POST',data_json);			
    
    let url_controller = FuncionGeneral.GetUrlGlobalController(module,controller,'guardar_cambios');                                    
    
    let response_json = await fetch(url_controller, request_options);                

    let response_data = await response_json.json();
    
    console.log(response_data);            

    alert('Cambios Guardados');
};

const prepararGuardarCambios_pension = () => {
    let data_json_final = {};
    
    let pensions_nuevos = [];
    let pensions_nuevos_final = [];

    let pensions_actualizars = [];
	let pensions_actualizars_final = [];
	
    let ids_pensions_eliminars = [];
    
    let updates_columnas =['id_alumno','anio'];

    pensions_nuevos = pensions.filter((pension1:Pension, index, arr) => { 
        return pension1.id < 0 ;
    });

    pensions_nuevos_final = getPensionsNuevosFinal(pensions_nuevos);

    pensions_actualizars = pensions.filter((pension1, index, arr) => { 
        return pension1.id > 0 ;
    });
	
	pensions_actualizars_final = getPensionsActualizarsFinal(pensions_actualizars);
	
    ids_pensions_eliminars = getIdsPensionsEliminars();
    
    
    data_json_final = {
        news_pensions : pensions_nuevos_final,
        updates_pensions : pensions_actualizars_final,
        updates_columnas : updates_columnas,
        ids_deletes_pensions: ids_pensions_eliminars
    };
        
    //console.log(data_json_final);
    
    return data_json_final;
};

const getIdsPensionsEliminars = () => {
    let ids_pensions_eliminars:Array<number> = [];

    for(let pension1 of pensions_eliminar) {
        ids_pensions_eliminars.push(pension1.id);
    }

    return ids_pensions_eliminars;
};

const getPensionsNuevosFinal = (pensions_nuevos:Array<Pension>) => {
    let pensions_nuevos_final:Array<PensionCreateRequest> = [];
    
    for(let pension1 of pensions_nuevos) {

        let pension_nuevo_final:PensionCreateRequest = {
			created_at : pension1.created_at,
			updated_at : pension1.updated_at,
			id_alumno : pension1.id_alumno,
			anio : pension1.anio,
			mes : pension1.mes,
			valor : pension1.valor,
			cobrado : pension1.cobrado,
        };

        pensions_nuevos_final.push(pension_nuevo_final);
    }

    return pensions_nuevos_final;
};

const getPensionsActualizarsFinal = (pensions_actualizars:Array<Pension>) => {
    let pensions_actualizars_final:Array<PensionUpdateRequest> = [];
    
    for(let pension1 of pensions_actualizars) {

        let pension_actualizar_final:PensionUpdateRequest = {
			id : Number(pension1.id),		
			created_at : pension1.created_at,
			updated_at : pension1.updated_at,
			id_alumno : pension1.id_alumno,
			anio : pension1.anio,
			mes : pension1.mes,
			valor : pension1.valor,
			cobrado : pension1.cobrado,
        };

        pensions_actualizars_final.push(pension_actualizar_final);
    }

    return pensions_actualizars_final;

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
	const data:PensionFKReturnView = await response_json.json();
	
	
	alumnosFK = data.alumnosFK;			
};


</script>


<!-- The Modal -->
<div id="divLoteViewGlobal_pension">
	
	<!-- Modal content -->
	<div id="div_pension_form_general" 
		class="form_general">
		
		<h2>
			Pensions Lote
		</h2>			
				
		
		<form id="pension_form_general" 
			class="form_general">

			<input type="hidden" id="id" name="id" 
					bind:value={pension.id} />
			
			<label id="label_id" for="id">Id</label>				
			<input type="text" id="id" name="id" placeholder="Id"
					bind:value={pension.id}  
					disabled={form_deshabilitado}/>
			
			<label for="created_at">Created At</label>
			<input type="text" id="created_at" name="created_at" placeholder="Created At"
					bind:value={pension.created_at} 
					disabled={form_deshabilitado} />
			
			<label for="updated_at">Updated At</label>
			<input type="text" id="updated_at" name="updated_at" placeholder="Updated At"
					bind:value={pension.updated_at} 
					disabled={form_deshabilitado} />
					
			
			<label for="id_alumno"> Alumno</label>
			<select id="id_alumno" name="id_alumno" placeholder=" Alumno"
					bind-value={pension.id_alumno}
					disabled={form_deshabilitado} >
				
				{#each alumnosFK as alumno}
				<option value={alumno.id}>
					{ alumno.nombre }
				</option>
				{/each}
				
			</select>	
				
			
			<label for="anio">Anio</label>
			<input  type="text" id="anio" name="anio" placeholder="Anio"
					bind:value={pension.anio} 
					disabled={form_deshabilitado} />
			
			<label for="mes">Mes</label>
			<input  type="text" id="mes" name="mes" placeholder="Mes"
					bind:value={pension.mes} 
					disabled={form_deshabilitado} />
			
			<label for="valor">Valor</label>
			<input  type="text" id="valor" name="valor" placeholder="Valor"
					bind:value={pension.valor} 
					disabled={form_deshabilitado} />
			
			<label for="cobrado">Cobrado</label>
			<input  type="checkbox" id="cobrado" name="cobrado" placeholder="Cobrado"
					bind:checked={pension.cobrado} 
					disabled={form_deshabilitado} />
				
							
		</form>
	</div>
	
	<div id="div_pension_actions_form_general">
		
		<form id="pension_actions_form_general" 
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
	
	<div id="div_pension_tabla_general">					
				
		<table id="pension_tabla_general" class="table_general">
			
			<thead>
				<tr>					
					<th>Id</th>
					<th>Created At</th>
					<th>Updated At</th>
					<th> Alumno</th>
					<th style="text-align:center;">Anio</th>
					<th style="text-align:center;">Mes</th>
					<th style="text-align:center;">Valor</th>
					<th style="text-align:center;">Cobrado</th>
				</tr>
			</thead>
			
			<tbody>		
				
				{#each pensions as pension1}			
				<tr on:click={event => onClickRowTable(pension1.id)}>						
					<td data-label="Id"> { pension1.id } </td>
					<td data-label="Created At"> { pension1.created_at } </td>
					<td data-label="Updated At"> { pension1.updated_at } </td>
					<td data-label=" Alumno"> { pension1?.alumno?.nombre } </td>
					<td data-label="Anio" style="text-align:center;"> { pension1.anio } </td>
					<td data-label="Mes" style="text-align:center;"> { pension1.mes } </td>
					<td data-label="Valor" style="text-align:center;"> { pension1.valor } </td>
					<td data-label="Cobrado" style="text-align:center;"> { GetLabelBoolean(pension1.cobrado) } </td>
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