<template>
	<div class="section__filters">
		<label
			class="form__label"
			:for="id"
			>{{ label }}</label
		>
		<select
			:id="id"
			class="form__select"
			v-model="selected"
		>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>
	</div>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		id: { type: String, required: true },
		label: { type: String, default: 'Ordenar por' },
		modelValue: { type: String, default: '' },
		options: { type: Array, default: () => [] },
	});

	const emit = defineEmits(['update:modelValue']);

	const selected = computed({
		get: () => props.modelValue,
		set: value => emit('update:modelValue', value),
	});
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_section.sass"
	@use "../../assets/sass/objects/_forms.sass"

	.form__select
		width: max-content
		max-width: 100%
</style>
