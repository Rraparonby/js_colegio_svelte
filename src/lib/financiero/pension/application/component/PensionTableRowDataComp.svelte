<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Pension} from '@/lib/financiero/pension/domain/entity/Pension';
import {PensionReturnView} from '@/lib/financiero/pension/application/util/return/PensionReturnView';

import {onClickTableRowData} from '@/lib/financiero/pension/infrastructure/data/PensionData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let pension1:Pension = new Pension()


const emit = createEventDispatcher()
							

const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

const onClickTableRow = async (pension1: Pension) => {		
	
	const data_json:PensionReturnView = await onClickTableRowData(module,controller,pension1);

	emit('handleAction_ClickTableRowTableView',data_json.pension1);
		
};

</script>

<tr id={pension1.id}
	class=""
	on:click={$event => onClickTableRow(pension1)}>
	
	<td data-label="Id" style={ style_id_column }> { pension1.id } </td>
	<td data-label="Created At" style="display:none;"> { pension1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { pension1.updated_at } </td>
	<td data-label=" Alumno"> { pension1?.alumno?.nombre } </td>
	<td data-label="Anio" style="text-align:center;"> { pension1.anio } </td>
	<td data-label="Mes" style="text-align:center;"> { pension1.mes } </td>
	<td data-label="Valor" style="text-align:center;"> { pension1.valor } </td>
	<td data-label="Cobrado" style="text-align:center;"> { GetLabelBoolean(pension1.cobrado) } </td>

</tr>

<style lang="scss">

</style>
