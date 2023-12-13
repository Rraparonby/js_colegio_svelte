<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {Materia} from '@/lib/estructura/materia/domain/entity/Materia';
import {MateriaReturnView} from '@/lib/estructura/materia/application/util/return/MateriaReturnView';

import {onClickTableRowData} from '@/lib/estructura/materia/infrastructure/data/MateriaData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let materia1:Materia = new Materia()


const emit = createEventDispatcher()
							

const GetLabelBoolean = (value:string|boolean) => {
	return FuncionGeneral.GetLabelBoolean(value);
};

const onClickTableRow = async (materia1: Materia) => {		
	
	const data_json:MateriaReturnView = await onClickTableRowData(module,controller,materia1);

	emit('handleAction_ClickTableRowTableView',data_json.materia1);
		
};

</script>

<tr id={materia1.id}
	class=""
	on:click={$event => onClickTableRow(materia1)}>
	
	<td data-label="Id" style={ style_id_column }> { materia1.id } </td>
	<td data-label="Created At" style="display:none;"> { materia1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { materia1.updated_at } </td>
	<td data-label="Codigo"> { materia1.codigo } </td>
	<td data-label="Nombre"> { materia1.nombre } </td>
	<td data-label="Activo" style="text-align:center;"> { GetLabelBoolean(materia1.activo) } </td>

</tr>

<style lang="scss">

</style>
