<template>
	<public-shell>
		<section class="home-hero">
			<picture class="home-hero__media">
				<source
					media="(min-width:1024px)"
					srcset="../../../assets/images/hero_home.webp"
				/>
				<img
					src="../../../assets/images/hero_home_mobile.webp"
					alt=""
				/>
			</picture>
			<div class="home-hero__overlay"></div>
			<div class="home-hero__content">
				<h1 class="home-hero__title">Somos Monitor Karewa</h1>
				<p class="home-hero__text">
					Monitor Karewa es una plataforma digital e independiente de vigilancia ciudadana que mide y hace pública la información sobre el gasto y las contrataciones públicas de los gobiernos (como compras, rentas, servicios y obras públicas).
				</p>
			</div>
		</section>
		<section
			class="home-intro"
			aria-labelledby="home-intro-title"
		>
			<span
				class="home-intro__accent"
				aria-hidden="true"
			></span>
			<h2
				id="home-intro-title"
				class="home-intro__title"
			>
				Vista general
			</h2>
			<p class="home-intro__text">
				Explora los montos globales de las contrataciones públicas, organizados por año y por periodo. Utiliza los filtros disponibles para acotar la consulta por administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa o
				proveedor y obtener así la información que te interesa.
			</p>
		</section>
		<section
			class="home-charts"
			aria-label="Gráficas de contratos"
		>
			<chart-filters-bar
				v-model="filters"
				:options="filterOptions"
				@apply="applyFilters"
			/>
			<div class="home-charts__columns">
				<div class="chart-panel chart-panel--wide">
					<contracts-period-bar-chart
						v-if="hasRows"
						:data="yearTotals"
					/>
					<p
						v-else-if="showEmpty"
						class="results__no-results chart-panel__empty"
					>
						No se encontraron contratos.
					</p>
				</div>
				<div class="chart-panel chart-panel--narrow">
					<procedures-pie-chart
						v-if="hasRows"
						:data="procedureTotals"
					/>
					<p
						v-else-if="showEmpty"
						class="results__no-results chart-panel__empty"
					>
						No se encontraron contratos.
					</p>
				</div>
			</div>
		</section>
	</public-shell>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useAppStore } from '../../../store/index.js';
	import { apiRequest } from '../../../api/requests.js';
	import PublicShell from '../../partials/public_shell.vue';
	import chartFiltersBar from '../../partials/chart_filters_bar.vue';
	import contractsPeriodBarChart from '../../partials/contracts_period_bar_chart.vue';
	import proceduresPieChart from '../../partials/procedures_pie_chart.vue';
	import { fetchContractsForCharts, aggregateByYearQuarter, aggregateByProcedure, deriveAdminOptions, deriveFiscalYearOptions } from '../../../helpers/contracts_chart_data.js';

	const store = useAppStore();

	// Estado local de los selectores: cambiar un valor solo actualiza este objeto, nunca consulta.
	const filters = ref({
		administration: '',
		fiscalYear: '',
		periodId: '',
		procedureId: '',
		organizerAdminUnitId: '',
		providerId: '',
	});

	const filterOptions = ref({
		administrations: [],
		fiscalYears: [],
		periods: [],
		procedures: [],
		adminUnits: [],
		providers: [],
	});

	// Totales por año y trimestre para la gráfica de barras (sin catálogo previo).
	const yearTotals = ref([]);
	const procedureTotals = ref([]);
	const hasRows = ref(false);
	const showEmpty = ref(false);

	function toCatalogItems(response) {
		return response.data.data || [];
	}

	function toOptions(response) {
		return toCatalogItems(response).map(item => ({ value: item.id, label: item.name }));
	}

	function fetchCatalog(module) {
		return new apiRequest().Get({ module }).catch(error => {
			store.push_alert(error.data);
			return null;
		});
	}

	// Catálogos de los selectores: se cargan una sola vez al montar (D3).
	async function loadCatalogs() {
		const [periodsResponse, proceduresResponse, providersResponse, adminUnitsResponse] = await Promise.all([fetchCatalog('periodos-contratos'), fetchCatalog('procedimientos'), fetchCatalog('proveedores'), fetchCatalog('unidades-administrativas')]);
		if (periodsResponse) {
			filterOptions.value.periods = toOptions(periodsResponse);
		}
		if (proceduresResponse) {
			filterOptions.value.procedures = toOptions(proceduresResponse);
		}
		if (providersResponse) {
			filterOptions.value.providers = toOptions(providersResponse);
		}
		if (adminUnitsResponse) {
			filterOptions.value.adminUnits = toOptions(adminUnitsResponse);
		}
	}

	function updateCharts(rows) {
		// El eje de la gráfica de barras se completa con el catálogo congelado de años fiscales: todos los años conocidos aparecen (máx. 6) aunque los filtros los dejen sin contratos.
		const knownYears = filterOptions.value.fiscalYears.map(option => option.value);
		yearTotals.value = aggregateByYearQuarter(rows, knownYears);
		procedureTotals.value = aggregateByProcedure(rows);
		hasRows.value = rows.length > 0;
		showEmpty.value = rows.length === 0;
	}

	// Fallo de la consulta: alerta del código devuelto y sección sin datos hasta el siguiente intento.
	function clearCharts(error) {
		yearTotals.value = [];
		procedureTotals.value = [];
		hasRows.value = false;
		showEmpty.value = false;
		store.push_alert(error.data);
	}

	// Primer juego de datos sin filtros: puebla ambas gráficas y congela las opciones de administración/año fiscal (D3).
	async function loadInitialData() {
		try {
			const rows = await fetchContractsForCharts({});
			filterOptions.value.administrations = deriveAdminOptions(rows);
			filterOptions.value.fiscalYears = deriveFiscalYearOptions(rows);
			updateCharts(rows);
		} catch (error) {
			clearCharts(error);
		}
	}

	// Única ruta de consulta: el botón de aplicar filtros de la barra (D2).
	async function applyFilters(selectedFilters) {
		try {
			const rows = await fetchContractsForCharts(selectedFilters);
			updateCharts(rows);
		} catch (error) {
			clearCharts(error);
		}
	}

	onMounted(async () => {
		await loadCatalogs();
		await loadInitialData();
	});
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_home_hero.sass"
	@use "../../../assets/sass/components/_home_intro.sass"
	@use "../../../assets/sass/components/_home_charts.sass"
	@use "../../../assets/sass/components/_results.sass"
</style>
