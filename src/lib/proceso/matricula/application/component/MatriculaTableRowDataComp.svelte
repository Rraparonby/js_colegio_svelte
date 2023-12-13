<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Matricula} from '@/lib/proceso/matricula/domain/entity/Matricula';
import {MatriculaReturnView} from '@/lib/proceso/matricula/application/util/return/MatriculaReturnView';

import {onClickTableRowData} from '@/lib/proceso/matricula/infrastructure/data/MatriculaData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let matricula1:Matricula = new Matricula()


const emit = createEventDispatcher()
							

const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

const onClickTableRow = async (matricula1: Matricula) => {		
	
	const data_json:MatriculaReturnView = await onClickTableRowData(module,controller,matricula1);

	emit('handleAction_ClickTableRowTableView',data_json.matricula1);
		
};

</script>

<tr id={matricula1.id}
	class=""
	on:click={$event => onClickTableRow(matricula1)}>
	
	<td data-label="" style={ style_id_column }> { matricula1?.alumno?.nombre } </td>
	<td data-label="Created At" style="display:none;"> { matricula1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { matricula1.updated_at } </td>
	<td data-label="Anio" style="text-align:center;"> { matricula1.anio } </td>
	<td data-label="Costo" style="text-align:center;"> { matricula1.costo } </td>
	<td data-label="Fecha"> { matricula1.fecha } </td>
	<td data-label="Pagado" style="text-align:center;"> { GetLabelBoolean(matricula1.pagado) } </td>

</tr>

<style lang="scss">

</style>
