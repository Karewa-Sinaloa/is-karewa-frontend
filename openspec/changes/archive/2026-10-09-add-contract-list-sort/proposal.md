# Proposal: add-contract-list-sort

## Why

El listado de contratos solo permite ordenar por fecha de contrato descendente (fijo en la vista) y el usuario necesita reordenar la tabla por los campos con los que consulta habitualmente (materia, procedimiento, estado, tipo y fechas) sin cambiar de página
ni recargar la aplicación.

## What Changes

- Nuevo parcial reutilizable `list_sort_selector.vue` en `src/components/partials/`: un `<select>` con etiqueta asociada que emite el valor de orden elegido mediante `v-model`; recibe las opciones como prop para que cualquier listado pueda declarar sus propios
  campos.
- `contract_list.vue` coloca el selector junto al campo de búsqueda, dentro de `.section__filters`, alineado con él.
- El orden elegido se traduce al parámetro `sort` de la API (`+campo` ascendente / `-campo` descendente), sustituyendo al orden fijo `sort=-contract_date`.
- Opciones del selector de contratos: Materia (A-Z / Z-A), Tipo de procedimiento (A-Z / Z-A), Estado (A-Z / Z-A), Tipo (A-Z / Z-A), Fecha de inicio de administración (más antigua / más reciente) y Fecha de contrato (más antigua / más reciente).
- Al cambiar el orden, el listado vuelve a la primera página y se respetan el texto de búsqueda y los permisos ya existentes.

## Capabilities

### Modified Capabilities

- `contracts` — El requerimiento de listado incorpora ordenamiento seleccionable por el usuario (campos y direcciones), conservando el orden por defecto por fecha de contrato descendente.

### New Capabilities

- (ninguna)

## Impact

- Código: `src/components/partials/list_sort_selector.vue` (nuevo), `src/components/views/contracts/contract_list.vue` (uso del parcial, ref `sort` y parámetro `sort` en la petición), estilos existentes de `objects/_forms.sass` y `components/_section.sass`
  (sin reglas nuevas).
- API: sin cambios; se reutiliza el parámetro `sort` de `GET /contracts` (campos permitidos `subject_name`, `procedure_name`, `status_name`, `contract_type_name`, `admin_period_start`, `contract_date`).
- Documentación: `CHANGELOG.md` y delta de `openspec/specs/contracts/spec.md`.
