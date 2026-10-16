<template>
	<public-shell>
		<div class="public-contracts">
			<header class="public-contracts__header">
				<div>
					<p class="public-contracts__eyebrow">Transparencia · contratación pública</p>
					<h1 class="public-contracts__title">Contratos</h1>
					<p class="public-contracts__description">Consulta los contratos públicos, explora sus montos y encuentra la información de cada contratación.</p>
				</div>
				<button
					class="btn btn__default btn--small btn__default--light public-contracts__download"
					type="button"
					disabled
					aria-describedby="contracts-download-note"
				>
					<span
						class="material-symbols-outlined"
						aria-hidden="true"
						>download</span
					>
					Descargar información
				</button>
				<p
					id="contracts-download-note"
					class="public-contracts__download-note"
				>
					Próximamente
				</p>
			</header>

			<section
				class="public-contracts__filters"
				aria-labelledby="contracts-filters-title"
			>
				<div class="public-contracts__section-heading">
					<span
						class="material-symbols-outlined"
						aria-hidden="true"
						>tune</span
					>
					<h2 id="contracts-filters-title">Filtrar contratos</h2>
				</div>
				<chart-filters-bar
					v-model="filters"
					:options="filterOptions"
					@apply="applyFilters"
				/>
				<form
					class="public-contracts__search"
					role="search"
					@submit.prevent="submitSearch"
				>
					<label
						class="public-contracts__sr-only"
						for="public-contract-search"
						>Buscar contratos</label
					>
					<div class="public-contracts__search-control">
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>search</span
						>
						<input
							id="public-contract-search"
							v-model="searchText"
							type="search"
							placeholder="Buscar contrato por nombre, unidad o descripción..."
							autocomplete="off"
						/>
					</div>
					<button
						class="btn btn__default btn--small btn__default--primary public-contracts__search-button"
						type="submit"
					>
						Buscar
					</button>
				</form>
			</section>

			<section
				class="public-contracts__summary"
				aria-labelledby="contracts-summary-title"
			>
				<div class="public-contracts__section-heading">
					<span
						class="material-symbols-outlined"
						aria-hidden="true"
						>payments</span
					>
					<h2 id="contracts-summary-title">Montos de la búsqueda</h2>
				</div>
				<p
					v-if="loading"
					class="public-contracts__status"
					role="status"
				>
					Consultando los montos de todos los resultados…
				</p>
				<div
					v-else-if="cards"
					class="public-contracts__cards"
				>
					<article
						v-for="card in cards"
						:key="card.key"
						class="public-contracts__card"
						:class="`public-contracts__card--${card.color}`"
					>
						<div class="public-contracts__card-icon">
							<span
								class="material-symbols-outlined"
								aria-hidden="true"
								>{{ card.icon }}</span
							>
						</div>
						<div>
							<h3>{{ card.label }}</h3>
							<p>{{ formatPublicContractAmount(card.amount) }}</p>
							<span>{{ card.description || 'Monto por tipo de procedimiento' }}</span>
						</div>
					</article>
				</div>
			</section>

			<section
				class="public-contracts__results"
				aria-labelledby="contracts-results-title"
			>
				<div class="public-contracts__results-heading">
					<div class="public-contracts__section-heading">
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>description</span
						>
						<h2 id="contracts-results-title">Resultados</h2>
					</div>
					<div
						v-if="!loading && !errorMessage"
						class="public-contracts__result-controls"
					>
						<p
							class="public-contracts__result-count"
							aria-live="polite"
							aria-atomic="true"
						>
							{{ formatCount(pagination.results) }} {{ pagination.results === 1 ? 'contrato encontrado' : 'contratos encontrados' }}
						</p>
						<div class="public-contracts__page-size">
							<label for="public-contract-page-size">Mostrar</label>
							<select
								id="public-contract-page-size"
								:value="pageSize"
								@change="changePageSize"
							>
								<option
									v-for="size in pageSizeOptions"
									:key="size"
									:value="size"
								>
									{{ size }}
								</option>
							</select>
							<span>por página</span>
						</div>
					</div>
				</div>

				<p
					v-if="loading"
					class="public-contracts__status"
					role="status"
					aria-live="polite"
				>
					Cargando contratos…
				</p>
				<div
					v-else-if="errorMessage"
					class="public-contracts__message public-contracts__message--error"
					role="alert"
				>
					<p>{{ errorMessage }}</p>
					<button
						class="btn btn__default btn--small btn__default--primary public-contracts__retry"
						type="button"
						@click="retryQuery"
					>
						Intentar de nuevo
					</button>
				</div>
				<p
					v-else-if="contracts.length === 0"
					class="public-contracts__message"
					role="status"
				>
					No se encontraron contratos con los criterios seleccionados.
				</p>
				<div
					v-else
					class="public-contracts__table-scroll"
					:aria-busy="loading"
				>
					<table class="public-contracts__table">
						<caption class="public-contracts__sr-only">
							Contratos públicos encontrados
						</caption>
						<thead>
							<tr>
								<th scope="col">Información</th>
								<th scope="col">ID del contrato</th>
								<th scope="col">Proveedor</th>
								<th scope="col">Unidad convocante</th>
								<th scope="col">Unidad solicitante</th>
								<th scope="col">Materia</th>
								<th scope="col">Procedimiento</th>
								<th scope="col">Periodo administrativo</th>
								<th scope="col">Descripción</th>
								<th scope="col">Fecha del contrato</th>
								<th scope="col">Tipo de contrato</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="contract in contracts"
								:key="contract.id"
							>
								<td>
									<router-link
										class="btn btn__outlined btn--small btn__outlined--primary public-contracts__more"
										:to="{ name: 'publicContractDetailView', params: { id: contract.id } }"
										:aria-label="`Ver más información del contrato ${contract.contract_id || contract.contract_number || contract.id}`"
									>
										Ver más
									</router-link>
								</td>
								<td>{{ contract.contract_id || contract.contract_number || contract.id }}</td>
								<td>{{ contract.provider_name || 'No especificado' }}</td>
								<td>{{ contract.organizer_admin_unit_name || 'No especificada' }}</td>
								<td>{{ contract.applicant_admin_unit_name || 'No especificada' }}</td>
								<td>{{ contract.subject_name || 'No especificada' }}</td>
								<td>
									<span
										class="public-contracts__procedure"
										:class="procedureClass(contract.procedure_name)"
										>{{ contract.procedure_name || 'No especificado' }}</span
									>
								</td>
								<td>{{ formatPeriod(contract) }}</td>
								<td class="public-contracts__description-cell">{{ formatDescription(contract.work_description) }}</td>
								<td>{{ formatDate(contract.contract_date) }}</td>
								<td>{{ contract.contract_type_name || 'No especificado' }}</td>
							</tr>
						</tbody>
					</table>
				</div>

				<nav
					v-if="!loading && !errorMessage && pagination.results > 0"
					class="public-contracts__pagination"
					aria-label="Paginación de contratos"
				>
					<button
						type="button"
						aria-label="Primera página"
						:disabled="pagination.currentPage <= 1"
						@click="goToPage(1)"
					>
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>first_page</span
						>
					</button>
					<button
						type="button"
						aria-label="Página anterior"
						:disabled="pagination.currentPage <= 1"
						@click="goToPage(pagination.currentPage - 1)"
					>
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>chevron_left</span
						>
					</button>
					<span aria-live="polite">Página {{ pagination.currentPage }} de {{ pagination.pages }}</span>
					<button
						type="button"
						aria-label="Página siguiente"
						:disabled="pagination.currentPage >= pagination.pages"
						@click="goToPage(pagination.currentPage + 1)"
					>
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>chevron_right</span
						>
					</button>
					<button
						type="button"
						aria-label="Última página"
						:disabled="pagination.currentPage >= pagination.pages"
						@click="goToPage(pagination.pages)"
					>
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>last_page</span
						>
					</button>
				</nav>
			</section>
		</div>
	</public-shell>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
	import { apiRequest } from '../../../api/requests.js';
	import { useAppStore } from '../../../store/index.js';
	import { fetchContractsForCharts, deriveAdminOptions, deriveFiscalYearOptions } from '../../../helpers/contracts_chart_data.js';
	import { buildPublicContractCards, fetchPublicContracts, formatPublicContractAmount, PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE, PUBLIC_CONTRACT_PAGE_SIZES, getPublicProcedureCategory, readPublicPagination } from '../../../helpers/public_contracts.js';
	import PublicShell from '../../partials/public_shell.vue';
	import chartFiltersBar from '../../partials/chart_filters_bar.vue';

	const store = useAppStore();
	const pageSizeOptions = PUBLIC_CONTRACT_PAGE_SIZES;
	const filters = ref({ administration: '', fiscalYear: '', periodId: '', procedureId: '', organizerAdminUnitId: '', providerId: '' });
	const appliedFilters = ref({ ...filters.value });
	const filterOptions = ref({ administrations: [], fiscalYears: [], periods: [], procedures: [], adminUnits: [], providers: [] });
	const contracts = ref([]);
	const cards = ref(null);
	const searchText = ref('');
	const pageSize = ref(PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE);
	const pagination = ref({ results: 0, pages: 1, currentPage: 1 });
	const loading = ref(false);
	const errorMessage = ref('');
	let activeRequest = 0;
	let searchTimer;

	function toOptions(response) {
		return (response?.data?.data || []).map(item => ({ value: item.id, label: item.name }));
	}

	function fetchCatalog(module) {
		return new apiRequest().Get({ module });
	}

	async function loadCatalogs() {
		const catalogRequests = [
			['periods', 'periodos-contratos'],
			['procedures', 'procedimientos'],
			['providers', 'proveedores'],
			['adminUnits', 'unidades-administrativas'],
		];
		const responses = await Promise.all(
			catalogRequests.map(([, module]) =>
				fetchCatalog(module).catch(error => {
					store.push_alert(error?.data || { code: 'API-ERROR' });
					return null;
				})
			)
		);
		responses.forEach((response, index) => {
			if (response) {
				filterOptions.value[catalogRequests[index][0]] = toOptions(response);
			}
		});
	}

	async function loadDerivedOptions() {
		try {
			const rows = await fetchContractsForCharts({});
			filterOptions.value.administrations = deriveAdminOptions(rows);
			filterOptions.value.fiscalYears = deriveFiscalYearOptions(rows);
		} catch (error) {
			store.push_alert(error?.data || { code: 'API-ERROR' });
		}
	}

	function applyFilters(selectedFilters) {
		appliedFilters.value = { ...selectedFilters };
		clearTimeout(searchTimer);
		loadContracts(1);
	}

	function submitSearch() {
		clearTimeout(searchTimer);
		loadContracts(1);
	}

	async function loadContracts(requestedPage = 1) {
		const requestId = ++activeRequest;
		const queryPage = Math.max(1, Number(requestedPage) || 1);
		const querySearch = searchText.value.trim();
		const queryFilters = { ...appliedFilters.value };
		loading.value = true;
		errorMessage.value = '';
		contracts.value = [];
		cards.value = null;
		pagination.value = { results: 0, pages: 1, currentPage: queryPage };

		try {
			const response = await fetchPublicContracts({ page: queryPage, limit: pageSize.value, filters: queryFilters, search: querySearch });
			if (requestId !== activeRequest) {
				return;
			}
			const data = response?.data || {};
			contracts.value = Array.isArray(data.data) ? data.data : [];
			cards.value = buildPublicContractCards(data.totals || {});
			pagination.value = readPublicPagination(data, queryPage, pageSize.value);
		} catch (error) {
			if (requestId !== activeRequest) {
				return;
			}
			errorMessage.value = 'No fue posible cargar los contratos. Intenta de nuevo.';
			store.push_alert(error?.data || { code: 'API-ERROR' });
		} finally {
			if (requestId === activeRequest) {
				loading.value = false;
			}
		}
	}

	function retryQuery() {
		loadContracts(pagination.value.currentPage);
	}

	function goToPage(page) {
		if (page >= 1 && page <= pagination.value.pages && page !== pagination.value.currentPage) {
			loadContracts(page);
		}
	}

	function changePageSize(event) {
		const nextSize = Number(event.target.value);
		if (PUBLIC_CONTRACT_PAGE_SIZES.includes(nextSize)) {
			pageSize.value = nextSize;
			loadContracts(1);
		}
	}

	function procedureClass(procedureName) {
		const category = getPublicProcedureCategory(procedureName);
		return category ? `public-contracts__procedure--${category.color}` : 'public-contracts__procedure--neutral';
	}

	function formatPeriod(contract) {
		const start = contract.admin_period_start || '';
		const end = contract.admin_period_end || '';
		return start && end ? `${start} – ${end}` : start || end || 'No especificado';
	}

	function formatDescription(value) {
		if (!value) {
			return 'No especificada';
		}
		return value.length > 100 ? `${value.substring(0, 100)}…` : value;
	}

	function formatDate(value) {
		if (!value) {
			return 'No especificada';
		}
		const date = new Date(`${value}T00:00:00`);
		return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date);
	}

	function formatCount(value) {
		return new Intl.NumberFormat('es-MX').format(Number(value) || 0);
	}

	watch(searchText, () => {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => loadContracts(1), 350);
	});

	onMounted(() => {
		loadCatalogs();
		loadDerivedOptions();
		loadContracts(1);
	});

	onBeforeUnmount(() => {
		clearTimeout(searchTimer);
		activeRequest++;
	});
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_public_contracts.sass"
</style>
