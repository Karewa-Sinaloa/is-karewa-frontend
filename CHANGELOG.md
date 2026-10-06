# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [Unreleased]

### Agregado

- Script `scripts/api-sync.mjs` (`pnpm api:sync`) — Descarga el contrato OpenAPI publicado, guarda su copia versionada en `docs/openapi.json` y genera `docs/openapi-report.md` clasificando cada módulo como conforme, desalineación de código, gap de contrato
  (manifest `scripts/openapi-gaps.json`) o no resoluble estáticamente; la variable opcional `OPENAPI_URL` permite fijar otro origen.
- Componente `periodos.vue` — Gestión inline de periodos de contratos con listado, popup de alta/edición y eliminación.
- Componente `periodos_view.vue` — Formulario para crear o editar periodos de contratos.
- Dependencia `@vueuse/core` — Soporte para formatear fechas en el listado de contratos.

### Modificado

- `src/helpers/frontend.logs.js` — El módulo de la petición pasa de `frontend-logs/update` a `frontend-logs` para resolver en el endpoint documentado `POST /frontend-logs` (alineación detectada por `pnpm api:sync`; sin cambio de comportamiento visible).
- `dash.vue` — Añadido el panel `Periodos de contratos` al dashboard de configuración de contratos.
- `contract_list.vue` — El listado ahora consume el módulo `contracts`, muestra el identificador del contrato y enlaza a la vista `contractView`.
- `contract_list.vue` — El listado ahora se presenta en una tabla con columnas de proveedor, unidades administrativas, materia, procedimiento, administración, estado, descripción, fecha y tipo; además solicita paginación embebida y ordena por fecha de contrato
  descendente.
- `contract_view.vue` — La vista dejó de reutilizar el formulario de unidades administrativas y ahora administra contratos con campos específicos, carga de procedimientos y operaciones CRUD contra el módulo `contracts`.
- `router/index.js` — La ruta de contratos ahora usa el patrón paginado `/contratos/p/:page` y redirige `/contratos` a la primera página.
- `sidebar.vue` — El menú de contratos actualiza el enlace del listado para incluir la página inicial y el acceso de creación para dirigir al formulario de contratos.
- `_results.sass` y `_section.sass` — Añadidos estilos para tablas de resultados con desplazamiento horizontal y mejor aprovechamiento del ancho disponible.
- `proveedores/list.vue` y `proveedores/view.vue` — Se eliminó el campo `shortname` del formulario y de la tarjeta de resultados de proveedores.

### Corregido

- `periodos.vue` — La eliminación de periodos ahora envía el `id` seleccionado correctamente al endpoint.
- `sidebar.vue` — Corregido el enlace "Crear nuevo" de Contratos para abrir `contractCreate` en lugar de la vista de unidades administrativas.
- `pagination.vue` — Eliminado un `console.log` residual del componente de paginación.

### Documentación

- `openspec/changes/mejoras-frontend` — Capacidades nuevas y requisitos agregados (solo specs, sin cambios de código): `accessibility` (idioma del documento, nombres accesibles, diálogos anunciados, teclado y foco, texto alternativo) y `code-quality` (lint
  ejecutable, sin `console.log` en producción, dependencias y archivos sin uso); `performance` suma code-splitting por ruta e invalidación de artefactos tras despliegue y `routing` exige página en la ruta de todo listado paginado.
- `openspec/changes/mejoras-seguridad` — Requisitos de seguridad agregados (solo specs, sin cambios de código): envío único sin doble envío y validación de archivos antes de subir en `form-validation`, autocompletado seguro de credenciales (`autocomplete`) en
  `authentication`, ayuda del servidor mostrada como texto en `app-store` y archivos de entorno no versionados en `code-quality`; las brechas spec↔código quedan registradas en `design.md`.
- `SPEC.md` — Archivo retirado; el comportamiento del sistema queda especificado canónicamente en `openspec/specs/` (una spec por capability con requirements y escenarios).
- `openspec/specs/ui-construction/spec.md` — Capability nueva `ui-construction`: patrones de construcción de la UI (ubicación `views/` vs `partials/`, anatomía del componente, reutilización de parciales compartidos, composición por capas SASS y registro de
  secciones en la navegación).
- `openspec/specs/routing/spec.md` — Nuevo requisito "Rutas de nuevas secciones con CRUD": listado en `/seccion`, alta en `/seccion/nuevo`, edición en `/seccion/:id` con nombre de ruta camelCase y `meta.login`.
- `AGENTS.md` — La tabla de capabilities y la convención de componentes ahora referencian `ui-construction`.

## [1.1.0] - 2026-04-08

### Agregado

- Componente `contract_list.vue` — Listado de contratos registrados en el sistema con paginación y opciones de resultado.
- Componente `contract_view.vue` — Vista de detalle y formulario para crear o editar un contrato.
- Componente `estatus.vue` — Gestión de estatus de contratos (listar, crear, editar, eliminar) con popup inline.
- Componente `estatus_view.vue` — Formulario de creación/edición de estatus de contrato (validación con Yup/vee-validate).
- Componente `tipo.vue` — Gestión de tipos de contratos con popup inline.
- Componente `tipo_view.vue` — Formulario de creación/edición de tipo de contrato.
- Componente `unit_types.vue` — Gestión de tipos de unidad administrativa vinculados a contratos.
- Componente `unit_types_view.vue` — Formulario de creación/edición de tipo de unidad administrativa.
- Nuevas rutas en el router: `/contratos` (`contractList`), `/contratos/nuevo` (`contractCreate`), `/contratos/:id` (`contractView`).
- Clase SASS `main__dash-grid` con layout de 2 columnas (`columns: 2`) y `break-inside: avoid` para el dashboard de contratos.

### Modificado

- `dash.vue` — El dashboard de contratos ahora renderiza los paneles de configuración (procedimientos, materia, estatus, tipo, tipos de unidad) dentro de un grid de 2 columnas (`main__dash-grid`).
- `materia.vue` — Actualizados el título (`Materia o asunto de los contratos`) y el texto de ayuda de la sección.
- `procedimientos.vue` — Actualizado el título a `Procedimientos de contratos` y el texto de ayuda de la sección.
- `sidebar.vue` — El enlace "Todos" del menú de Contratos ahora apunta a la ruta `contractList`.
- `_section.sass` — Añadidas propiedades `margin-bottom: 1.5rem` y `break-inside: avoid` al componente `.section`; eliminada la propiedad `width: 49%` del modificador `--wide`.
- `_base.sass` — Añadidos estilos para `.main__dash-grid` con layout de columnas múltiples.
