# Proposal

## Why

La API publica su contrato OpenAPI en `https://kapi.chavodigital.com/api/docs/openapi.json` (3.0.3, 40 endpoints de negocio) y esos datos pueden cambiar sin aviso; hoy el frontend implementa sus módulos contra costumbres locales que ya divergen del contrato
(`frontend-logs/update` vs `POST /frontend-logs`; `DELETE /organization/{id}`, `access/user-validation` y el campo `comments` de proveedores, que el contrato ni declara). Hace falta un mecanismo re-ejecutable que trate el swagger como fuente de verdad de
módulos, rutas y campos, versione su copia y haga visibles las divergencias cada vez que cambia.

## What Changes

- Script de sincronización (`pnpm api:sync`) que deriva el origen del contrato a partir de `VITE_API_ENDPOINT`, descarga `openapi.json`, lo guarda versionado en `docs/openapi.json` y genera `docs/openapi-report.md` comparando el contrato contra los módulos y
  payloads usados en `src/`. Re-ejecutable: cada corrida refleja el swagger vigente y permite diff contra la copia anterior.
- El reporte clasifica cada divergencia en dos clases: **desalineación de código** (el contrato tiene el equivalente y el frontend se corrige) y **gap de contrato** (el código usa algo que el contrato no declara; se conserva el comportamiento y se registra
  para que el backend lo documente).
- Corrección de la única desalineación con equivalente: `src/helpers/frontend.logs.js` deja de usar `module: 'frontend-logs/update'` y apunta al módulo que resuelve en `POST /frontend-logs`.
- Quedan registrados como gap de contrato, sin tocar el código: `DELETE /organization/{id}`, `access/user-validation` y el campo `comments` del payload de proveedores.
- Los flujos existentes que ya cumplen el contrato (logout con `GET`, módulos `proveedores`, `contracts`, `unidades-administrativas`, catálogos de configuración, `organization` con `GET`/`PUT`, `config`, `access/login|recovery|reset`) se contrastan y quedan
  confirmados por el reporte.
- Documentación: `package.json` expone el script, y la convención queda escrita para que la implementación futura de módulos consulte el contrato antes que el código.

## Capabilities

### New Capabilities

- `openapi-contract`: el contrato OpenAPI publicado como fuente canónica de módulos, rutas y campos del frontend; la sincronización re-ejecutable con copia versionada; y el reporte de divergencias con sus dos clases (desalineación de código, gap de contrato).

### Modified Capabilities

<!-- Ninguna: api-client describe operaciones, autorización, carga y errores; este cambio no altera ese comportamiento observable. -->

## Impact

- **Archivos nuevos**: `scripts/api-sync.mjs` (o equivalente), `docs/openapi.json`, `docs/openapi-report.md`.
- **Código**: `src/helpers/frontend.logs.js` (nombre del módulo). Sin cambios de comportamiento visible: la petición pasa a resolver al endpoint documentado.
- **Configuración**: `package.json` (script `api:sync`); opción de variable de entorno para el origen del contrato en `.env.example` si se decide derivarla de `VITE_API_ENDPOINT`.
- **Documentación**: `AGENTS.md`/`README.md` (comando y convención), `CHANGELOG.md`.
- **Sistemas afectados**: cualquier alta futura de módulo debe pasar por `pnpm api:sync` y resolver sus divergencias antes de dar por buena la implementación; los gaps de contrato se trasladan al backend.
