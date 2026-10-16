# Reporte de sincronización OpenAPI

- Contrato: https://kapi.chavodigital.com/api/docs/openapi.json
- Especificación: Monitor Karewa API 5.0.0 (OpenAPI 3.0.3)

## Resumen

- Módulos analizados: 83 llamadas, 20 módulos literales
- Conformes: 54
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
| access/logout | Get | `/access/logout` | src/helpers/set.session.js:93 |
| access/recovery | Post | `/access/recovery` | src/components/partials/recovery.vue:44 |
| access/reset | Post | `/access/reset` | src/components/partials/reset.vue:51 |
| config | Get | `/config` | src/components/views/configuracion/config.vue:55<br>src/helpers/site.config.vue:12 |
| config | Put | `/config` | src/components/views/configuracion/config_view.vue:200 |
| contracts | Delete | `/contracts` | src/components/views/contracts/contract_list.vue:238<br>src/components/views/contracts/contract_view.vue:1177 |
| contracts | Get | `/contracts` | src/components/views/contracts/contract_list.vue:213<br>src/components/views/contracts/contract_view.vue:1160<br>src/helpers/contracts_chart_data.js:44 |
| contracts | Post | `/contracts` | src/components/views/contracts/contract_view.vue:1126 |
| contracts | Put | `/contracts` | src/components/views/contracts/contract_view.vue:1140 |
| estatus-contrato | Delete | `/estatus-contrato` | src/components/views/contracts/estatus.vue:141 |
| estatus-contrato | Get | `/estatus-contrato` | src/components/views/contracts/contract_view.vue:1249<br>src/components/views/contracts/estatus.vue:120<br>src/components/views/contracts/estatus_view.vue:86 |
| estatus-contrato | Post | `/estatus-contrato` | src/components/views/contracts/estatus_view.vue:63 |
| estatus-contrato | Put | `/estatus-contrato` | src/components/views/contracts/estatus_view.vue:73 |
| frontend-logs | Post | `/frontend-logs` | src/helpers/frontend.logs.js:5 |
| materias | Delete | `/materias` | src/components/views/contracts/materia.vue:141 |
| materias | Get | `/materias` | src/components/views/contracts/contract_view.vue:1208<br>src/components/views/contracts/materia.vue:120<br>src/components/views/contracts/materia_view.vue:86 |
| materias | Post | `/materias` | src/components/views/contracts/materia_view.vue:63 |
| materias | Put | `/materias` | src/components/views/contracts/materia_view.vue:73 |
| organization | Get | `/organization` | src/mixins/organization.js:8 |
| organization | Put | `/organization` | src/components/views/organization.vue:297 |
| partidas | Get | `/partidas` | src/components/views/contracts/contract_view.vue:1235 |
| periodos-contratos | Delete | `/periodos-contratos` | src/components/views/contracts/periodos.vue:141 |
| periodos-contratos | Get | `/periodos-contratos` | src/components/views/contracts/contract_view.vue:1222<br>src/components/views/contracts/periodos.vue:120<br>src/components/views/contracts/periodos_view.vue:128 |
| periodos-contratos | Post | `/periodos-contratos` | src/components/views/contracts/periodos_view.vue:95 |
| periodos-contratos | Put | `/periodos-contratos` | src/components/views/contracts/periodos_view.vue:109 |
| procedimientos | Delete | `/procedimientos` | src/components/views/contracts/procedimientos.vue:141 |
| procedimientos | Get | `/procedimientos` | src/components/views/contracts/contract_view.vue:1195<br>src/components/views/contracts/procedimientos.vue:120<br>src/components/views/contracts/procedimientos_view.vue:86 |
| procedimientos | Post | `/procedimientos` | src/components/views/contracts/procedimientos_view.vue:63 |
| procedimientos | Put | `/procedimientos` | src/components/views/contracts/procedimientos_view.vue:73 |
| proveedores | Delete | `/proveedores` | src/components/views/proveedores/list.vue:146<br>src/components/views/proveedores/view.vue:263 |
| proveedores | Get | `/proveedores` | src/components/views/contracts/contract_view.vue:1277<br>src/components/views/proveedores/list.vue:122<br>src/components/views/proveedores/view.vue:246 |
| proveedores | Post | `/proveedores` | src/components/views/proveedores/view.vue:212 |
| proveedores | Put | `/proveedores` | src/components/views/proveedores/view.vue:226 |
| roles | Delete | `/roles` | src/components/views/configuracion/roles.vue:124 |
| roles | Get | `/roles` | src/components/views/configuracion/roles.vue:103<br>src/components/views/configuracion/roles_view.vue:127<br>src/components/views/configuracion/usuario_view.vue:427 |
| roles | Post | `/roles` | src/components/views/configuracion/roles_view.vue:94 |
| roles | Put | `/roles` | src/components/views/configuracion/roles_view.vue:108 |
| tipo-contrato | Delete | `/tipo-contrato` | src/components/views/contracts/tipo.vue:141 |
| tipo-contrato | Get | `/tipo-contrato` | src/components/views/contracts/contract_view.vue:1263<br>src/components/views/contracts/tipo.vue:120<br>src/components/views/contracts/tipo_view.vue:86 |
| tipo-contrato | Post | `/tipo-contrato` | src/components/views/contracts/tipo_view.vue:63 |
| tipo-contrato | Put | `/tipo-contrato` | src/components/views/contracts/tipo_view.vue:73 |
| unidades-administrativas | Delete | `/unidades-administrativas` | src/components/views/admin_units/list.vue:146<br>src/components/views/admin_units/view.vue:239 |
| unidades-administrativas | Get | `/unidades-administrativas` | src/components/views/admin_units/list.vue:121<br>src/components/views/admin_units/view.vue:222<br>src/components/views/contracts/contract_view.vue:1290 |
| unidades-administrativas | Post | `/unidades-administrativas` | src/components/views/admin_units/view.vue:188 |
| unidades-administrativas | Put | `/unidades-administrativas` | src/components/views/admin_units/view.vue:202 |
| unit-types | Delete | `/unit-types` | src/components/views/contracts/unit_types.vue:141 |
| unit-types | Get | `/unit-types` | src/components/views/contracts/contract_view.vue:1303<br>src/components/views/contracts/unit_types.vue:120<br>src/components/views/contracts/unit_types_view.vue:86 |
| unit-types | Post | `/unit-types` | src/components/views/contracts/unit_types_view.vue:63 |
| unit-types | Put | `/unit-types` | src/components/views/contracts/unit_types_view.vue:73 |
| users | Delete | `/users` | src/components/views/configuracion/usuario_view.vue:530<br>src/components/views/configuracion/usuarios.vue:138 |
| users | Get | `/users` | src/components/views/configuracion/usuario_view.vue:443<br>src/components/views/configuracion/usuarios.vue:115 |
| users | Post | `/users` | src/components/partials/registration.vue:74<br>src/components/views/configuracion/usuario_view.vue:476 |
| users | Put | `/users` | src/components/views/configuracion/usuario_view.vue:495 |
