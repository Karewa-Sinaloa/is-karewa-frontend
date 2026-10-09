const SECRET_KEYS = ['pass', 'password', 'secret', 'token', 'apikey', 'api_key'];
const MASK_TOKEN_PREFIX = '__KAREWA_OCULTO_';
const MASK_BULLETS = '••••••••';
const MIN_TEXT_SECRET_LENGTH = 3;

export function parseJsonObject(value) {
	if (typeof value !== 'string' || !value.trim()) {
		return null;
	}
	try {
		const parsed = JSON.parse(value);
		return parsed !== null && typeof parsed === 'object' ? parsed : null;
	} catch (error) {
		return null;
	}
}

export function isSecretKey(key) {
	return SECRET_KEYS.includes(String(key).toLowerCase());
}

export function detectValueMode(value) {
	return parseJsonObject(value) === null ? 'text' : 'json';
}

export function toEditableValue(value) {
	if (value === null || value === undefined) {
		return '';
	}
	const raw = String(value);
	const parsed = parseJsonObject(raw);
	return parsed ? JSON.stringify(parsed, null, 2) : raw;
}

function walkJson(node, visitor) {
	if (Array.isArray(node)) {
		node.forEach(item => walkJson(item, visitor));
		return;
	}
	if (node === null || typeof node !== 'object') {
		return;
	}
	Object.keys(node).forEach(key => {
		visitor(key, node[key], node);
		walkJson(node[key], visitor);
	});
}

function extractTextSecrets(text) {
	const found = [];
	const pattern = new RegExp(`"(${SECRET_KEYS.join('|')})"\\s*:\\s*"([^"]*)"`, 'gi');
	let match = pattern.exec(text);
	while (match !== null) {
		if (match[2].length >= MIN_TEXT_SECRET_LENGTH) {
			found.push(match[2]);
		}
		match = pattern.exec(text);
	}
	return found;
}

function maskJson(text) {
	const parsed = parseJsonObject(text);
	if (!parsed) {
		return { text, map: [] };
	}
	const map = [];
	walkJson(parsed, (key, value, holder) => {
		if (!isSecretKey(key) || typeof value !== 'string' || !value) {
			return;
		}
		const token = `${MASK_TOKEN_PREFIX}${map.length}__`;
		map.push({ token, secret: value });
		holder[key] = token;
	});
	return { text: JSON.stringify(parsed, null, 2), map };
}

function maskText(text) {
	const secrets = [...new Set(extractTextSecrets(text))].sort((left, right) => right.length - left.length);
	const map = [];
	let masked = text;
	secrets.forEach(secret => {
		const token = `${MASK_TOKEN_PREFIX}${map.length}__`;
		if (masked.includes(secret)) {
			masked = masked.split(secret).join(token);
			map.push({ token, secret });
		}
	});
	return { text: masked, map };
}

export function maskSecrets(text, mode) {
	return mode === 'json' ? maskJson(text) : maskText(text);
}

function restoreJson(text, map) {
	const parsed = parseJsonObject(text);
	if (!parsed) {
		return { text, ok: false };
	}
	const restored = new Set();
	walkJson(parsed, (key, value, holder) => {
		if (typeof value !== 'string') {
			return;
		}
		const found = map.find(item => item.token === value);
		if (found) {
			restored.add(found.token);
			holder[key] = found.secret;
		}
	});
	return { text: JSON.stringify(parsed, null, 2), ok: restored.size === map.length };
}

function restoreText(text, map) {
	let restored = text;
	map.forEach(({ token, secret }) => {
		restored = restored.split(token).join(secret);
	});
	return { text: restored, ok: !restored.includes(MASK_TOKEN_PREFIX) };
}

export function restoreSecrets(text, map, mode) {
	return mode === 'json' ? restoreJson(text, map) : restoreText(text, map);
}

export function maskForDisplay(value) {
	if (value === null || value === undefined) {
		return '';
	}
	const raw = String(value);
	let masked = raw;
	extractTextSecrets(raw).forEach(secret => {
		masked = masked.split(secret).join(MASK_BULLETS);
	});
	return masked;
}

export { MASK_BULLETS };
