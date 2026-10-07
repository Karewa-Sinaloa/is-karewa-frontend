# Tasks

## 1. Rutas y navegación

- [x] 1.1 Declarar en `src/router/index.js` las cuatro rutas de la sección —redirect de `/configuracion` a `/configuracion/p/1`, `/configuracion/p/:page` (`configuracionView`), `/configuracion/usuarios/nuevo` (`configuracionUsuariosCreate`) y
      `/configuracion/usuarios/:id` (`configuracionUsuariosView`)— con `meta.login: true`. Verificación: las cuatro rutas aparecen en el arreglo con su nombre y su `meta`, y el guard existente las protege igual que al resto (lectura de `src/router/index.js`).
- [x] 1.2 Convertir el botón de configuración del pie del sidebar en un `router-link` hacia `configuracionView`, conservando `title`, `aria-label` y las reglas de estilo `sidebar__footer-button`. Verificación: el icono del pie navega por nombre de ruta al
      dashboard y mantiene su nombre accesible (lectura de `src/components/partials/sidebar.vue`).

## 2. Dashboard y tarjetas

- [x] 2.1 Crear `src/components/views/configuracion/dash.vue` con `sidebar-component`, `content-header` y el grid `main__dash-grid` que aloja las tarjetas de usuarios y roles, declarando con `@use` las capas `_section.sass`, `_results.sass` y `_widgets.sass`.
      Verificación: `pnpm build` compila y la vista compone ambas tarjetas dentro del layout compartido.
- [x] 2.2 Crear `src/components/views/configuracion/usuarios.vue` que consulta `GET /users` con `page`, `limit=10`, `embed=pagination` y `sort=first_name`, y pinta cada fila con nombre completo y correo más `result-options` de ver, editar y borrar.
      Verificación: los escenarios "Ver o editar" y "Más de diez usuarios" de la spec quedan respaldados por el componente (lectura contra `openspec/changes/general-configuration/specs/general-configuration/spec.md`).
- [x] 2.3 Conectar la paginación con `pagination-container` usando `module="configuracionView"` y recargar el listado cuando cambia `route.params.page`. Verificación: con más de diez usuarios se muestra el control, y cambiar de página actualiza las filas sin
      salir del dashboard.
- [x] 2.4 Integrar `confirmation-popup` para el borrado, quitar la fila cuando el servidor acepta y emitir `store.push_alert` tanto en éxito como en error. Verificación: los escenarios "Baja aceptada" y "Baja rechazada" quedan respaldados por el componente.
- [x] 2.5 Agregar la acción "Agregar usuario" en el encabezado de la tarjeta, visible también en el estado vacío, enlazando por nombre a `configuracionUsuariosCreate`, y cubrir los estados de carga, vacío y error del listado. Verificación: los escenarios
      "Acción de alta", "Tarjeta sin usuarios" y "Error del servidor al listar" quedan respaldados por el componente.
- [x] 2.6 Crear `src/components/views/configuracion/roles.vue` que lista `GET /roles`, ofrece "Crear nuevo rol" en su encabezado y en el estado vacío, y da en cada fila `result-options` con `{pop, delete}` más `confirmation-popup`, abriendo el popup con
      `section-popup-slot`. Verificación: los escenarios de la requirement "Tarjeta de roles" quedan respaldados por el componente.
- [x] 2.7 Crear `src/components/views/configuracion/roles_view.vue`, formulario popup de rol (`name`) que con `id = 'new'` crea con `POST /roles` y con un id existente consulta con `GET /roles/{id}` y actualiza con `PUT /roles/{id}`, emitiendo `changed` y
      `close`. Verificación: los escenarios "Acción de alta", "Ver o editar un rol" y "Rol guardado" quedan respaldados por el componente.

## 3. Ficha de usuario

- [x] 3.1 Crear `src/components/views/configuracion/usuario_view.vue` que resuelve alta y ficha según el nombre de ruta, consulta `GET /users/{id}`, inicia en modo solo lectura y pasa a edición con el botón o con `?edit=true`. Verificación: los escenarios
      "Consulta", "Edición" y "Registro sin identificador válido" quedan respaldados por la vista.
- [x] 3.2 Construir el formulario con identidad (`first_name`, `middle_name`, `last_name`, `second_last_name`), `email`, `phone`, contraseña con repetición, selector de rol desde `GET /roles` y selector de estatus 1 = Activo / 2 = Inactivo, validado con Yup y
      mensajes en español por campo. Verificación: los escenarios "Roles disponibles", "Catálogo de roles sin entradas", "Estatus de usuario" y "Formulario inválido" quedan respaldados por la vista.
- [x] 3.3 Enviar el alta con `POST /users` y la edición con `PUT /users/{id}`, incluyendo la contraseña solo cuando el campo tiene valor, mostrar `store.push_alert` y navegar a la ficha creada tras el alta. Verificación: los escenarios "Alta exitosa",
      "Guardado de la edición" y "Contraseña sin cambiar" quedan respaldados por la vista.
- [x] 3.4 Integrar la baja desde la ficha con `confirmation-popup` y, al aceptar, `DELETE /users/{id}` seguido de la vuelta al dashboard con su alerta. Verificación: el escenario "Baja desde la ficha" queda respaldado por la vista.

## 4. Verificación integral

- [x] 4.1 Ejecutar `pnpm build` y confirmar que termina sin errores. Verificación: salida del build en 0.
- [x] 4.2 Ejecutar `openspec validate --all` y confirmar que todos los specs y el change pasan. Verificación: totals con 0 fallas.
- [x] 4.3 Ejecutar `pnpm api:sync` y confirmar que el reporte no agrega desalineaciones de código por los nuevos módulos `users` y `roles`. Verificación: "Desalineaciones de código: Ninguna desalineación de código pendiente".
- [x] 4.4 Leer los requirements de `general-configuration`, `routing` y `ui-construction` contra el código final y confirmar que cada escenario WHEN/THEN tiene respaldo observable. Verificación: lista de escenarios cotejada sin faltantes.
