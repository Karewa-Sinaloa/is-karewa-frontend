# Tasks

## 1. Parcial reutilizable del selector de orden

- [x] 1.1 Crear `src/components/partials/list_sort_selector.vue` con Composition API (`<script setup>`), props `id` (requerido), `label`, `modelValue` y `options` (lista `{ label, value }`), `update:modelValue` con `v-model` sobre un
      `<select class="form__select">` envuelto en `.section__filters` con etiqueta `for`/`id`, y bloque `<style lang="sass" scoped>` que hace `@use` de `_section.sass` e `_forms.sass` — verificar que el archivo existe, que `pnpm exec prettier --check` lo
      acepta y que el `<select>` renderiza la primera opción al montarlo con un `modelValue` inicial.
- [x] 1.2 Verificar el comportamiento del parcial en aislamiento apoyándote en `pnpm dev`: al cambiar la opción se emite `update:modelValue` con el `value` correspondiente y la etiqueta enfoca el `<select>` al hacer clic — observar ambos comportamientos en el
      navegador.

## 2. Integración en el listado de contratos

- [x] 2.1 En `src/components/views/contracts/contract_list.vue`, importar el parcial y colocarlo junto a `<list-search>` dentro del bloque de filtros, con `id="contract-sort"`, etiqueta "Ordenar por", `v-model="sort"` y la lista de opciones: materia (A-Z/Z-A:
      `+subject_name`/`-subject_name`), tipo de procedimiento (`+procedure_name`/`-procedure_name`), estado (`+status_name`/`-status_name`), tipo de contrato (`+contract_type_name`/`-contract_type_name`), fecha de inicio de administración
      (`+admin_period_start`/`-admin_period_start`) y fecha de contrato (`+contract_date`/`-contract_date`), con el valor inicial `-contract_date` — verificar que el selector aparece alineado con el campo de búsqueda y que su selección inicial es "Fecha (más
      reciente primero)".
- [x] 2.2 Declarar `const sort = ref('-contract_date')` y hacer que el `watch(sort)` repita el patrón del `watch(searchText)`: si la página actual no es la 1 hace `router.push` a `{ name: 'contractList', params: { page: 1 } }` y si ya está en la 1 llama a
      `getContracts()` — verificar en el navegador que cambiar el orden desde la página 2 vuelve a la página 1 y recarga.
- [x] 2.3 Sustituir `sort=-contract_date` fijo en los `params` de `getContracts()` por `sort=${sort.value}` manteniendo `search` y el resto de parámetros — verificar con las herramientas de red del navegador que la petición incluye `sort=-contract_date` al
      cargar, `sort=+subject_name` al elegir Materia (A-Z) y que un término de búsqueda se conserva junto al nuevo `sort` al cambiar el orden.
- [x] 2.4 Confirmar que el orden pedido al servidor se refleja en la tabla (p. ej. Materia A-Z ordena alfabéticamente la columna de materia) y que el escenario sin resultados con búsqueda activa sigue mostrando el mensaje con el término — verificar en el
      navegador con una búsqueda que no coincida.

## 3. Documentación y verificación de integración

- [x] 3.1 Registrar el cambio en `CHANGELOG.md`: entrada en "Agregado" para `partials/list_sort_selector.vue` y en "Modificado" para `contract_list.vue` (selector de orden junto al search) — verificar que las entradas describen el comportamiento entregado.
- [x] 3.2 Ejecutar `pnpm build` y `openspec validate --all` — ambos deben terminar sin errores.
