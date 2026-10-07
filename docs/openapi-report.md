# Reporte de sincronización OpenAPI

- Contrato: https://kapi.chavodigital.com/api/docs/openapi.json
- Especificación: Monitor Karewa API 5.0.0 (OpenAPI 3.0.3)

## Resumen

- Módulos analizados: 80 llamadas, 20 módulos literales
- Conformes: 53
- Desalineaciones de código: 0 desalineaciones pendientes
- Gaps de contrato: 3
- No resolubles estáticamente: 3
- Gaps obsoletos: 0

## Desalineaciones de código

Ninguna desalineación de código pendiente.

## Gaps de contrato

Los siguientes elementos se clasifican como gap de contrato: el comportamiento del frontend se conserva y el backend debe documentarlo.

| Tipo | Módulo | Método | Campo | Path | Archivo | Motivo |
| --- | --- | --- | --- | --- | --- | --- |
| endpoint | `access/user-validation` | Post | — | /access/user-validation | src/components/partials/verification.vue | el backend debe documentarlo |
| endpoint | `organization` | Delete | — | /organization/{id} | src/components/views/organization.vue | el backend debe documentarlo |
| campo | `proveedores` | — | comments | — | src/components/views/proveedores/view.vue | el backend debe documentarlo |

## No resolubles estáticamente

Llamadas cuyo módulo llega por propiedades y quedan clasificadas como no resoluble estáticamente:

| Archivo | Línea | Expresión |
| --- | --- | --- |
| src/components/partials/drag_drop_file.vue | 45 | `props.module` |
| src/components/partials/input-autocomplete.vue | 88 | `props.requestParams.module` |
| src/components/partials/search.vue | 71 | `props.requestParams.module` |

## Módulos conformes

| Módulo | Método | Path | Sitios |
| --- | --- | --- | --- |
| access/login | Post | `/access/login` | src/components/partials/login.vue:53 |
| access/logout | Get | `/access/logout` | src/helpers/set.session.js:69 |
| access/recovery | Post | `/access/recovery` | src/components/partials/recovery.vue:44 |
| access/reset | Post | `/access/reset` | src/components/partials/reset.vue:51 |
| config | Get | `/config` | src/helpers/site.config.vue:12 |
| contracts | Delete | `/contracts` | src/components/views/contracts/contract_list.vue:173<br>src/components/views/contracts/contract_view.vue:1064 |
| contracts | Get | `/contracts` | src/components/views/contracts/contract_list.vue:148<br>src/components/views/contracts/contract_view.vue:1047 |
| contracts | Post | `/contracts` | src/components/views/contracts/contract_view.vue:1013 |
| contracts | Put | `/contracts` | src/components/views/contracts/contract_view.vue:1027 |
| estatus-contrato | Delete | `/estatus-contrato` | src/components/views/contracts/estatus.vue:94 |
| estatus-contrato | Get | `/estatus-contrato` | src/components/views/contracts/contract_view.vue:1136<br>src/components/views/contracts/estatus.vue:76<br>src/components/views/contracts/estatus_view.vue:84 |
| estatus-contrato | Post | `/estatus-contrato` | src/components/views/contracts/estatus_view.vue:61 |
| estatus-contrato | Put | `/estatus-contrato` | src/components/views/contracts/estatus_view.vue:71 |
| frontend-logs | Post | `/frontend-logs` | src/helpers/frontend.logs.js:5 |
| materias | Delete | `/materias` | src/components/views/contracts/materia.vue:94 |
| materias | Get | `/materias` | src/components/views/contracts/contract_view.vue:1095<br>src/components/views/contracts/materia.vue:76<br>src/components/views/contracts/materia_view.vue:84 |
| materias | Post | `/materias` | src/components/views/contracts/materia_view.vue:61 |
| materias | Put | `/materias` | src/components/views/contracts/materia_view.vue:71 |
| organization | Get | `/organization` | src/mixins/organization.js:8 |
| organization | Put | `/organization` | src/components/views/organization.vue:134 |
| partidas | Get | `/partidas` | src/components/views/contracts/contract_view.vue:1122 |
| periodos-contratos | Delete | `/periodos-contratos` | src/components/views/contracts/periodos.vue:139 |
| periodos-contratos | Get | `/periodos-contratos` | src/components/views/contracts/contract_view.vue:1109<br>src/components/views/contracts/periodos.vue:118<br>src/components/views/contracts/periodos_view.vue:126 |
| periodos-contratos | Post | `/periodos-contratos` | src/components/views/contracts/periodos_view.vue:93 |
| periodos-contratos | Put | `/periodos-contratos` | src/components/views/contracts/periodos_view.vue:107 |
| procedimientos | Delete | `/procedimientos` | src/components/views/contracts/procedimientos.vue:94 |
| procedimientos | Get | `/procedimientos` | src/components/views/contracts/contract_view.vue:1082<br>src/components/views/contracts/procedimientos.vue:76<br>src/components/views/contracts/procedimientos_view.vue:84 |
| procedimientos | Post | `/procedimientos` | src/components/views/contracts/procedimientos_view.vue:61 |
| procedimientos | Put | `/procedimientos` | src/components/views/contracts/procedimientos_view.vue:71 |
| proveedores | Delete | `/proveedores` | src/components/views/proveedores/list.vue:143<br>src/components/views/proveedores/view.vue:259 |
| proveedores | Get | `/proveedores` | src/components/views/contracts/contract_view.vue:1164<br>src/components/views/proveedores/list.vue:119<br>src/components/views/proveedores/view.vue:242 |
| proveedores | Post | `/proveedores` | src/components/views/proveedores/view.vue:208 |
| proveedores | Put | `/proveedores` | src/components/views/proveedores/view.vue:222 |
| roles | Delete | `/roles` | src/components/views/configuracion/roles.vue:121 |
| roles | Get | `/roles` | src/components/views/configuracion/roles.vue:100<br>src/components/views/configuracion/roles_view.vue:125<br>src/components/views/configuracion/usuario_view.vue:423 |
| roles | Post | `/roles` | src/components/views/configuracion/roles_view.vue:92 |
| roles | Put | `/roles` | src/components/views/configuracion/roles_view.vue:106 |
| tipo-contrato | Delete | `/tipo-contrato` | src/components/views/contracts/tipo.vue:94 |
| tipo-contrato | Get | `/tipo-contrato` | src/components/views/contracts/contract_view.vue:1150<br>src/components/views/contracts/tipo.vue:76<br>src/components/views/contracts/tipo_view.vue:84 |
| tipo-contrato | Post | `/tipo-contrato` | src/components/views/contracts/tipo_view.vue:61 |
| tipo-contrato | Put | `/tipo-contrato` | src/components/views/contracts/tipo_view.vue:71 |
| unidades-administrativas | Delete | `/unidades-administrativas` | src/components/views/admin_units/list.vue:108<br>src/components/views/admin_units/view.vue:152 |
| unidades-administrativas | Get | `/unidades-administrativas` | src/components/views/admin_units/list.vue:86<br>src/components/views/admin_units/view.vue:140<br>src/components/views/contracts/contract_view.vue:1177 |
| unidades-administrativas | Post | `/unidades-administrativas` | src/components/views/admin_units/view.vue:116 |
| unidades-administrativas | Put | `/unidades-administrativas` | src/components/views/admin_units/view.vue:126 |
| unit-types | Delete | `/unit-types` | src/components/views/contracts/unit_types.vue:94 |
| unit-types | Get | `/unit-types` | src/components/views/contracts/contract_view.vue:1190<br>src/components/views/contracts/unit_types.vue:76<br>src/components/views/contracts/unit_types_view.vue:84 |
| unit-types | Post | `/unit-types` | src/components/views/contracts/unit_types_view.vue:61 |
| unit-types | Put | `/unit-types` | src/components/views/contracts/unit_types_view.vue:71 |
| users | Delete | `/users` | src/components/views/configuracion/usuario_view.vue:526<br>src/components/views/configuracion/usuarios.vue:135 |
| users | Get | `/users` | src/components/views/configuracion/usuario_view.vue:439<br>src/components/views/configuracion/usuarios.vue:112 |
| users | Post | `/users` | src/components/partials/registration.vue:74<br>src/components/views/configuracion/usuario_view.vue:472 |
| users | Put | `/users` | src/components/views/configuracion/usuario_view.vue:491 |
