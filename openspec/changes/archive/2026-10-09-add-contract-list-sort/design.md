# Design: add-contract-list-sort

## Context

`contract_list.vue` ya compone el parcial reutilizable `list_search.vue` (campo con etiqueta asociada y `v-model` con debounce) dentro del contenedor `.section__filters`, y pide los datos con `GET contracts` incluyendo el orden fijo `sort=-contract_date`. El
contrato OpenAPI publicado documenta el parámetro `sort` de `GET /contracts` como lista de campos prefijados con `+` (ascendente) o `-` (descendente), y entre los campos permitidos están `subject_name`, `procedure_name`, `status_name`, `contract_type_name`,
`admin_period_start` y `contract_date`, que cubren los criterios pedidos. Ver propuesta.md para la motivación y `specs/contracts/spec.md` para el comportamiento exigido.

## Goals / Non-Goals

- Goals: un parcial de selector de orden genérico (opciones declaradas por la vista), alineado visualmente con el search, que alimenta el parámetro `sort` del listado de contratos y restablece la paginación a la primera página.
- Non-Goals: guardar el orden en la URL o en el store, ordenar en el cliente, añadir opciones de orden a otros listados (proveedores, unidades) y modificar el backend o el contrato OpenAPI.

## Decisions

- **Parcial `partials/list_sort_selector.vue` con `v-model`**: se elige la misma forma de contrato que `list_search.vue` (props `id`, `label`, `modelValue`, `options`; evento `update:modelValue`) para que cualquier vista lo consuma sin lógica adicional.
  Alternativa descartada: un componente atado al módulo contratos, que obligaría a duplicarlo en otros listados.
- **Opciones como prop de lista `{ label, value }`**: la vista declara sus campos y el parcial solo pinta un `<select class="form__select">` nativo con etiqueta `for`/`id` (accesibilidad, estilo existente `objects/_forms.sass`). Alternativa descartada:
  `v-model` sobre un objeto de opción completa, más difícil de serializar al parámetro `sort`.
- **El valor del `v-model` es la cadena a enviar en `sort`** (p. ej. `+subject_name`): la vista la concatena directamente en `params` junto a `search`, sin mapa intermedio de campo/dirección. Alternativa descartada: dos refs `sortField`/`sortDir`, que
  duplicaría estado ya representado en el valor del selector.
- **Estado del orden solo en `contract_list.vue`**, como el texto de búsqueda: cambiar de orden hace `router.push` a la página 1 (o refetch si ya está en la 1), patrón idéntico al del search, y el `watch` de `route.path` existente recarga al navegar.
- **Sin estilos nuevos**: el parcial reutiliza `.section__filters`, `.form__label` y `.form__select` existentes, con bloque `<style lang="sass" scoped>` que declara con `@use` `_section.sass` e `_forms.sass` igual que `list_search.vue`, garantizando el
  alineado con el search sin reglas duplicadas en `components/`.
- **Selección por defecto** = orden actual (`-contract_date`, "Fecha (más reciente primero)"), para que la carga inicial no cambie el comportamiento observable ya especificado.

## Risks / Trade-offs

- [El servidor ignora o rechaza un campo de `sort`] → Los valores usados figuran en la lista de campos permitidos del contrato OpenAPI vigente (`docs/openapi.json`); si la respuesta falla, aplica el manejo de errores de listado ya existente (alerta y tabla
  vacía).
- [Cambiar el orden mientras hay búsqueda activa pierde el término] → La petición arma `search` y `sort` en el mismo `params`, y el `watch` de `searchText` no se toca; se cubre con el escenario "Orden con búsqueda activa".
- [Dos parciales con `@use` de `_forms.sass`/`_section.sass` duplican CSS en el bundle] → Mismo patrón ya adoptado por `list_search.vue` y aceptado por la spec de diseño (hojas declaradas en el propio componente); el costo es menor que perder autocontención
  del parcial.

## Migration Plan

Cambio de comportamiento del cliente sin despliegue de backend ni datos: se incluye en el siguiente build de producción (`pnpm build`). Reversión: retirar el parcial y restaurar `sort=-contract_date` en la vista.

## Open Questions

- (ninguna)
