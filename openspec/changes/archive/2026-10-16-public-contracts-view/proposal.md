# Proposal

## Why

La ruta pública `/contratos` ya existe, pero su vista está vacía; por ello, las personas no pueden consultar de manera directa los contratos ni acotar y comparar resultados. Esta propuesta define una experiencia pública de consulta con filtros, búsqueda, totales del servidor, listado paginado y acceso a una ficha de solo lectura.

## What Changes

- Completar la vista pública de contratos con encabezado y filtros reutilizados de la portada, además de búsqueda libre compatible con el contrato de la API.
- Mostrar tarjetas de monto total y montos por procedimiento, actualizadas según la consulta vigente mediante los totales entregados por el backend.
- Mostrar el listado en tabla responsiva, sin acciones administrativas, con navegación a una ficha pública de solo lectura.
- Definir paginación del servidor con tamaños 12, 24, 48 y 96, conteo total de resultados, estados de carga, vacío y error.
- Mantener consistencia visual con el shell público y los tokens compartidos.
- No filtrar contratos por estatus de “firmado” ni usarlo como filtro o término de búsqueda. El listado omite el estatus, mientras que la ficha muestra todos los campos que devuelva el API, incluido el estatus si está presente.
- Dejar el botón de descarga como elemento visual sin funcionalidad en este alcance.

## Capabilities

### New Capabilities
- `public-contracts`: Consulta pública de contratos, filtros, búsqueda, tarjetas agregadas, tabla paginada y ficha de solo lectura.

### Modified Capabilities

Ninguna. La vista pública de contratos añade un flujo específico sin cambiar los requisitos existentes de navegación pública, shell, contratos administrativos o portada.

## Impact

- Vista existente `src/components/views/public/contracts.vue` y rutas públicas en `src/router/index.js`; se requiere una ficha pública de contrato de solo lectura.
- Reutilización de `chart-filters-bar` y de catálogos/contratos de `GET /contracts`; búsqueda mediante `search`, paginación y totales mediante `embed=pagination,totals`.
- El contrato OpenAPI `docs/openapi.json` documenta `totals.total_amount`, `totals.by_procedure` y `totals.results` calculados sobre el conjunto filtrado completo, independiente de la página.
- La API pública no documenta semántica de firma ni búsqueda libre por estatus; ambas quedan fuera por decisión de alcance. La ficha de detalle presenta sin filtrar las propiedades del objeto del contrato, incluido el estatus cuando la API lo devuelve. El botón de descarga no solicita endpoint ni flujo de exportación.
