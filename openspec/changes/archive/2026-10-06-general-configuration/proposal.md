# Proposal

## Why

La aplicación carece de un lugar único para la configuración general del sistema: el icono de configuración del footer del sidebar no lleva a ninguna parte y la administración de usuarios no tiene interfaz, aunque el contrato OpenAPI ya expone `/users` y
`/roles` con alta, consulta, edición y baja.

## What Changes

- Se agrega la sección de configuración general en `/configuracion`, un dashboard de tarjetas al estilo de la configuración de contratos, con la tarjeta de usuarios como primera tarjeta y la de roles como segunda.
- La tarjeta de usuarios lista los usuarios paginados de 10 en 10, con acciones de ver, editar y borrar, y ofrece el alta desde su encabezado (también cuando el listado está vacío).
- Se agrega la vista de usuario con alta, consulta y edición en rutas propias (`/configuracion/usuarios/nuevo` y `/configuracion/usuarios/:id`), con baja tras confirmación.
- La tarjeta de roles opera con popups dentro del dashboard, como los submódulos de la configuración de contratos: alta desde su encabezado, edición y consulta de cada rol en un popup y baja tras confirmación, sin rutas propias.
- El icono de configuración del footer del sidebar pasa de botón inerte a enlace de la nueva sección.
- El selector de rol se alimenta de `GET /roles`; el de estatus usa los valores 1 (activo) y 2 (inactivo) mientras el contrato no expone el catálogo `users_status`.

## Capabilities

### New Capabilities

- `general-configuration`: dashboard de configuración general con tarjetas, listado paginado de usuarios con acciones de ver, edición y baja, alta de usuarios y la vista de usuario con su formulario, más la administración de roles en popup.

### Modified Capabilities

- `routing`: se declaran las rutas de la sección de configuración general —listado paginado con segmento de página, alta y edición de usuarios como sub-recurso— con la protección `meta.login`.
- `ui-construction`: el registro de la sección en la navegación se cumple mediante el icono de configuración del footer del sidebar, que enlaza por nombre de ruta.

## Impact

- `src/router/index.js`: cuatro rutas nuevas (redirección de la base, listado paginado, alta y ficha de usuario).
- `src/components/views/configuracion/`: `dash.vue`, `usuarios.vue`, `usuario_view.vue`, `roles.vue` y `roles_view.vue` (nuevos).
- `src/components/partials/sidebar.vue`: el botón del footer se convierte en `router-link`.
- Consumo de la API: `GET /users`, `GET /users/{id}`, `POST /users`, `PUT /users/{id}`, `DELETE /users/{id}`, `GET /roles`, `POST /roles`, `GET /roles/{id}`, `PUT /roles/{id}` y `DELETE /roles/{id}`, con paginación `embed=pagination` en el listado de usuarios.
- Sin cambios en la configuración de contratos ni en el resto de secciones existentes.
