# Design

## Context

- El contrato se publica en `https://kapi.chavodigital.com/api/docs/openapi.json` (OpenAPI 3.0.3, `info.title = Monitor Karewa API 5.0.0`); la UI de docs se sirve en `/api/docs` con Scalar apuntando a ese JSON. La configuración local tiene
  `VITE_API_ENDPOINT=https://kapi.chavodigital.com/api/v5`, de modo que el origen compartido es el de ese endpoint.
- El frontend consume módulos mediante la clase `apiRequest` (`src/api/requests.js`) con cadenas `module: '...'` en las vistas/helpers. Contraste hecho contra el contrato:
    - Desalineación con equivalente: `frontend-logs/update` existe hoy en `src/helpers/frontend.logs.js`; el contrato declara `POST /frontend-logs`.
    - Gaps de contrato (código adelantado): `DELETE /organization/{id}` (contrato solo `GET`/`PUT`), `access/user-validation` (no existe en el documento) y el campo `comments` del payload de proveedores (el schema solo declara `id, name, slug, rfc`).
    - Sin divergencia: `GET access/logout` (el código ya usa `Get`), módulos de contratos/proveedores/unidades/catálogos, `organization` con `GET`/`PUT`, `config`, `access/login|recovery|reset`.
    - Módulo no resoluble estáticamente: `drag_drop_file.vue` llama `Upload({ module: props.module })`; el módulo llega por propiedades, así que la sincronización no puede resolverlo por análisis estático.
- Sin suite de tests: la verificación del proyecto es lectura de escenarios + `openspec validate`. `package.json` hoy solo tiene `dev`, `build`, `preview`; no hay carpeta `scripts/` ni `docs/`.

Ver `proposal.md` — Why para la motivación completa.

## Goals / Non-Goals

**Goals:**

- Un comando re-ejecutable que mantenga una copia versionada del contrato y un reporte de divergencias actualizado con el swagger vigente.
- Clasificación estable de divergencias: desalineación de código (se corrige el frontend) vs gap de contrato (se conserva el código y se traslada al backend).
- Corregir la única desalineación con equivalente (`frontend-logs`) sin cambiar el comportamiento observable.

**Non-Goals:**

- Automatización en CI ni validación en tiempo de build (el comando es manual y corre bajo demanda).
- Consumo del contrato en runtime ni generación de tipos/código desde el OpenAPI.
- Modificar los flujos de verificación de correo, borrado de organización ni el campo comentarios: son gaps que documenta el backend.
- Corregir el contrato OpenAPI (pertenece al repositorio de la API).

## Decisions

1. **Origen del contrato derivado de la configuración existente.** El script toma el origen de `VITE_API_ENDPOINT` (quitando el prefijo `.../api/<versión>`) y resuelve `/api/docs/openapi.json`, con override opcional por variable `OPENAPI_URL` para apuntar a
   otro despliegue. Alternativa descartada: una variable nueva obligatoria en `.env.example` — duplica la verdad del origen y puede quedar desincronizada.
2. **Copia versionada en `docs/openapi.json` + reporte en `docs/openapi-report.md`.** Son artefactos de referencia, no de runtime. Alternativa descartada: `src/api/openapi.json` — colocarlo bajo `src/` sugiere importación en runtime y mezcla datos de contrato
   con el bundle; `resources/` está reservado a operación (cloudflared).
3. **Script propio sin dependencias (`scripts/api-sync.mjs`, Node 18+ con `fetch` nativo).** Comparar paths/métodos no requiere librerías OpenAPI; las únicas dependencias serían para validación de esquema, fuera de alcance. Alternativa descartada:
   `openapi-typescript`/generadores — introducirían artefactos generados y un toolchain que el proyecto no usa.
4. **Manifest explícito de gaps (`scripts/openapi-gaps.json`).** Cada gap de contrato se registra con tipo (`endpoint` o `campo`), el módulo/ruta o campo afectado, el archivo que lo usa y el motivo («el backend debe documentarlo»). El script clasifica así:
   divergencia no listada → desalineación de código a corregir; divergencia listada → gap de contrato; entrada del manifest que ya no aparece en el código → gap obsoleto señalado para retiro. Alternativa descartada: heurísticas que infieran la intención — no
   distinguirían un error de código de un endpoint aún no documentado.
5. **Resolución de módulos por análisis estático con categoría de no resolubles.** El script extrae `module: '<literal>'` de `src/**/*.{js,vue}` y lo resuelve contra los paths del contrato (aceptando el sufijo `/{id}`); detecta el método por el tipo de llamada
   (`Get/Post/Put/Delete/Upload`) en el mismo bloque. Las llamadas con módulo dinámico (`props.module`) se listan aparte como «no resoluble estáticamente» en lugar de marcarlas como error.
6. **Corrección mínima de la desalineación.** Cambiar `module: 'frontend-logs/update'` a `module: 'frontend-logs'` en `src/helpers/frontend.logs.js`: el método (`Post`) y el payload ya coinciden con `POST /frontend-logs`. Ningún otro código se toca.

## Risks / Trade-offs

- [El contrato publicado puede estar incompleto (gaps reales como `user-validation`)] → El manifest hace explícito lo que el frontend espera y convierte cada gap en un ítem trazable para el backend; el reporte los distingue de los errores de código.
- [Análisis estático frágil ante módulos construidos dinámicamente] → Categoría «no resoluble estáticamente» en el reporte; `drag_drop_file.vue` queda ahí hoy y no bloquea la sincronización.
- [La copia versionada depende del origen con el que se corra el script (dev local vs producción)] → Documentar en el comando que la copia canónica se sincroniza contra el despliegue de producción; el override `OPENAPI_URL` queda para exploración, sin
  versionar sus resultados por defecto.
- [El reporte se desincroniza si nadie re-ejecuta el comando] → El comando es barato y sin dependencias; la convención queda escrita en `AGENTS.md` para que toda alta de módulo lo incluya (adopción social, no automatización — CI está fuera de alcance por
  decisión explícita).
- [Corregir `frontend-logs` sin contrato de respaldo del payload] → El schema del contrato es una lista; si el backend rechaza campos del payload actual, el reporte lo exhibirá en la siguiente corrida y el ajuste es local a ese helper.

## Migration Plan

1. Agregar `scripts/api-sync.mjs`, `scripts/openapi-gaps.json` (con los 3 gaps registrados) y el script `api:sync` en `package.json`.
2. Ejecutar `pnpm api:sync` la primera vez: genera `docs/openapi.json` y `docs/openapi-report.md`; verificar que el reporte clasifica `frontend-logs/update` como desalineación y los 3 gaps registrados.
3. Corregir `src/helpers/frontend.logs.js` y re-ejecutar: la desalineación desaparece del reporte.
4. Documentar el comando y la convención (`AGENTS.md`, `CHANGELOG.md`).
5. Rollback: revertir el commit; la corrección del helper es un cambio de una línea y la copia versionada es solo artefacto.

## Open Questions

<!-- Ninguna: la estrategia de gaps (conservar código y registrar), la ubicación de la copia y la ausencia de CI quedaron decididas con el usuario en la fase de propuesta. -->
