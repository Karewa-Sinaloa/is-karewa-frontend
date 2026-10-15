# Design

## Context

`src/components/partials/chart_filters_bar.vue` renderiza seis `<select>` nativos (uno por dimensión) con markup casi idéntico: label + select con opción vacía + options buceadas desde `props.options`. El modelo de datos de opciones ya es `{ value, label }` (heredado de `add-home-contracts-chart`), así que las opciones encajan directamente con la forma que espera vue-multiselect (`label="label"`, `track-by="value"`). El contrato de la barra (props `modelValue`/`options`, eventos `update:modelValue`/`apply`) es consumido por `src/components/views/public/home.vue` y se conserva sin cambios. La app es Vue 3.5.43 y vue-multiselect v3 requiere Vue ^3.5, por lo que no hay conflicto de versión. Ver proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- Selector con buscador interno en las seis dimensiones de la barra de filtros.
- Un único parcial reutilizable para el campo de filtro (label + multiselect), instanciado seis veces; sin markup de selector repetido.
- Estilos del multiselect en armonía con los tokens del sistema (`var(--...)`, BEM), sin literales de color.
- Conservar el contrato existente de la barra y el comportamiento "solo consulta al aplicar".

**Non-Goals:**

- Migrar a vue-multiselect los `<select>` del panel administrativo, del formulario de contrato ni de otros parciales (quedan fuera de este cambio).
- Selección múltiple: los filtros siguen siendo selección simple por dimensión.
- Cambiar el origen o la forma de las opciones (`{ value, label }` se mantiene).

## Decisions

- **Dependencia `vue-multiselect` v3 (búsqueda interna) en lugar de `<input>` + lista propia.** El usuario la eligió explícitamente (vue-multiselect.js.org); es sin dependencias, trae búsqueda, navegación por teclado, estados vacíos y v-model, y evita reimplementar filtrado/foco/teclado. Alternativa descartada: construir un combobox propio (más código, más riesgo de a11y).
- **Nuevo parcial `src/components/partials/filter_select.vue`** que envuelve `<VueMultiselect>` con: `props` `id`, `label` (texto de la etiqueta), `modelValue` (string, `''` = sin selección), `options` y `placeholder`; emite `update:modelValue` con el string del `value` elegido (o `''` al limpiar). Traduce entre el string del modelo de la barra y el objeto opción que usa el multiselect internamente (`options.find(o => o.value === modelValue) ?? null`). Alternativa descartada: meter el multiselect directamente en la barra seis veces (justo la repetición que se quiere eliminar).
- **Barra de filtros reescrita sobre el parcial**: `chart_filters_bar.vue` mantiene su contrato público (props/eventos) y su `<form>` + botón "Aplicar filtros"; cada campo pasa a ser un `<filter-select>` con su label, id y opción vacía etiquetada ("Todas"/"Todos") como `placeholder`/estado `''` (vue-multiselect con `allow-empty` devuelve `null` al limpiar → el parcial lo emite como `''`).
- **CSS del multiselect**: se importa `vue-multiselect/dist/vue-multiselect.min.css` una sola vez en el parcial y se sobre-escriben sus clases con tokens del sistema en una hoja `components/_home_charts.sass` (o hoja dedicada `_filter_select.sass`), usando selectores anidados bajo la clase del propio componente (scoped no aplica al CSS importado, por eso la sobre-escritura va en la hoja SASS sin scoped, encapsulada por clase del campo).
- **A11y**: cada campo asocia la `<label :for>` con el input interno del multiselect (prop `id`/`name` del multiselect o `aria-labelledby`), se conserva el outline de foco visible ya existente para `.form__select:focus-visible` aplicado ahora al input del multiselect, y el mensaje de sin resultados del buscador es texto en español ("No se encontraron elementos").

## Risks / Trade-offs

- [El CSS importado del multiselect usa sus propias clases, fuera del scoped del parcial] → Se sobre-escribe en la hoja SASS del parcial con especificidad controlada (anidando bajo `.chart-filters__field` o el bloque propio), sin afectar a otros selectores.
- [vue-multiselect v3 aún tiene deudas de accesibilidad conocidas (roles ARIA incompletos en versiones previas)] → Se asocia label, se garantiza operación por teclado y foco visible; se valida en el escenario de teclado de la spec. Si al implementar se detecta un bloqueo real de lector de pantalla, se anota en NOTES.md como deuda conocida del componente externo.
- [La búsqueda por label no busca por value ni por sinónimos] → Aceptado: los labels de catálogo son descriptivos; agregar un `:filter-fields` personalizado queda fuera de alcance salvo que se pida.
- [Importar el CSS completo del multiselect incrementa ligeramente el bundle] → Aceptado por ahora; si el peso pesa, se puede acotar con un build custom del CSS en un cambio futuro.

## Migration Plan

Cambio de UI sin migración de datos: desplegar el build normal (`pnpm build`). Rollback: revertir el commit (la barra vuelve a `<select>` nativos sin tocar el modelo de datos).

