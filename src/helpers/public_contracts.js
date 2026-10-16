import { apiRequest } from '../api/requests.js';

export const PUBLIC_CONTRACT_PAGE_SIZES = [12, 24, 48, 96];
export const PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE = 12;

const publicContractCurrencyFormatter = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'MXN',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export function formatPublicContractAmount(value) {
	return `${publicContractCurrencyFormatter.format(Number(value) || 0)} MXN`;
}

const LIST_FIELDS = [
	'id',
	'contract_id',
	'contract_number',
	'provider_name',
	'organizer_admin_unit_name',
	'applicant_admin_unit_name',
	'subject_name',
	'procedure_id',
	'procedure_name',
	'admin_period_start',
	'admin_period_end',
	'work_description',
	'contract_date',
	'contract_type_name',
];

const FILTER_PARAMS = {
	fiscalYear: 'fiscal_year',
	periodId: 'period_id',
	procedureId: 'procedure_id',
	organizerAdminUnitId: 'organizer_admin_unit_id',
	providerId: 'provider_id',
};

function appendFilter(parts, field, value) {
	if (value === undefined || value === null || value === '') {
		return;
	}
	parts.push(`${field}=eq:${encodeURIComponent(value)}`);
}

export function buildPublicContractsQuery({ page = 1, limit = PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE, filters = {}, search = '' } = {}) {
	const safePage = Math.max(1, Number(page) || 1);
	const safeLimit = PUBLIC_CONTRACT_PAGE_SIZES.includes(Number(limit)) ? Number(limit) : PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE;
	const parts = [`page=${safePage}`, `limit=${safeLimit}`, 'embed=pagination,totals', `fields=${LIST_FIELDS.join(',')}`];

	if (filters.administration) {
		const range = String(filters.administration);
		const isoDateRange = range.match(/^(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/);
		const [start, end] = isoDateRange ? [isoDateRange[1], isoDateRange[2]] : range.split('-', 2);
		appendFilter(parts, 'admin_period_start', start);
		appendFilter(parts, 'admin_period_end', end);
	}
	Object.entries(FILTER_PARAMS).forEach(([filterName, apiName]) => appendFilter(parts, apiName, filters[filterName]));

	const normalizedSearch = String(search || '').trim();
	if (normalizedSearch) {
		parts.push(`search=${encodeURIComponent(normalizedSearch)}`);
	}

	return `?${parts.join('&')}`;
}

export function fetchPublicContracts(query) {
	return new apiRequest().Get({
		module: 'contracts',
		params: buildPublicContractsQuery(query),
	});
}

export function fetchPublicContractById(id) {
	const safeId = Number(id);
	if (!Number.isInteger(safeId) || safeId < 1) {
		return Promise.reject({ status: 404, data: { code: 'API-ERROR' } });
	}
	return new apiRequest().Get({ module: 'contracts' }, safeId);
}

function normalizeName(value) {
	return String(value || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export const PUBLIC_PROCEDURE_CATEGORIES = [
	{ key: 'public-tender', label: 'Licitación Pública', color: 'success', icon: 'gavel', match: name => name.includes('licitacion publica') || name === 'publico' },
	{ key: 'invitation', label: 'Invitación', color: 'warning', icon: 'groups', match: name => name.includes('invitacion') },
	{ key: 'direct-award', label: 'Adjudicación Directa', color: 'danger', icon: 'handshake', match: name => name.includes('adjudicacion directa') },
];

export function getPublicProcedureCategory(procedureName) {
	const normalizedName = normalizeName(procedureName);
	return PUBLIC_PROCEDURE_CATEGORIES.find(category => category.match(normalizedName)) || null;
}

export function buildPublicContractCards(totals = {}) {
	const procedures = Array.isArray(totals.by_procedure) ? totals.by_procedure : [];
	const categories = PUBLIC_PROCEDURE_CATEGORIES.map(category => {
		const amount = procedures.reduce((sum, procedure) => {
			return category.match(normalizeName(procedure.procedure_name)) ? sum + (Number(procedure.total_amount) || 0) : sum;
		}, 0);
		return { ...category, amount };
	});

	return [{ key: 'total', label: 'Monto total', description: 'Monto de los contratos encontrados', color: 'primary', icon: 'account_balance_wallet', amount: Number(totals.total_amount) || 0 }, ...categories];
}

export function readPublicPagination(responseData = {}, requestedPage = 1, requestedLimit = PUBLIC_CONTRACT_DEFAULT_PAGE_SIZE) {
	const meta = responseData.meta || {};
	const pagination = responseData.pagination || meta.pagination || meta;
	const results = Number(pagination.results ?? responseData.totals?.results) || 0;
	const pages = Number(pagination.pages) || Math.max(1, Math.ceil(results / requestedLimit));
	const currentPage = Number(pagination.current_page ?? pagination.currentPage ?? requestedPage) || requestedPage;

	return { results, pages, currentPage };
}
