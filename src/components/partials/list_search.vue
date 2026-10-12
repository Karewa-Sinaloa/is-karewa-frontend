<template>
	<div class="section__filters">
		<label
			class="form__label"
			:for="id"
			>{{ label }}</label
		>
		<input
			:id="id"
			class="form__input"
			type="search"
			:placeholder="placeholder"
			autocomplete="off"
			v-model="text"
		/>
	</div>
</template>

<script setup>
	import { onUnmounted, ref, watch } from 'vue';

	const props = defineProps({
		id: { type: String, required: true },
		label: { type: String, default: 'Buscar' },
		placeholder: { type: String, default: 'Buscar por cualquier campo' },
		modelValue: { type: String, default: '' },
		delay: { type: Number, default: 300 },
	});

	const emit = defineEmits(['update:modelValue']);
	const text = ref(props.modelValue);
	let searchTimeout = null;

	watch(text, value => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => emit('update:modelValue', value), props.delay);
	});

	watch(
		() => props.modelValue,
		value => {
			if (value !== text.value) {
				text.value = value;
			}
		}
	);

	onUnmounted(() => clearTimeout(searchTimeout));
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_section.sass"
	@use "../../assets/sass/objects/_forms.sass"

	.section__filters
		width: 100%
		max-width: 25rem
</style>
