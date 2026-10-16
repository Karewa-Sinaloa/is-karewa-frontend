<template>
	<public-shell>
		<article class="public-contract-detail">
			<nav
				class="public-contract-detail__breadcrumb"
				aria-label="Ruta de navegación"
			>
				<router-link :to="{ name: 'publicContractsView' }">Contratos</router-link>
				<span aria-hidden="true">/</span>
				<span aria-current="page">Información del contrato</span>
			</nav>

			<p
				v-if="loading"
				class="public-contract-detail__message"
				role="status"
			>
				Cargando información del contrato…
			</p>
			<div
				v-else-if="errorMessage"
				class="public-contract-detail__message public-contract-detail__message--error"
				role="alert"
			>
				<p>{{ errorMessage }}</p>
				<button
					class="public-contract-detail__button"
					type="button"
					@click="loadContract"
				>
					Intentar de nuevo
				</button>
			</div>
			<div
				v-else-if="!contract"
				class="public-contract-detail__message"
				role="status"
			>
				<p>No se encontró el contrato solicitado.</p>
				<router-link
					class="public-contract-detail__button"
					:to="{ name: 'publicContractsView' }"
					>Volver al listado</router-link
				>
			</div>
			<template v-else>
				<header class="public-contract-detail__header">
					<div>
						<p class="public-contract-detail__eyebrow">Contratación pública</p>
						<h1>{{ contract.work_description || 'Información del contrato' }}</h1>
						<p class="public-contract-detail__number">{{ contract.contract_id || contract.contract_number || contract.id }}</p>
						<p class="public-contract-detail__summary">
							Monto total con IVA:
							<strong>{{ contract.total_amount !== null && contract.total_amount !== undefined ? formatPublicContractAmount(contract.total_amount) : '—' }}</strong>
						</p>
					</div>
					<router-link
						class="btn btn__default btn--small btn__default--primary public-contract-detail__back"
						:to="{ name: 'publicContractsView' }"
					>
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>arrow_back</span
						>
						Volver al listado
					</router-link>
				</header>

				<section
					class="public-contract-detail__content"
					aria-labelledby="public-contract-details-title"
				>
					<div class="public-contract-detail__section-title">
						<span
							class="material-symbols-outlined"
							aria-hidden="true"
							>description</span
						>
						<h2 id="public-contract-details-title">Datos del contrato</h2>
					</div>
					<dl class="public-contract-detail__grid">
						<div
							v-for="field in details"
							:key="field.label"
							class="public-contract-detail__field"
						>
							<dt>{{ field.label }}</dt>
							<dd>
								<template v-if="field.isNote">
									<span
										:id="`contract-note-${field.key}`"
										class="public-contract-detail__note-text"
									>{{ field.displayValue }}</span>
									<button
										v-if="field.canExpand"
										class="public-contract-detail__expand"
										type="button"
										:aria-expanded="field.isExpanded"
										:aria-controls="`contract-note-${field.key}`"
										@click="toggleNote(field.key)"
									>
										{{ field.isExpanded ? 'Contraer' : 'Expandir' }}
									</button>
								</template>
								<span
									v-else-if="field.amountStatusClass"
									class="public-contract-detail__amount-status"
									:class="`public-contract-detail__amount-status--${field.amountStatusClass}`"
								>{{ field.displayValue }}</span>
								<a
									v-else-if="field.href"
									:href="field.href"
									target="_blank"
									rel="noopener noreferrer"
								>
									{{ field.displayValue }}<span class="public-contract-detail__sr-only"> (abre en una pestaña nueva)</span>
								</a>
								<span v-else>{{ field.displayValue }}</span>
							</dd>
						</div>
					</dl>
				</section>

			</template>
		</article>
	</public-shell>
</template>

<script setup>
	import { computed, onMounted, ref, watch } from 'vue';
	import { useRoute } from 'vue-router';
	import { useAppStore } from '../../../store/index.js';
	import { fetchPublicContractById, formatPublicContractAmount } from '../../../helpers/public_contracts.js';
	import PublicShell from '../../partials/public_shell.vue';

	const route = useRoute();
	const store = useAppStore();
	const contract = ref(null);
	const loading = ref(false);
	const errorMessage = ref('');
	const expandedNotes = ref(new Set());
	const NOTE_CHARACTER_LIMIT = 280;
	let activeRequest = 0;

	const fieldLabels = {
		admin_period_start: 'Inicio del periodo administrativo',
		admin_period_end: 'Fin del periodo administrativo',
		fiscal_year: 'Año fiscal',
		contract_id: 'ID del contrato',
		call_link: 'Enlace de la convocatoria',
		call_date: 'Fecha de la convocatoria',
		work_description: 'Descripción del trabajo',
		clarification_meeting_date: 'Fecha de junta de aclaraciones',
		proposals_url: 'URL de propuestas',
		proposal_url: 'URL de propuesta',
		contract_number: 'Número de contrato',
		contract_date: 'Fecha del contrato',
		total_amount: 'Monto total',
		min_amount: 'Monto mínimo',
		max_amount: 'Monto máximo',
		subtotal: 'Subtotal',
		contract_link: 'Enlace del contrato',
		area_in_charge: 'Área responsable',
		contract_updated_at: 'Fecha de actualización del contrato',
		notes: 'Notas',
		organization_notes: 'Notas de la organización',
		information_date: 'Fecha de información',
		amount_was_exceeded: '¿Se excedió el monto?',
		exceeded_amount: 'Monto excedido',
		contract_backup: 'Respaldo del contrato',
		announcement_backup: 'Respaldo de la convocatoria',
		created_at: 'Fecha de creación',
		updated_at: 'Fecha de actualización',
		provider_name: 'Proveedor',
		organizer_admin_unit_name: 'Unidad convocante',
		applicant_admin_unit_name: 'Unidad solicitante',
		admin_unit_type_name: 'Tipo de unidad administrativa',
		contract_type_name: 'Tipo de contrato',
		period_name: 'Periodo',
		procedure_name: 'Tipo de procedimiento',
		subject_name: 'Materia',
		partida_type_name: 'Tipo de partida',
		status_name: 'Estatus',
	};
	const hiddenFields = new Set(['id', 'procedure_id', 'subject_id', 'partida_type', 'period_id', 'status_id', 'partida_id', 'provider_id', 'organizer_admin_unit_id', 'admin_unit_type_id', 'applicant_admin_unit_id', 'contract_type_id']);
	const amountFields = new Set(['total_amount', 'min_amount', 'max_amount', 'subtotal', 'exceeded_amount']);
	const dateFields = new Set(['admin_period_start', 'admin_period_end', 'call_date', 'clarification_meeting_date', 'contract_date', 'contract_updated_at', 'information_date', 'created_at', 'updated_at']);
	const urlFields = new Set(['call_link', 'proposals_url', 'proposal_url', 'contract_link', 'contract_backup', 'announcement_backup']);
	const noteFields = new Set(['notes', 'organization_notes']);

	const details = computed(() => {
		if (!contract.value) {
			return [];
		}
		return Object.entries(contract.value)
			.filter(([key]) => !hiddenFields.has(key))
			.map(([key, rawValue]) => {
				let value = rawValue;
				let amountStatusClass = '';
				if (rawValue === null || rawValue === undefined || rawValue === '') {
					value = '—';
				} else if (key === 'amount_was_exceeded' && [0, '0', false].includes(rawValue)) {
					value = 'Sin exceder';
					amountStatusClass = 'success';
				} else if (key === 'amount_was_exceeded' && [1, '1', true].includes(rawValue)) {
					value = 'Excedido';
					amountStatusClass = 'danger';
				} else if (amountFields.has(key)) {
					value = formatPublicContractAmount(rawValue);
				} else if (dateFields.has(key)) {
					value = formatDate(rawValue);
				} else if (typeof rawValue === 'boolean') {
					value = rawValue ? 'Sí' : 'No';
				} else if (typeof rawValue === 'object') {
					value = JSON.stringify(rawValue);
				}
				const isNote = noteFields.has(key);
				const isExpanded = expandedNotes.value.has(key);
				const canExpand = isNote && String(value).length > NOTE_CHARACTER_LIMIT;
				const displayValue = canExpand && !isExpanded ? `${String(value).slice(0, NOTE_CHARACTER_LIMIT).trimEnd()}…` : value;
				return {
					key,
					label: fieldLabels[key] || key.replaceAll('_', ' ').replace(/^./, character => character.toUpperCase()),
					value,
					displayValue,
					isNote,
					canExpand,
					isExpanded,
					amountStatusClass,
					href: urlFields.has(key) && rawValue !== null && rawValue !== undefined && rawValue !== '' ? safeUrl(rawValue) : '',
				};
			});
	});

	function toggleNote(key) {
		const next = new Set(expandedNotes.value);
		if (next.has(key)) {
			next.delete(key);
		} else {
			next.add(key);
		}
		expandedNotes.value = next;
	}

	function safeUrl(value) {
		if (!value) {
			return '';
		}
		try {
			const url = new URL(value, window.location.origin);
			return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
		} catch {
			return '';
		}
	}

	function formatDate(value) {
		if (!value) {
			return value;
		}
		const dateValue = String(value);
		const hasTime = /(?:T|\s)\d{2}:\d{2}/.test(dateValue);
		const normalizedDate = dateValue.includes(' ') && !dateValue.includes('T') ? dateValue.replace(' ', 'T') : dateValue;
		const date = new Date(hasTime ? normalizedDate : `${dateValue}T00:00:00`);
		if (Number.isNaN(date.getTime())) {
			return value;
		}
		return new Intl.DateTimeFormat('es-MX', hasTime ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' }).format(date);
	}

	async function loadContract() {
		const requestId = ++activeRequest;
		contract.value = null;
		expandedNotes.value = new Set();
		loading.value = true;
		errorMessage.value = '';
		try {
			const response = await fetchPublicContractById(route.params.id);
			if (requestId !== activeRequest) {
				return;
			}
			const data = response?.data?.data;
			contract.value = Array.isArray(data) ? data[0] || null : data || null;
		} catch (error) {
			if (requestId !== activeRequest) {
				return;
			}
			if (error?.status === 404 || error?.data?.http_code === 404) {
				return;
			}
			errorMessage.value = 'No fue posible cargar la información del contrato.';
			store.push_alert(error?.data || { code: 'API-ERROR' });
		} finally {
			if (requestId === activeRequest) {
				loading.value = false;
			}
		}
	}

	watch(() => route.params.id, loadContract);
	onMounted(loadContract);
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_public_contracts.sass"
</style>
