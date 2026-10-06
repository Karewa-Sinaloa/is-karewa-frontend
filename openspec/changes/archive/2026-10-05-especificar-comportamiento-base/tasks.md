# Tasks

## 1. Contraste de los deltas con el código

- [x] 1.1 Verificar los escenarios de `routing` contra `src/router/index.js` (guard `meta.login`, redirecciones de `/acceso/` y `/contratos`, `scrollBehavior`) y corregir el delta si algo no coincide; verificar con
      `grep -n "meta.login\|redirect:\|scrollBehavior" src/router/index.js` que cada escenario tiene respaldo
- [x] 1.2 Verificar los escenarios de `authentication` y `form-validation` contra `src/helpers/set.session.js`, `src/components/partials/login.vue` y `src/helpers/yup.locale.js` (expiración, roles, logout, mensajes en español) y corregir los deltas si algo no
      coincide; verificar con `grep -n "sessionExpired\|role_id\|unSet\|setLocale" src/helpers/set.session.js src/helpers/yup.locale.js`
- [x] 1.3 Verificar los escenarios de `api-client` y `error-handling` contra `src/api/requests.js`, `src/api/axios.js` y `src/resources/errors.js` (loading global, 401, `API_NO_ENTRY_ID_PROVIDED`, fallback `SERVER-ERROR`) y corregir los deltas si algo no
      coincide; verificar con `grep -n "closedSessionCodes\|API_NO_ENTRY_ID_PROVIDED\|store.loading\|serverMessages" src/api/requests.js src/resources/errors.js`
- [x] 1.4 Verificar los escenarios de `contracts-configuration` contra `src/components/views/contracts/dash.vue` (6 widgets) y `src/components/views/contracts/contract_view.vue` (consumo de la configuración) y corregir el delta si algo no coincide; verificar
      con `grep -cE "<(contracts-|contract-|unit-types)" src/components/views/contracts/dash.vue` con resultado 6 y `grep -n "module: 'procedimientos'\|module: 'unit-types'\|module: 'periodos-contratos'" src/components/views/contracts/contract_view.vue`
- [x] 1.5 Ejecutar `openspec validate "especificar-comportamiento-base"` y verificar que informa válido sin errores

## 2. Contexto de OpenSpec

- [x] 2.1 Llenar el bloque `context:` de `openspec/config.yaml` (sin comentarios) con stack, convenciones Prettier/SASS, mapa de módulos y la convención de redactar specs en español; verificar con
      `openspec instructions proposal --change "especificar-comportamiento-base" --json | python3 -c "import json,sys; print(json.load(sys.stdin)['context'][:80])"` que imprime el stack, y con
      `python3 -c "import yaml; assert yaml.safe_load(open('openspec/config.yaml'))['context']"` que el YAML es válido

## 3. Reescritura de AGENTS.md

- [x] 3.1 Reescribir `AGENTS.md` como índice operativo (qué es, comandos esenciales, sección "Especificaciones (OpenSpec)" con las 7 capabilities y el flujo propose→apply→archive con comandos, convenciones mínimas, mapa de documentación); verificar con
      `wc -l AGENTS.md` un total ≤ 90 líneas y `grep -c "^## " AGENTS.md` ≥ 4
- [x] 3.2 Verificar que la sección de especificaciones lista las 7 capabilities y documenta los comandos `openspec list`, `openspec status` y `openspec validate`; verificar con
      `grep -oE "design-system|routing|authentication|api-client|error-handling|form-validation|contracts-configuration" AGENTS.md | sort -u | wc -l` con resultado 7 y `grep -n "openspec validate" AGENTS.md`
- [x] 3.3 Verificar que todos los punteros del nuevo `AGENTS.md` resuelven; verificar con `test -f SPEC.md && test -f .prettierrc.json && test -f .env.example && test -f CHANGELOG.md && test -f NOTES.md && test -f DEV_ENV_MANUAL.md && test -f README-docker.md`
      con código 0
- [x] 3.4 Verificar que se eliminó de `AGENTS.md` el contenido movido a specs/docs sin perder comandos operativos; verificar con `grep -c "pnpm" AGENTS.md` ≥ 2 y `grep -c "Rutas Principales\|Sistema de Autenticación\|API y Peticiones" AGENTS.md` = 0

## 4. Verificación integral

- [x] 4.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [x] 4.2 Ejecutar `openspec status --change "especificar-comportamiento-base"` y verificar 4/4 artifacts completos
- [x] 4.3 Verificar que este cambio no tocó código de la aplicación: `git status --porcelain src` muestra únicamente los tres archivos SASS intervenidos por el cambio anterior (`_access.sass`, `_base.sass`, `_variables.sass`)
