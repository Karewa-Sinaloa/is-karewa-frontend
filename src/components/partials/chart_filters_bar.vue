<template>
	<form
		class="chart-filters"
		@submit.prevent="applyFilters"
	>
		<filter-select
			id="chart-filter-administration"
			label="Administración"
			placeholder="Todas"
			:model-value="modelValue.administration"
			:options="options.administrations"
			@update:model-value="setFilter('administration', $event)"
		/>
		<filter-select
			id="chart-filter-fiscal-year"
			label="Año fiscal"
			placeholder="Todos"
			:model-value="modelValue.fiscalYear"
			:options="options.fiscalYears"
			@update:model-value="setFilter('fiscalYear', $event)"
		/>
		<filter-select
			id="chart-filter-period"
			label="Periodo"
			placeholder="Todos"
			:model-value="modelValue.periodId"
			:options="options.periods"
			@update:model-value="setFilter('periodId', $event)"
		/>
		<filter-select
			id="chart-filter-procedure"
			label="Tipo de procedimiento"
			placeholder="Todos"
			:model-value="modelValue.procedureId"
			:options="options.procedures"
			@update:model-value="setFilter('procedureId', $event)"
		/>
		<filter-select
			id="chart-filter-admin-unit"
			label="Unidad administrativa"
			placeholder="Todas"
			:model-value="modelValue.organizerAdminUnitId"
			:options="options.adminUnits"
			@update:model-value="setFilter('organizerAdminUnitId', $event)"
		/>
		<filter-select
			id="chart-filter-provider"
			label="Proveedor"
			placeholder="Todos"
			:model-value="modelValue.providerId"
			:options="options.providers"
			@update:model-value="setFilter('providerId', $event)"
		/>
		<div class="chart-filters__actions">
			<button
				class="form__btn btn btn__default btn--regular btn__default--primary"
				type="submit"
			>
				Aplicar filtros
			</button>
		</div>
	</form>
</template>

<script setup>
	import filterSelect from './filter_select.vue';

	const props = defineProps({
		modelValue: {
			type: Object,
			default: () => ({
				administration: '',
				fiscalYear: '',
				periodId: '',
				procedureId: '',
				organizerAdminUnitId: '',
				providerId: '',
			}),
		},
		options: {
			type: Object,
			default: () => ({
				administrations: [],
				fiscalYears: [],
				periods: [],
				procedures: [],
				adminUnits: [],
				providers: [],
			}),
		},
	});

	const emit = defineEmits(['update:modelValue', 'apply']);

	// Cambiar un selector solo emite el nuevo estado local: ninguna consulta se dispara aquí.
	function setFilter(key, value) {
		emit('update:modelValue', { ...props.modelValue, [key]: value });
	}

	// El botón es la única vía de consulta: emite el objeto completo de filtros vigentes.
	function applyFilters() {
		emit('apply', { ...props.modelValue });
	}
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_home_charts.sass"
	@use "../../assets/sass/objects/_buttons.sass"
</style>
