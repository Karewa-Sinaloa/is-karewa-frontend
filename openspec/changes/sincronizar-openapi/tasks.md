# Tasks

## 1. Herramienta de sincronización

- [ ] 1.1 Crear `scripts/openapi-gaps.json` con los tres gaps de contrato registrados (`endpoint` para `DELETE /organization/{id}` usado en `src/components/views/organization.vue`, `endpoint` para `access/user-validation` usado en
      `src/components/partials/verification.vue`, `campo` para `comments` en el payload de `src/components/views/proveedores/view.vue`), cada uno con motivo «el backend debe documentarlo»; verificar con
      `python3 -c "import json; g=json.load(open('scripts/openapi-gaps.json')); assert len(g)==3"`.
- [ ] 1.2 Crear `scripts/api-sync.mjs` (Node 18+, `fetch` nativo, sin dependencias): deriva el origen del contrato de `VITE_API_ENDPOINT` con override `OPENAPI_URL`, descarga `openapi.json`, escribe `docs/openapi.json` solo si la descarga tuvo éxito y genera
      `docs/openapi-report.md` clasificando cada módulo de `src/**/*.{js,vue}` como conforme, desalineación de código, gap de contrato (según el manifest) o no resoluble estáticamente; verificar con `pnpm api:sync` que produce `docs/openapi.json` y
      `docs/openapi-report.md` y con `python3 -c "import json; d=json.load(open('docs/openapi.json')); assert d['openapi'].startswith('3.')"` que la copia es JSON OpenAPI válido.
- [ ] 1.3 Registrar el script `api:sync` en `package.json`; verificar con `node -e "if(!require('./package.json').scripts['api:sync']) process.exit(1)"` con código 0

## 2. Corrección de la desalineación

- [ ] 2.1 Cambiar en `src/helpers/frontend.logs.js` el módulo `frontend-logs/update` por `frontend-logs` para que la petición resuelva en `POST /frontend-logs`; verificar con `rg -n "module: 'frontend-logs'" src/helpers/frontend.logs.js` y que
      `rg -n "frontend-logs/update" src` no devuelva resultados
- [ ] 2.2 Re-ejecutar `pnpm api:sync` tras la corrección y verificar en `docs/openapi-report.md` que el resumen indica 0 desalineaciones de código pendientes, que los tres gaps siguen clasificados como gap de contrato y que `drag_drop_file.vue` aparece como no
      resoluble estáticamente; verificar con `rg -n "0 desalineaciones|gap de contrato|no resoluble" docs/openapi-report.md` con las tres categorías presentes

## 3. Documentación

- [ ] 3.1 Actualizar `AGENTS.md` con la convención: el contrato OpenAPI publicado es la fuente canónica de módulos, rutas y campos, y toda alta de módulo pasa por `pnpm api:sync` antes de darse por buena; verificar con `rg -n "pnpm api:sync|openapi" AGENTS.md`
      con al menos un resultado por concepto
- [ ] 3.2 Registrar el cambio en `CHANGELOG.md` bajo `[Unreleased]` (script de sincronización, copia versionada y corrección de `frontend-logs`); verificar con `rg -n "api:sync|frontend-logs" CHANGELOG.md`
- [ ] 3.3 Documentar la variable opcional `OPENAPI_URL` en `.env.example` como override del origen del contrato; verificar con `rg -n "OPENAPI_URL" .env.example`

## 4. Verificación integral

- [ ] 4.1 Ejecutar `pnpm api:sync`, guardar el reporte (`cp docs/openapi-report.md /tmp/opencode/report1.md`), ejecutarlo de nuevo y verificar estabilidad: `diff /tmp/opencode/report1.md docs/openapi-report.md` sin diferencias de clasificación y
      `git status --porcelain docs` mostrando únicamente `docs/openapi.json` y `docs/openapi-report.md`
- [ ] 4.2 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [ ] 4.3 Ejecutar `openspec status --change "sincronizar-openapi"` y verificar 4/4 artifacts completos
- [ ] 4.4 Verificar que el alcance de código fue el previsto: `git status --porcelain src` muestra únicamente `src/helpers/frontend.logs.js`
