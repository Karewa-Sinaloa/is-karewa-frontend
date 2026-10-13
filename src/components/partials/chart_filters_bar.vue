<template>
	<form
		class="chart-filters"
		@submit.prevent="applyFilters"
	>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-administration"
			>
				Administración
			</label>
			<select
				id="chart-filter-administration"
				class="form__select"
				:model-value="modelValue.administration"
				@update:model-value="setFilter('administration', $event)"
			>
				<option value="">Todas</option>
				<option
					v-for="option in options.administrations"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-fiscal-year"
			>
				Año fiscal
			</label>
			<select
				id="chart-filter-fiscal-year"
				class="form__select"
				:model-value="modelValue.fiscalYear"
				@update:model-value="setFilter('fiscalYear', $event)"
			>
				<option value="">Todos</option>
				<option
					v-for="option in options.fiscalYears"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-period"
			>
				Periodo
			</label>
			<select
				id="chart-filter-period"
				class="form__select"
				:model-value="modelValue.periodId"
				@update:model-value="setFilter('periodId', $event)"
			>
				<option value="">Todos</option>
				<option
					v-for="option in options.periods"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-procedure"
			>
				Tipo de procedimiento
			</label>
			<select
				id="chart-filter-procedure"
				class="form__select"
				:model-value="modelValue.procedureId"
				@update:model-value="setFilter('procedureId', $event)"
			>
				<option value="">Todos</option>
				<option
					v-for="option in options.procedures"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-admin-unit"
			>
				Unidad administrativa
			</label>
			<select
				id="chart-filter-admin-unit"
				class="form__select"
				:model-value="modelValue.organizerAdminUnitId"
				@update:model-value="setFilter('organizerAdminUnitId', $event)"
			>
				<option value="">Todas</option>
				<option
					v-for="option in options.adminUnits"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
		<div class="chart-filters__field">
			<label
				class="form__label"
				for="chart-filter-provider"
			>
				Proveedor
			</label>
			<select
				id="chart-filter-provider"
				class="form__select"
				:model-value="modelValue.providerId"
				@update:model-value="setFilter('providerId', $event)"
			>
				<option value="">Todos</option>
				<option
					v-for="option in options.providers"
					:key="option.value"
					:value="option.value"
				>
					{{ option.label }}
				</option>
			</select>
		</div>
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
	@use "../../assets/sass/objects/_forms.sass"
	@use "../../assets/sass/objects/_buttons.sass"
</style>
