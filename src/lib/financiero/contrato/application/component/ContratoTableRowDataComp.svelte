<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Contrato} from '@/lib/financiero/contrato/domain/entity/Contrato';
import {ContratoReturnView} from '@/lib/financiero/contrato/application/util/return/ContratoReturnView';

import {onClickTableRowData} from '@/lib/financiero/contrato/infrastructure/data/ContratoData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let contrato1:Contrato = new Contrato()


const emit = createEventDispatcher()
							

const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

const onClickTableRow = async (contrato1: Contrato) => {		
	
	const data_json:ContratoReturnView = await onClickTableRowData(module,controller,contrato1);

	emit('handleAction_ClickTableRowTableView',data_json.contrato1);
		
};

</script>

<tr id={contrato1.id}
	class=""
	on:click={$event => onClickTableRow(contrato1)}>
	
	<td data-label="" style={ style_id_column }> { contrato1?.docente?.nombre } </td>
	<td data-label="Created At" style="display:none;"> { contrato1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { contrato1.updated_at } </td>
	<td data-label="Anio" style="text-align:center;"> { contrato1.anio } </td>
	<td data-label="Valor" style="text-align:center;"> { contrato1.valor } </td>
	<td data-label="Fecha"> { contrato1.fecha } </td>
	<td data-label="Firmado" style="text-align:center;"> { GetLabelBoolean(contrato1.firmado) } </td>

</tr>

<style lang="scss">

</style>
