<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Sueldo} from '@/lib/financiero/sueldo/domain/entity/Sueldo';
import {SueldoReturnView} from '@/lib/financiero/sueldo/application/util/return/SueldoReturnView';

import {onClickTableRowData} from '@/lib/financiero/sueldo/infrastructure/data/SueldoData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let sueldo1:Sueldo = new Sueldo()


const emit = createEventDispatcher()
							

const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

const onClickTableRow = async (sueldo1: Sueldo) => {		
	
	const data_json:SueldoReturnView = await onClickTableRowData(module,controller,sueldo1);

	emit('handleAction_ClickTableRowTableView',data_json.sueldo1);
		
};

</script>

<tr id={sueldo1.id}
	class=""
	on:click={$event => onClickTableRow(sueldo1)}>
	
	<td data-label="Id" style={ style_id_column }> { sueldo1.id } </td>
	<td data-label="Created At" style="display:none;"> { sueldo1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { sueldo1.updated_at } </td>
	<td data-label=" Docente"> { sueldo1?.docente?.nombre } </td>
	<td data-label="Anio" style="text-align:center;"> { sueldo1.anio } </td>
	<td data-label="Mes" style="text-align:center;"> { sueldo1.mes } </td>
	<td data-label="Valor" style="text-align:center;"> { sueldo1.valor } </td>
	<td data-label="Cobrado" style="text-align:center;"> { GetLabelBoolean(sueldo1.cobrado) } </td>

</tr>

<style lang="scss">

</style>
