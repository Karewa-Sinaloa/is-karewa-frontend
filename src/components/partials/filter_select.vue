<template>
	<div class="filter-select">
		<label
			class="form__label filter-select__label"
			:for="id"
		>
			{{ label }}
		</label>
		<vue-multiselect
			:id="id"
			:name="label"
			v-model="selectedOption"
			:options="options"
			label="label"
			track-by="value"
			:allow-empty="true"
			:placeholder="placeholder"
			:show-labels="false"
		>
			<template #noResult>
				<span class="filter-select__no-result">No se encontraron elementos</span>
			</template>
			<template #noOptions>
				<span class="filter-select__no-result">No hay elementos disponibles</span>
			</template>
		</vue-multiselect>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import VueMultiselect from 'vue-multiselect';
	import 'vue-multiselect/dist/vue-multiselect.min.css';

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		options: {
			type: Array,
			default: () => [],
		},
		placeholder: {
			type: String,
			default: 'Seleccione una opción',
		},
	});

	const emit = defineEmits(['update:modelValue']);

	// Traduce entre el string/number del modelo de filtros y el objeto opción que usa el multiselect internamente.
	// Coincide por value comparado como string para absorber ids numéricos de los catálogos.
	const selectedOption = computed({
		get: () => props.options.find((option) => String(option.value) === String(props.modelValue)) ?? null,
		// Emitted: el contrato de la barra espera el value del option o '' al limpiar (allow-empty → null).
		set: (option) => emit('update:modelValue', option ? option.value : ''),
	});
</script>

<!-- Estilos sin scoped: el multiselect renderiza su DOM interno propio y el CSS importado vive fuera del scoped; la encapsulación es por la clase .filter-select. -->
<style lang="sass">
	@use "../../assets/sass/components/_filter_select.sass"
</style>
