import { apiRequest } from '../api/requests.js';

/*-- Campos mínimos que alimentan las gráficas de la vista de inicio--*/
const CHART_FIELDS = 'period_id,period_name,procedure_id,procedure_name,total_amount,admin_period_start,admin_period_end,fiscal_year,contract_date';
const PAGE_LIMIT = 500;
const BATCH_SIZE = 10;
const MAX_PAGES = 200;

const currencyFormatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

/*-- Formateador monetario de los montos de las gráficas (es-MX, MXN, sin decimales)--*/
export function formatCurrency(value) {
	return currencyFormatter.format(Number(value) || 0);
}

/*-- Construye la query de GET /contracts: paginación, campos mínimos y solo los filtros con selección (D2).--*/
function buildQuery(filters = {}, page = 1) {
	const parts = [`page=${page}`, `limit=${PAGE_LIMIT}`, `embed=pagination`, `fields=${CHART_FIELDS}`];
	if (filters.administration) {
		const [start, end] = String(filters.administration).split('-');
		parts.push(`admin_period_start=eq:${encodeURIComponent(start)}`);
		parts.push(`admin_period_end=eq:${encodeURIComponent(end)}`);
	}
	if (filters.fiscalYear) {
		parts.push(`fiscal_year=eq:${encodeURIComponent(filters.fiscalYear)}`);
	}
	if (filters.periodId) {
		parts.push(`period_id=eq:${encodeURIComponent(filters.periodId)}`);
	}
	if (filters.procedureId) {
		parts.push(`procedure_id=eq:${encodeURIComponent(filters.procedureId)}`);
	}
	if (filters.organizerAdminUnitId) {
		parts.push(`organizer_admin_unit_id=eq:${encodeURIComponent(filters.organizerAdminUnitId)}`);
	}
	if (filters.providerId) {
		parts.push(`provider_id=eq:${encodeURIComponent(filters.providerId)}`);
	}
	return `?${parts.join('&')}`;
}

function fetchPage(page, filters) {
	return new apiRequest().Get({
		module: 'contracts',
		params: buildQuery(filters, page),
	});
}

/*--
	Obtiene el conjunto completo de contratos para las gráficas aplicando los filtros
	indicados (solo los seleccionados). Pagina en tandas de 10 peticiones paralelas
	hasta agotar la paginación de la respuesta, con tope de 200 páginas.
--*/
export async function fetchContractsForCharts(filters = {}) {
	const first = await fetchPage(1, filters);
	const body = first.data;
	const rows = Array.isArray(body.data) ? [...body.data] : [];
	const meta = body.meta || {};
	const pagination = meta.pagination || meta;
	let pages = Number(pagination.pages) || 1;
	const results = Number(pagination.results) || 0;

	// El servidor puede recortar el limit pedido: si la primera página vino corta y hay más páginas, se usa el máximo real detectado.
	if (rows.length > 0 && rows.length < PAGE_LIMIT && pages > 1 && results > 0) {
		pages = Math.ceil(results / rows.length);
	}
	if (pages > MAX_PAGES) {
		throw { status: 413, data: { code: 'API-ERROR' } };
	}

	for (let start = 2; start <= pages; start += BATCH_SIZE) {
		const batch = [];
		for (let page = start; page < start + BATCH_SIZE && page <= pages; page++) {
			batch.push(page);
		}
		const responses = await Promise.all(batch.map(page => fetchPage(page, filters)));
		let received = 0;
		responses.forEach(response => {
			const pageRows = Array.isArray(response.data.data) ? response.data.data : [];
			received += pageRows.length;
			rows.push(...pageRows);
		});
		// Una página vacía agota la paginación declarada: se corta el loop.
		if (received === 0) {
			break;
		}
	}
	return rows;
}

/*-- Trimestre (Q1..Q4) derivado del mes de una fecha YYYY-MM-DD; sin fecha o mes inválido, null.--*/
function quarterFromDate(value) {
	if (!value) {
		return null;
	}
	const month = Number(String(value).slice(5, 7));
	if (!Number.isInteger(month) || month < 1 || month > 12) {
		return null;
	}
	return `Q${Math.ceil(month / 3)}`;
}

/*--
	Suma de total_amount por año fiscal (fiscal_year) y trimestre (derivado de contract_date).
	Se conservan los maxYears más recientes y se devuelven en orden ascendente
	(izquierda: año más lejano, derecha: más reciente); cada año expone los cuatro trimestres (en cero si no hubo contratos).
--*/
export function aggregateByYearQuarter(rows = [], maxYears = 6) {
	const byYear = new Map();
	rows.forEach(row => {
		const rawYear = row.fiscal_year;
		if (rawYear === null || rawYear === undefined || rawYear === '') {
			return;
		}
		const year = String(rawYear);
		let entry = byYear.get(year);
		if (!entry) {
			entry = { year, Q1: 0, Q2: 0, Q3: 0, Q4: 0, total: 0 };
			byYear.set(year, entry);
		}
		const amount = Number(row.total_amount) || 0;
		entry.total += amount;
		const quarter = quarterFromDate(row.contract_date);
		if (quarter) {
			entry[quarter] += amount;
		}
	});
	// Ascendente (más lejano → más reciente) tomando solo los maxYears más recientes.
	return [...byYear.values()].sort((a, b) => Number(a.year) - Number(b.year)).slice(-maxYears);
}

/*-- Suma de total_amount por procedure_id; la gráfica de pastel descarta después los totales en cero.--*/
export function aggregateByProcedure(rows = []) {
	const totals = new Map();
	rows.forEach(row => {
		const key = String(row.procedure_id);
		const entry = totals.get(key) || { procedureId: row.procedure_id, procedureName: row.procedure_name, total: 0 };
		if (!entry.procedureName && row.procedure_name) {
			entry.procedureName = row.procedure_name;
		}
		entry.total += Number(row.total_amount) || 0;
		totals.set(key, entry);
	});
	return [...totals.values()];
}

/*-- Series de ECharts construidas desde tokens de :root: rampas primary/secondary y semánticos (sin literales de color, D5).--*/
const CHART_PALETTE_TOKENS = [
	'--color-primary',
	'--color-secondary',
	'--color-danger',
	'--color-primary-700',
	'--color-secondary-700',
	'--color-primary-400',
	'--color-secondary-400',
	'--color-primary-900',
	'--color-secondary-900',
	'--color-primary-200',
	'--color-secondary-200',
	'--color-grayscale-600',
];

/*-- Lee la paleta y los colores de ejes de las custom properties de :root en tiempo de ejecución.--*/
export function readChartPalette() {
	const rootStyle = getComputedStyle(document.documentElement);
	const read = token => {
		const value = rootStyle.getPropertyValue(token).trim();
		return value || undefined;
	};
	return {
		colors: CHART_PALETTE_TOKENS.map(read).filter(Boolean),
		axis: read('--color-grayscale-700'),
		splitLine: read('--color-grayscale-100'),
		text: read('--text-color-primary-dark'),
	};
}

/*-- Un token por trimestre, elegidos por tono realmente distinto entre sí: azul, dorado, vino y pizarra (D5: sin literales).--*/
const QUARTER_TOKENS = ['--color-primary', '--color-secondary', '--color-danger', '--color-grayscale-600'];

/*-- Lee los colores de los cuatro trimestres desde :root en tiempo de ejecución (una entrada por T1..T4).--*/
export function readQuarterColors() {
	const rootStyle = getComputedStyle(document.documentElement);
	return QUARTER_TOKENS.map(token => rootStyle.getPropertyValue(token).trim() || undefined);
}

/*-- Opciones de administración: pares distintos admin_period_start-admin_period_end, etiqueta "<inicio>-<fin>", inicio descendente.--*/
export function deriveAdminOptions(rows = []) {
	const options = new Map();
	rows.forEach(row => {
		if (!row.admin_period_start || !row.admin_period_end) {
			return;
		}
		const value = `${row.admin_period_start}-${row.admin_period_end}`;
		if (!options.has(value)) {
			options.set(value, { value, label: value });
		}
	});
	return [...options.values()].sort((a, b) => Number(b.value.split('-')[0]) - Number(a.value.split('-')[0]));
}

/*-- Opciones de año fiscal: años distintos registrados en los contratos, orden descendente.--*/
export function deriveFiscalYearOptions(rows = []) {
	const years = new Set();
	rows.forEach(row => {
		if (row.fiscal_year) {
			years.add(String(row.fiscal_year));
		}
	});
	return [...years].map(year => ({ value: year, label: year })).sort((a, b) => Number(b.value) - Number(a.value));
}
