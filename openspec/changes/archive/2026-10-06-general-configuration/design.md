# Design

## Context

La app es una SPA Vue 3 con router protegido por sesión; los módulos existentes sigen un patrón repetido: vista en `src/components/views/<modulo>/` compuesta por `sidebar-component` + `content-header` + una `section`, listados con `result-options`
(ver/editar/eliminar), confirmaciones con `confirmation-popup` y paginación con `pagination-container`. La configuración de contratos ya demuestra el patrón de dashboard de tarjetas (`contracts/dash.vue` + `main__dash-grid`). El footer del sidebar tiene un
botón de configuración sin acción y el contrato OpenAPI ya documenta `/users` y `/roles` (ver proposal.md).

## Goals / Non-Goals

**Goals:**

- Reutilizar los parciales y el patrón visual existentes sin crear componentes equivalentes nuevos.
- Dejar la sección preparada para agregar más tarjetas de configuración sin tocar las rutas de usuarios.
- Mantener el contrato como fuente de campos: lo que no declare el OpenAPI no se envía.

**Non-Goals:**

- Administración del catálogo de estatus de usuarios (no declara endpoint; el selector usa los valores 1 y 2 acordados).
- Cambios en la configuración de contratos, en el listado de contratos o en el resto de secciones.
- Recuperación de contraseña, verificación de correo u otros flujos del módulo de acceso.

## Decisions

1. **Dashboard en `src/components/views/configuracion/` con cinco componentes** — `dash.vue` (composición, patrón de `contracts/dash.vue`), `usuarios.vue` y `roles.vue` (tarjetas), `usuario_view.vue` (alta/consulta/edición en ruta, patrón de
   `admin_units/view.vue` que resuelve el modo según el nombre de ruta) y `roles_view.vue` (formulario en popup, patrón de `contracts/estatus_view.vue`). Alternativa descartada: una sola vista con todo inline, que no deja crecer el dashboard con más tarjetas.

2. **Paginación con el segmento de página en la ruta del dashboard** — `/configuracion/p/:page` con redirect desde `/configuracion`, `limit=10` y `embed=pagination`, y `pagination-container` apuntando por nombre a `configuracionView`. Alternativa descartada:
   página en estado interno del componente, que violaría el requerimiento de `routing` "Toda ruta de listado paginado expone la página".

3. **Rutas de usuarios como sub-recurso de la sección** — `/configuracion/usuarios/nuevo` y `/configuracion/usuarios/:id` con nombres `configuracionUsuariosCreate` y `configuracionUsuariosView`. El alta vive en la tarjeta (no como ruta de la sección) porque el
   listado es una tarjeta, no una ruta propia; el enlace de alta resuelve por nombre de ruta.

4. **Modos de `usuario_view.vue` en un solo componente** — alta y ficha comparten formulario; el modo sale del nombre de ruta y `?edit=true` arranca en edición. La contraseña se agrega al payload solo si el campo no está vacío, para no sobreescribirla con un
   string vacío en `PUT /users/{id}`.

5. **Catálogos del formulario** — `role_id` desde `GET /roles`; `status_id` con las opciones fijas 1 = Activo y 2 = Inactivo, porque el contrato exige `minimum: 1` y no declara el catálogo `users_status`. Si `GET /roles` falla o viene vacío, se conserva el
   default 5 del contrato y se emite la alerta.

6. **Estilos por capas, sin tokens nuevos** — el dashboard declara `@use` de `_section.sass`, `_results.sass` y `_widgets.sass`; la ficha usa `_section.sass`. No se agregan colores, tamaños ni breakpoints (spec `design-system`).

7. **Footer del sidebar como `router-link`** — se conservan `title`, `aria-label` y las reglas de `sidebar__footer-button`; solo cambia el elemento que envuelve el icono, para que la navegación resuelva por nombre de ruta.

8. **Roles con CRUD en popup, sin rutas propias** — la tarjeta de roles reusa `result-options` con `{pop, delete}`, `section-popup-slot` y `confirmation-popup`, igual que los submódulos de `contracts-configuration`: el popup de `roles_view.vue` sirve a la vez
   para ver, editar y dar de alta (`id = 'new'`), y emite `changed` para que la tarjeta recargue. Alternativa descartada: rutas `/configuracion/roles/...`, que contradice el patrón de popup pedido para este catálogo.

## Risks / Trade-offs

- [El listado de `GET /users` documenta `data: []` sin ejemplo de fila] → se muestran los campos que sí documenta la ficha (`first_name`, `middle_name`, `last_name`, `second_last_name`, `email`) y se ajusta contra la respuesta real durante la verificación.
- [El valor 2 de `status_id` no está en el catálogo del contrato] → es una aproximación acordada; cuando el backend declare `users_status` se reemplaza el select fijo por el catálogo.
- [El segmento `:page` pertenece al dashboard completo] → solo la tarjeta de usuarios pagina; con una segunda tarjeta no paginada no hay ambigüedad, y al agregar otra tarjeta paginada habrá que definir un segmento por tarjeta.
- [Borrar un rol que aún referencia algún usuario] → el servidor rechaza la baja y la tarjeta muestra la alerta con el código, sin retirar la fila.
- [`phone` es `integer` en el esquema pero el ejemplo lo devuelve como texto] → el campo se captura como teléfono, se valida como numérico de 10 a 20 dígitos y se envía como número.

## Migration Plan

Sección nueva y ruta nueva: no hay migración ni cambio compatible que destruir. El rollback es retirar las rutas y los componentes agregados; el footer del sidebar vuelve a ser un botón sin acción.

## Open Questions

Ninguno: el catálogo de estatus, los campos del formulario, la paginación y el punto de entrada (icono del footer) quedaron definidos con el usuario y con el contrato OpenAPI sincronizado.
