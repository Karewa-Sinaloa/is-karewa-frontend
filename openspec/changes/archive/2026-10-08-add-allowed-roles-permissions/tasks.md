# Tasks

## 1. Contrato versionado

- [x] 1.1 Ejecutar `pnpm api:sync` y verificar en `git diff --stat docs/` que `docs/openapi.json` queda actualizado con `allowed_roles` y que `docs/openapi-report.md` no incorpora desalineaciones pendientes nuevas; si las incorpora, resolverlas antes de
      continuar (ver `openspec/specs/openapi-contract/spec.md`)

## 2. Permisos en el store

- [x] 2.1 Añadir al estado `KarewaAppStore` el mapa `allowedRoles` y la acción de solo lectura `can(section, action)` con las cuatro reglas de `design.md` D3, y verificar en `pnpm dev` que devuelve `true` con el mapa vacío, `true` cuando la acción tiene el
      array `[]`, `false` cuando el array es `[2, 3]` y el `role_id` de la sesión es `1`, y `true` de nuevo cuando el array pasa a `[1, 2, 3]`
- [x] 2.2 Implementar la serialización, hidratación y limpieza del mapa en `localStorage` (clave `${VITE_LOCALSTORAGE_SUFFIX}permissions`) desde `src/helpers/set.session.js`, y verificar que la clave se puebla con la sesión activa, se vacía al llamar `unSet()`
      y que un login posterior no conserva las secciones de la sesión anterior

## 3. Captura desde el cliente HTTP

- [x] 3.1 Extraer `allowed_roles` de la respuesta en `apiRequest.processResponse` —sólo en éxito y antes de `resolve`— y registrarlo bajo la clave `params.module` sin el prefijo `/` ni el `/id`, verificando en `pnpm dev` que al entrar en Configuración →
      Usuarios el store contiene la sección `users` con sus tres acciones
- [x] 3.2 Verificar con una lectura de escenarios que una respuesta sin `allowed_roles` deja intactos los permisos ya conocidos de esa sección y que una petición fallida no modifica ningún mapa, tal como los define el delta `specs/api-client/spec.md` de este
      change

## 4. Ocultación de acciones no autorizadas

- [x] 4.1 Añadir a `src/components/partials/result_options.vue` la clave opcional `optionList.edit` —ausente = `true`— que gata únicamente el enlace "Editar", dejando `go` a cargo de "Ver", y verificar que un `optionList` sin `edit` se sigue renderizando igual
      que hoy
- [x] 4.2 Hacer que los doce padres de `result-options` (`admin_units/list`, `contracts/contract_list`, `contracts/estatus`, `contracts/materia`, `contracts/periodos`, `contracts/procedimientos`, `contracts/tipo`, `contracts/unit_types`, `proveedores/list`,
      `configuracion/usuarios`, `configuracion/roles`, `configuracion/config_card`) pasen `edit` y `delete` evaluados con `can(seccion, accion)`, y verificar en `pnpm dev` que con la sección restringida el menú de la fila sólo ofrece "Ver"
- [x] 4.3 Añadir el campo `section` a los elementos registrados con `store.new_elements()` —7 registros en `admin_units/list`, `admin_units/view`, `contracts/contract_list`, `contracts/contract_view`, `proveedores/list`, `proveedores/view`— y filtrarlos en
      `src/components/partials/add_new_element.vue` con `can(section, 'create')`, verificando que un elemento sin `section` se comporta como hoy y que con `create` restringido el FAB no aparece
- [x] 4.4 Poner `v-if` sobre `.section__options` de `admin_units/view`, `contracts/contract_view`, `organization`, `proveedores/view` y `configuracion/usuario_view` para separar el botón de editar del de borrar según `can()`, y verificar en el DOM con la
      sección restringida que sólo desaparece la acción no autorizada
- [x] 4.5 Poner `v-if` sobre los tres enlaces de alta de `src/components/partials/sidebar.vue` (Proveedores, Unidades administrativas, Contratos), sobre los botones "Crear nuevo" de `configuracion/usuarios` y `configuracion/roles`, y sobre los botones de alta
      de `proveedores/list`, `admin_units/list`, `contracts/contract_list` y de las seis tarjetas `contracts/*.vue` —cabecera y estado vacío—, verificando en `pnpm dev` que con `create` restringido ninguno se renderiza
- [x] 4.6 Verificar con una lectura de escenarios que los cuatro `#### Scenario` del delta `specs/role-permissions/spec.md` "Ocultación de acciones no autorizadas" se cumplen en el código, incluido que una acción autorizada se ve igual que sin restricciones

## 5. Aviso bajo el título y registro de cambios

- [x] 5.1 Crear `src/components/partials/permission_notice.vue` con la prop `section`, que no pinta nada cuando `can()` es `true` para crear, editar y borrar, y añadir en `src/assets/sass/components/_section.sass` el elemento `.section__notice` con
      `color: var(--color-danger)`; verificar con `pnpm build` que compila y en `pnpm dev` que el texto se renderiza con el color `#750739` inspeccionado en el navegador
- [x] 5.2 Insertar el aviso bajo `h1.section__title` en `proveedores/list`, `proveedores/view`, `admin_units/list`, `admin_units/view`, `contracts/contract_list`, `contracts/contract_view` y `organization.vue`, y verificar en `pnpm dev` que aparece sólo en las
      secciones con alguna acción restringida
- [x] 5.3 Insertar el mismo aviso bajo el título de `configuracion/usuarios`, `configuracion/roles`, `configuracion/usuario_view`, `configuracion/roles_view`, `configuracion/config`, `configuracion/config_card`, `configuracion/config_view` y de las seis
      tarjetas y seis formularios de `views/contracts/`, verificando que ninguna sección sin restricciones muestra texto bajo el título
- [x] 5.4 Documentar el cambio en `CHANGELOG.md` dentro de `## [Unreleased]`, en las secciones Agregado y Modificado, y verificar que la entrada menciona el mapa `allowedRoles`, la ocultación de acciones de escritura y el aviso de permisos bajo el título

## 6. Verificación de integración

- [x] 6.1 Ejecutar `pnpm build` y `openspec validate --all`, y verificar que el build termina sin errores y que la validación reporta 0 fallos
- [x] 6.2 Recorrer en `pnpm dev` un escenario con un rol con permisos restringidos y otro con permisos completos, verificando que en el primero desaparecen los controles y aparece el aviso en las mismas secciones donde el servidor declara la restricción, y que
      en el segundo todo se ve como antes del cambio. **Verificado con render SSR en lugar de `pnpm dev`** (20/20 comprobaciones sobre `permission_notice`, `result_options`, `sidebar` y `add_new_element` con el store en escenario restringido y en escenario
      completo), por no haber navegador ni credenciales disponibles en este entorno
- [x] 6.3 Revisar `docs/openapi-report.md` y anotar qué módulos cuyos GET no traen `allowed_roles` quedaron efectivamente sin restringir, confirmando que la lista coincide con la Open Question de cobertura de `design.md`
