# Proposal

## Why

`SPEC.md` (583 líneas) es documentación descriptiva que mezcla prosa de stack/estructura con comportamiento verificable; casi todo el comportamiento que sí importa ya está duplicado —a veces de forma desactualizada— en las 7 capabilities de `openspec/specs/`
(capturadas en los cambios archivados `capturar-sistema-diseno` y `especificar-comportamiento-base`). El archivo además afirma cosas que el código no cumple (lazy loading por ruta, filtros del listado de contratos, campos bancarios en proveedores, estadísticas
en Home, búsqueda con debounce), así que hoy es una fuente de verdad engañosa. El objetivo es retirarlo: cada afirmación de comportamiento pasa a su capability (fusionándose o corrigiéndose) y lo puramente descriptivo se descarta en favor de fuentes vivas
(`package.json`, `.env.example`, `README-docker.md`, `openspec/config.yaml`).

## What Changes

- `SPEC.md` se elimina del repositorio; sus referencias en `AGENTS.md` (§6, §8, §51) y en `openspec/config.yaml` (`context.documentación`) se actualizan para que apunten a `openspec/specs/` y a la documentación operativa restante.
- 7 capabilities nuevas capturan el comportamiento de módulos hoy sin contrato: proveedores, unidades administrativas, contratos (listado y formulario), organización, inicio, rendimiento transversal y estado global observable del store.
- `authentication` se amplía con los flujos de recuperación de contraseña, cambio con token, registro y verificación de correo (hoy solo descritos en `SPEC.md` §4.1).
- Afirmaciones de `SPEC.md` que el código no respalda se descartan (no se inventan requirements): lazy loading por ruta (imports estáticos en `router/index.js`), filtros y ordenamiento por columnas en el listado de contratos (solo `sort=-contract_date` sin UI
  de filtros), campos de domicilio/banco/estatus en proveedores (solo nombre, RFC y comentarios), jerarquía/tipo/responsable en unidades administrativas (solo nombre y comentarios), estadísticas y accesos rápidos en Home (solo widget de bienvenida), búsqueda
  con debounce (se consulta por cada tecla con mínimo 3 caracteres).
- Secciones puramente descriptivas (§1, §2/§17/§18 stack y versiones, §8/§9 estructura, §12 browsers, §14 entorno, §15 deployment, §16 testing) se eliminan sin reubicación: su fuente canónica ya existe en `package.json`, `.env.example`,
  `README-docker.md`/`DEV_ENV_MANUAL.md` y el `context` de `openspec/config.yaml`. §10 quedaba además obsoleto (`npm` en un proyecto `pnpm`).
- Sin cambios de código: es una captura retrospectiva y una depuración documental.

## Capabilities

### New Capabilities

- `providers`: alta, consulta, edición y baja de proveedores; listado paginado con búsqueda; campos reales del formulario (nombre, RFC, comentarios) y confirmación previa a la baja.
- `administrative-units`: alta, consulta, edición y baja de unidades administrativas; listado paginado con búsqueda; campos reales (nombre, comentarios) y confirmación previa a la baja.
- `contracts`: listado paginado de contratos ordenado por fecha descendente con opciones por fila, y formulario de alta/edición con entidades relacionadas (proveedor, unidad administrativa, valores de configuración) y borrado con confirmación.
- `organization`: consulta y actualización del perfil de la organización (nombre, nombre corto, correo de contacto y domicilio) con alertas de resultado.
- `home`: vista de inicio con el widget de bienvenida y su dependencia de los datos de la organización en el store.
- `performance`: paginación de listados en servidor (`page`/`limit`) y comportamiento transversal de búsqueda (mínimo 3 caracteres, sanitización de la cadena, resultados paginados).
- `app-store`: estado global compartido observable fuera de `authentication`/`error-handling`: notificaciones que se descartan solas, acción de alta contextual, popup global y ayuda contextual.

### Modified Capabilities

- `authentication`: se agregan los requisitos de los flujos de recuperación de contraseña (solicitud y cambio con token), registro de cuenta y verificación de correo, con captcha donde el flujo lo aplica y alerta de resultado en cada operación.

## Impact

- **Archivos eliminados**: `SPEC.md`.
- **Documentación**: `AGENTS.md` (referencias a secciones de SPEC.md), `openspec/config.yaml` (línea de documentación en `context`), `CHANGELOG.md`/`NOTES.md` si apuntan a secciones eliminadas.
- **Specs**: 6 deltas nuevos + 1 delta modificado (`authentication`), sincronizados a `openspec/specs/` al archivar.
- **Código**: sin cambios.
- **Sistemas afectados**: cualquier flujo futuro que cite `SPEC.md` debe citar ahora la capability correspondiente.
