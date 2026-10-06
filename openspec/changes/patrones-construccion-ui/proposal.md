# Proposal

## Why

Cuando se pide crear una sección nueva, modificar una existente o añadir un elemento/componente, no existe un contrato único que obligue a seguir los patrones estructurales de la aplicación: `design-system` cubre lo visual (tokens, tipografía, iconografía,
BEM) y `routing` cubre las rutas, pero sus requirements de alta/edición nombran textualmente solo proveedores, unidades y contratos. La ubicación `views/` vs `partials/`, la anatomía del componente, la reutilización de los parciales compartidos, la composición
por capas SASS y el registro en la navegación lateral quedan hoy como costumbre no escrita. Al capturarlos como specs, toda petición futura de sección/modificación/componente tiene un contrato que el flujo apply puede verificar.

## What Changes

- Capability nueva `ui-construction` que establece los patrones de construcción de la UI: ubicación por rol (secciones en `views/` organizadas por módulo, elementos reutilizables en `partials/`), anatomía del componente (`<script setup>` + template + estilos
  sass scoped con `@use` de las capas que consumen), reutilización de los parciales compartidos (sidebar, content_header, notificaciones, popups, confirmación, carga, paginación, opciones de resultado, ayuda) antes de crear equivalentes, composición por capas
  SASS (settings = únicos tokens, objects = botones/formularios reutilizables, components = estilos de componentes, base = raíz) y registro de una sección nueva en el sidebar con enlaces por nombre de ruta.
- `routing` recibe un requisito nuevo que generaliza el patrón de rutas a toda sección futura con CRUD: listado en `/seccion`, alta en `/seccion/nuevo`, edición en `/seccion/:id` y nombre de ruta camelCase del módulo, con `meta.login` como el resto de la
  aplicación. Los requirements existentes de `routing` no cambian.
- `design-system` no se modifica: su requisito de superficies nuevas ya obliga a reutilizar tokens, tipografía e iconografía; cubrirlo de nuevo duplicaría el contrato.
- Sin cambios de código: es una captura retrospectiva de los patrones que la aplicación ya sigue. Si la verificación de tareas encuentra componentes que los violan, se anotan como hallazgos para un cambio posterior.

## Capabilities

### New Capabilities

- `ui-construction`: patrones estructurales para crear o modificar secciones y componentes: ubicación por rol, anatomía del componente, reutilización de parciales compartidos, composición por capas SASS y registro de secciones en la navegación lateral.

### Modified Capabilities

- `routing`: se agrega el patrón de rutas de nuevas secciones CRUD (listado, alta, edición, nombre de ruta camelCase); los requisitos existentes se conservan intactos.

## Impact

- **Specs**: 1 delta nuevo (`ui-construction`) + 1 delta modificado (`routing`, sección `ADDED`), sincronizados a `openspec/specs/` al archivar.
- **Documentación**: `AGENTS.md` (la tabla de capabilities y la convención de componentes deben listar la capability nueva y apuntarla en lugar de documentación retirada), `CHANGELOG.md`.
- **Código**: sin cambios.
- **Sistemas afectados**: todo pedido futuro de sección/modificación/componente se evalúa contra `ui-construction` + `design-system` + `routing` en el flujo apply.
