#!/usr/bin/env node
/**
 * api-sync.mjs — Sincroniza la copia versionada del contrato OpenAPI y genera
 * el reporte de divergencias contra los módulos usados en src/.
 *
 * Node 18+ (fetch nativo), sin dependencias.
 * Uso: pnpm api:sync   (OPENAPI_URL=<url> para override del origen del contrato)
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'src');
const GAPS_PATH = join(ROOT, 'scripts', 'openapi-gaps.json');
const OUT_JSON = join(ROOT, 'docs', 'openapi.json');
const OUT_REPORT = join(ROOT, 'docs', 'openapi-report.md');
const SCAN_EXT = new Set(['.js', '.vue']);
const METHOD_RE = /\.(Get|Post|Put|Delete|Upload)\s*\(/g;
const MODULE_LITERAL_RE = /(['"]?)module\1?\s*:\s*(['"])([^'"\n]+)\2/g;
const MODULE_DYNAMIC_RE = /(['"]?)module\1?\s*:\s*([^'"\s,;][^,;\n}]*)/g;
const METHOD_HTTP = { Get: 'GET', Post: 'POST', Put: 'PUT', Delete: 'DELETE', Upload: 'POST' };
const PROXIMITY = 400;

function fail(message) {
	console.error(`api-sync: ${message}`);
	process.exit(1);
}

function loadEnvFiles() {
	const vars = {};
	for (const name of ['.env', '.env.example']) {
		const path = join(ROOT, name);
		if (!existsSync(path)) continue;
		for (const line of readFileSync(path, 'utf8').split('\n')) {
			const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
			if (!match) continue;
			let value = match[2].replace(/\s*#.*$/, '').trim();
			if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
			if (vars[match[1]] === undefined) vars[match[1]] = value;
		}
	}
	return vars;
}

function contractUrl(fileEnv) {
	const fromEnv = process.env.OPENAPI_URL || fileEnv.OPENAPI_URL;
	if (fromEnv) return fromEnv;
	const endpoint = process.env.VITE_API_ENDPOINT || fileEnv.VITE_API_ENDPOINT;
	if (!endpoint) fail('no se encontró VITE_API_ENDPOINT (ni OPENAPI_URL) en el entorno ni en .env');
	const base = endpoint.replace(/\/api\/[^/]+\/?$/, '');
	return `${base}/api/docs/openapi.json`;
}

async function download(url) {
	let response;
	try {
		response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { accept: 'application/json' } });
	} catch (error) {
		return { error: `no se pudo descargar el contrato desde ${url}: ${error.message}` };
	}
	if (!response.ok) return { error: `no se pudo descargar el contrato desde ${url}: HTTP ${response.status}` };
	try {
		return { spec: JSON.parse(await response.text()) };
	} catch (error) {
		return { error: `la respuesta no es JSON válido (${url}): ${error.message}` };
	}
}

function walk(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) walk(path, files);
		else if (SCAN_EXT.has(entry.name.slice(entry.name.lastIndexOf('.')))) files.push(path);
	}
	return files;
}

function methodAt(content, index) {
	const methods = [];
	METHOD_RE.lastIndex = 0;
	for (let match = METHOD_RE.exec(content); match; match = METHOD_RE.exec(content)) methods.push({ name: match[1], index: match.index });
	let best = null;
	for (const method of methods) {
		const distance = method.index < index ? index - method.index : method.index - index;
		if (distance > PROXIMITY) continue;
		if (!best || distance < best.distance) best = { ...method, distance };
	}
	return best ? best.name : null;
}

function scanModules() {
	const calls = [];
	const dynamic = [];
	for (const file of walk(SRC_DIR)) {
		const content = readFileSync(file, 'utf8');
		const rel = relative(ROOT, file);
		const lineOf = index => content.slice(0, index).split('\n').length;
		MODULE_LITERAL_RE.lastIndex = 0;
		const literals = [];
		let literal;
		while ((literal = MODULE_LITERAL_RE.exec(content)) !== null) literals.push({ module: literal[3], index: literal.index });
		const claimed = literals.map(item => [item.index, MODULE_LITERAL_RE.lastIndex]);
		MODULE_DYNAMIC_RE.lastIndex = 0;
		let dynamicMatch;
		while ((dynamicMatch = MODULE_DYNAMIC_RE.exec(content)) !== null) {
			const start = dynamicMatch.index;
			const end = MODULE_DYNAMIC_RE.lastIndex;
			if (claimed.some(([from, to]) => start >= from && start < to)) continue;
			dynamic.push({ file: rel, line: lineOf(start), expression: dynamicMatch[2].trim() });
		}
		for (const item of literals) {
			calls.push({ module: item.module, method: methodAt(content, item.index), file: rel, line: lineOf(item.index) });
		}
	}
	return { calls, dynamic };
}

function classify(calls, spec, gaps) {
	const paths = spec.paths || {};
	const byKey = new Map();
	for (const call of calls) {
		const key = `${call.module}|${call.method || '?'}`;
		if (!byKey.has(key)) byKey.set(key, { module: call.module, method: call.method, sites: [] });
		byKey.get(key).sites.push({ file: call.file, line: call.line });
	}
	const endpointGaps = gaps.filter(gap => gap.tipo === 'endpoint');
	const fieldGaps = gaps.filter(gap => gap.tipo === 'campo');
	const conformes = [];
	const misalignments = [];
	const contractGaps = [];
	const usedGaps = new Set();

	for (const entry of [...byKey.values()].sort((a, b) => `${a.module}${a.method}`.localeCompare(`${b.module}${b.method}`))) {
		const candidates = [`/${entry.module}`, `/${entry.module}/{id}`];
		const available = candidates.filter(path => paths[path]);
		let aligned = available.length > 0;
		if (aligned && entry.method) {
			const http = METHOD_HTTP[entry.method].toLowerCase();
			aligned = available.some(path => Object.hasOwn(paths[path], http));
		}
		if (aligned) {
			const http = entry.method ? METHOD_HTTP[entry.method].toLowerCase() : null;
			const path = available.find(candidate => (http ? Object.hasOwn(paths[candidate], http) : true)) || available[0];
			conformes.push({ ...entry, path });
			continue;
		}
		const gap = endpointGaps.find(item => item.modulo === entry.module && (!item.metodo || !entry.method || item.metodo.toUpperCase() === entry.method.toUpperCase()));
		if (gap) {
			usedGaps.add(gap);
			contractGaps.push({ tipo: 'endpoint', modulo: entry.module, metodo: entry.method || '—', campo: '—', path: gap.path || '—', archivo: entry.sites[0].file, motivo: gap.motivo });
		} else {
			misalignments.push(entry);
		}
	}

	for (const gap of fieldGaps) {
		const source = existsSync(join(ROOT, gap.archivo)) ? readFileSync(join(ROOT, gap.archivo), 'utf8') : '';
		const active = new RegExp(`\\b${gap.campo}\\b`).test(source);
		if (active) {
			usedGaps.add(gap);
			contractGaps.push({ tipo: 'campo', modulo: gap.modulo || '—', metodo: '—', campo: gap.campo, path: '—', archivo: gap.archivo, motivo: gap.motivo });
		}
	}
	for (const gap of endpointGaps) if (!usedGaps.has(gap)) contractGaps.push({ ...gap, obsoleto: true });

	return { conformes, misalignments, contractGaps };
}

function table(headers, rows) {
	const lines = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`];
	for (const row of rows) lines.push(`| ${row.join(' | ')} |`);
	return lines.join('\n');
}

function report(url, spec, scan, result) {
	const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
	const obsolete = result.contractGaps.filter(gap => gap.obsoleto);
	const gaps = result.contractGaps.filter(gap => !gap.obsoleto);
	const sites = rows =>
		rows.map(entry => [
			entry.module,
			entry.method || '—',
			`\`/${entry.module}\``,
			entry.sites
				.map(site => `${site.file}:${site.line}`)
				.sort()
				.join('<br>'),
		]);
	const lines = [
		'# Reporte de sincronización OpenAPI',
		'',
		`- Contrato: ${url}`,
		`- Especificación: ${spec.info?.title || 'sin título'} ${spec.info?.version || ''} (OpenAPI ${spec.openapi})`.trim(),
		'',
		'## Resumen',
		'',
		`- Módulos analizados: ${scan.calls.length} llamadas, ${new Set(scan.calls.map(call => call.module)).size} módulos literales`,
		`- Conformes: ${result.conformes.length}`,
		`- Desalineaciones de código: ${plural(result.misalignments.length, 'desalineación pendiente', 'desalineaciones pendientes')}`,
		`- Gaps de contrato: ${gaps.length}`,
		`- No resolubles estáticamente: ${scan.dynamic.length}`,
		`- Gaps obsoletos: ${obsolete.length}`,
		'',
		'## Desalineaciones de código',
		'',
	];
	if (result.misalignments.length) {
		lines.push('Divergencias sin registro en el manifest: el contrato declara el equivalente y el frontend debe corregirse.', '', table(['Módulo', 'Método', 'Path', 'Sitios'], sites(result.misalignments)));
	} else {
		lines.push('Ninguna desalineación de código pendiente.');
	}
	lines.push('', '## Gaps de contrato', '');
	if (gaps.length) {
		lines.push(
			'Los siguientes elementos se clasifican como gap de contrato: el comportamiento del frontend se conserva y el backend debe documentarlo.',
			'',
			table(
				['Tipo', 'Módulo', 'Método', 'Campo', 'Path', 'Archivo', 'Motivo'],
				gaps.map(gap => [gap.tipo, `\`${gap.modulo}\``, gap.metodo, gap.campo, gap.path, gap.archivo, gap.motivo])
			)
		);
	} else {
		lines.push('No hay gaps de contrato registrados.');
	}
	if (obsolete.length) {
		lines.push(
			'',
			'Gaps del manifest que ya no aparecen en el código (candidatos a retiro):',
			'',
			table(
				['Tipo', 'Módulo', 'Método', 'Campo', 'Archivo', 'Motivo'],
				obsolete.map(gap => [gap.tipo, `\`${gap.modulo || gap.campo}\``, gap.metodo || '—', gap.campo || '—', gap.archivo, gap.motivo])
			)
		);
	}
	lines.push('', '## No resolubles estáticamente', '');
	if (scan.dynamic.length) {
		lines.push(
			'Llamadas cuyo módulo llega por propiedades y quedan clasificadas como no resoluble estáticamente:',
			'',
			table(
				['Archivo', 'Línea', 'Expresión'],
				scan.dynamic.sort((a, b) => `${a.file}${a.line}`.localeCompare(`${b.file}${b.line}`)).map(item => [item.file, String(item.line), `\`${item.expression}\``])
			)
		);
	} else {
		lines.push('Sin llamadas con módulo dinámico.');
	}
	lines.push('', '## Módulos conformes', '');
	if (result.conformes.length) {
		lines.push(table(['Módulo', 'Método', 'Path', 'Sitios'], sites(result.conformes)));
	} else {
		lines.push('Ninguno.');
	}
	lines.push('');
	return lines.join('\n');
}

const fileEnv = loadEnvFiles();
const url = contractUrl(fileEnv);
const { spec, error } = await download(url);
if (error) fail(`${error}; se conserva la copia versionada anterior en docs/openapi.json`);
if (!spec.openapi) fail('la especificación descargada no declara openapi');

mkdirSync(join(ROOT, 'docs'), { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(spec, null, '\t')}\n`);

const gaps = existsSync(GAPS_PATH) ? JSON.parse(readFileSync(GAPS_PATH, 'utf8')) : [];
const scan = scanModules();
const result = classify(scan.calls, spec, gaps);
writeFileSync(OUT_REPORT, report(url, spec, scan, result));

console.log(`api-sync: contrato descargado desde ${url}`);
console.log(`api-sync: ${result.conformes.length} conformes, ${result.misalignments.length} desalineaciones, ${result.contractGaps.filter(gap => !gap.obsoleto).length} gaps de contrato, ${scan.dynamic.length} no resolubles`);
console.log(`api-sync: escritos docs/openapi.json y docs/openapi-report.md`);
