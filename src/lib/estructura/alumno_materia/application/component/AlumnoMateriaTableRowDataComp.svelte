<script lang="ts" setup>

import {onMount,createEventDispatcher} from 'svelte'

import {Constantes} from '@/lib/base/util/Constantes';
import {FuncionGeneral} from '@/lib/base/util/FuncionGeneral';

import {AlumnoMateria} from '@/lib/estructura/alumno_materia/domain/entity/AlumnoMateria';
import {AlumnoMateriaReturnView} from '@/lib/estructura/alumno_materia/application/util/return/AlumnoMateriaReturnView';

import {onClickTableRowData} from '@/lib/estructura/alumno_materia/infrastructure/data/AlumnoMateriaData';



//------------------ PARAMETROS -------------------
export let module:string = ''
export let controller:string = ''
export let style_id_column:string = ''
export let alumno_materia1:AlumnoMateria = new AlumnoMateria()


const emit = createEventDispatcher()
							


const onClickTableRow = async (alumno_materia1: AlumnoMateria) => {		
	
	const data_json:AlumnoMateriaReturnView = await onClickTableRowData(module,controller,alumno_materia1);

	emit('handleAction_ClickTableRowTableView',data_json.alumno_materia1);
		
};

</script>

<tr id={alumno_materia1.id}
	class=""
	on:click={$event => onClickTableRow(alumno_materia1)}>
	
	<td data-label="Id" style={ style_id_column }> { alumno_materia1.id } </td>
	<td data-label="Created At" style="display:none;"> { alumno_materia1.created_at } </td>
	<td data-label="Updated At" style="display:none;"> { alumno_materia1.updated_at } </td>
	<td data-label=" Alumno"> { alumno_materia1?.alumno?.nombre } </td>
	<td data-label=" Materia"> { alumno_materia1?.materia?.codigo } </td>

</tr>

<style lang="scss">

</style>
