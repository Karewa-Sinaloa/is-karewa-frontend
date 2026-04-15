# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [Unreleased]

### Agregado

- Componente `periodos.vue` — Gestión inline de periodos de contratos con listado, popup de alta/edición y eliminación.
- Componente `periodos_view.vue` — Formulario para crear o editar periodos de contratos.

### Modificado

- `dash.vue` — Añadido el panel `Periodos de contratos` al dashboard de configuración de contratos.
- `contract_list.vue` — El listado ahora consume el módulo `contracts`, muestra el identificador del contrato y enlaza a la vista `contractView`.

### Corregido

- `periodos.vue` — La eliminación de periodos ahora envía el `id` seleccionado correctamente al endpoint.

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
