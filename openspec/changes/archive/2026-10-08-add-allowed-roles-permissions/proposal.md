# Proposal

## Why

La API ya publica `allowed_roles` en sus respuestas autenticadas (51 de 89 operaciones del contrato vigente), pero el frontend lo ignora: cualquier usuario con sesión ve y puede pulsar los botones de crear, editar y borrar en todas las secciones, incluidas las
que su rol no está autorizado a tocar. El servidor rechaza después la operación, lo que deja al usuario con un error inesperado en lugar de una indicación clara de que su rol no tiene ese permiso.

## What Changes

- `pnpm api:sync` para actualizar la copia versionada del contrato con `allowed_roles` y refrescar el reporte de divergencias.
- El cliente HTTP captura `allowed_roles` de cada respuesta autenticada y lo entrega al store.
- El store único pasa a exponer los permisos por sección y una evaluación de "¿puede el rol actual esta acción?" para `create`, `edit` y `delete`.
- Se ocultan los controles de crear, editar y borrar en las secciones donde el rol actual no está autorizado (FAB de alta, botones de cabecera, menú contextual de resultados, enlaces de alta del sidebar y botones "Crear nuevo" de las tarjetas de
  configuración).
- Bajo el título de cada sección/tarjeta afectada se muestra un aviso con el color `--color-danger` de la paleta indicando que el usuario solo tiene ciertos permisos.
- Cuando una sección aún no ha recibido `allowed_roles`, se comporta como hoy: sin aviso y con los controles visibles (fail-open). Cubre las respuestas que no son de un módulo CRUD (login, logout, recuperación) y cualquier hueco que el contrato deje de
  declarar.
- **BREAKING (solo si el backend lo cambia):** si el servidor pasara a omitir `allowed_roles` en respuestas que hoy lo traen, las secciones dejarían de restringirse. No cambia ninguna ruta ni payload enviado por el frontend.

## Capabilities

### New Capabilities

- `role-permissions`: captura, persistencia y evaluación por sección de los permisos que declara `allowed_roles`, y su traducción en la interfaz (ocultación de acciones de escritura y aviso de permisos bajo el título).

### Modified Capabilities

- `api-client`: nuevo requirement sobre la extracción de `allowed_roles` de las respuestas autenticadas y su entrega al store, exista o no el campo.
- `app-store`: la acción de alta contextual deja de mostrarse cuando el rol de la sesión no está autorizado a crear en el módulo registrado.

## Impact

- **Código:** `src/api/requests.js` (extracción), `src/store/index.js` (estado, getters, persistencia), `src/helpers/set.session.js` (hidratación/limpieza al cerrar sesión), `src/components/partials/result_options.vue`,
  `src/components/partials/add_new_element.vue`, `src/components/partials/sidebar.vue` y las vistas con `.section__top` de `proveedores/`, `admin_units/`, `contracts/`, `organization.vue` y `configuracion/` (ocultación de acciones + aviso).
- **Estilos:** `src/assets/sass/components/_section.sass` (modificador BEM del aviso) usando el token existente `--color-danger`.
- **Contrato:** `docs/openapi.json` y `docs/openapi-report.md` se regeneran con `pnpm api:sync`.
- **Sin dependencias nuevas**, sin cambios de rutas, sin cambios de payload hacia el servidor.
- **Riesgo principal:** la cobertura de `allowed_roles` depende del contrato y puede retroceder —hoy declara 81 de 89 operaciones, incluidos todos los GET de los 14 módulos CRUD que consume el frontend—; el comportamiento elegido —fail-open— hace que cualquier
  hueco sea indistinguible del actual y no rompa la interfaz.
