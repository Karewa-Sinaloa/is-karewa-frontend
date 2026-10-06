# Proposal

## Why

`AGENTS.md` (248 líneas) describe comportamiento verificable —rutas, sesión, cliente HTTP, catálogo de errores, validación de formularios y configuración de contratos— como prosa que se desincroniza y que además duplica casi por completo `SPEC.md`. Con
`design-system` ya capturado, el resto del comportamiento base del frontend no tiene contrato en `openspec/specs/`, así que cada decisión depende de releer código. Capturar ese comportamiento como capabilities permite, además, reducir `AGENTS.md` a un índice
que apunte a las especificaciones.

## What Changes

- 6 capabilities nuevas que formalizan el comportamiento base ya existente: `routing`, `authentication`, `api-client`, `error-handling`, `form-validation` y `contracts-configuration`.
- `AGENTS.md` se reescribe como índice ligero (~70 líneas): comandos esenciales, sección de Especificaciones (OpenSpec), convenciones mínimas y mapa de documentación.
- `openspec/config.yaml` recibe un `context:` con stack, convenciones y mapa de módulos, para que todo `openspec new change` herede ese contexto.
- Sin cambios de código: es una captura retrospectiva del comportamiento actual.

## Capabilities

### New Capabilities

- `routing`: rutas de la aplicación, protección por sesión, redirecciones de landing y navegación con scroll al inicio.
- `authentication`: inicio de sesión, persistencia y vigencia del token, roles válidos, cierre de sesión y sesión terminada por el servidor.
- `api-client`: operaciones del cliente HTTP, autenticación automática, estado de carga global, cierre de sesión en 401 y errores normalizados.
- `error-handling`: traducción de códigos del servidor a mensajes mostrables, con fallback genérico y tipos de notificación.
- `form-validation`: validación en cliente antes del envío, mensajes en español y errores de servidor aplicados por campo.
- `contracts-configuration`: dashboard con los 6 submódulos CRUD de configuración de contratos y su uso en el formulario de contrato.

### Modified Capabilities

<!-- Ninguna: `design-system` existe y su comportamiento no cambia en este cambio. -->

## Impact

- **Archivos nuevos**: 6 deltas en `openspec/changes/especificar-comportamiento-base/specs/<capability>/spec.md` y su sincronización posterior a `openspec/specs/`.
- **Documentación**: `AGENTS.md` (reescritura a índice), `openspec/config.yaml` (contexto). `SPEC.md` sigue intacto (decisión tomada en `capturar-sistema-diseno`).
- **Código**: sin cambios.
- **Sistemas afectados**: futuro mantenimiento del CMS (rutas, sesión, API) y cualquier adecuación que deba consultar el contrato de comportamiento en lugar de releer código.
