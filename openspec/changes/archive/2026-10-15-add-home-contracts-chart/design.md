# Design

## Context

La vista de inicio (`src/components/views/home.vue`) hoy solo monta el sidebar, el `content-header` y el widget de bienvenida. El proyecto no tiene ninguna librería de gráficas ni visualizaciones previas. La API no expone endpoints de agregación: `GET /contracts` (contrato `docs/openapi.json`) permite selección de campos (`fields`), paginación (`page`, `limit`, `embed=pagination`) y filtrado por campo con sintaxis `campo=op:valor` sobre todos los campos del registro, incluidos `admin_period_start`, `admin_period_end`, `fiscal_year`, `period_id`, `procedure_id`, `organizer_admin_unit_id` y `provider_id`. Los catálogos de opciones viven en `periodos-contratos`, `procedimientos`, `proveedores` y `unidades-administrativas`. Los patrones de toolbar de filtros (`list_search.vue`, `list_sort_selector.vue`) usan `<select>`/`<input>` nativos con `v-model` y no usan vee-validate; los errores se reportan con `store.push_alert(error.data)` y la carga global la maneja `apiRequest` vía `store.processing`. Motivación en `proposal.md`; requerimientos observables en el delta `specs/home/spec.md`.

## Goals / Non-Goals

**Goals:**

- Una sola fuente de datos por aplicación de filtros: un juego de contratos agregado en cliente alimenta ambas gráficas y deriva las opciones de administración/año fiscal.
- Gráficas con ECharts (`echarts` + `vue-echarts`), registrando solo los componentes usados para limitar el peso del bundle.
- Estilos solo con tokens del sistema (sin literales de color en `.vue`/`.js`, según `design-system`), BEM y hoja nueva bajo `src/assets/sass/components/`.
- Parciales reutilizables en `src/components/partials/` conforme a `ui-construction`.

**Non-Goals:**

- No se crea ni modifica ningún endpoint; no hay cambios en el contrato OpenAPI.
- No se toca el listado de contratos ni el formulario de contrato.
- No se agregan rutas ni permisos por rol (la sección es de solo lectura con sesión).
- No se exportan imágenes ni hay interacción de filtrado dentro de las gráficas (los filtros viven solo en la barra).

## Decisions

### D1. Agregación en cliente sobre `GET /contracts`

Sin endpoint de agregación disponible, cada aplicación de filtros dispara `GET /contracts?fields=period_id,period_name,procedure_id,procedure_name,total_amount,admin_period_start,admin_period_end,fiscal_year&limit=500&embed=pagination[&<filtros>]`. La respuesta paginada (`meta.pagination`) determina cuántas páginas faltan; se piden en tandas paralelas (máx. 10 en vuelo) y se concatenan. Con el conjunto completo se calculan dos agregados: suma de `total_amount` por `period_id` (barras) y suma por `procedure_id` (pastel).

- *Alternativa descartada*: pedir los contratos sin `fields` ni límite — trae campos innecesarios (textos largos, notas) y no escala.
- *Alternativa descartada*: pedir una gráfica por endpoint distinto — duplica tráfico y hace difícil mantener ambos agregados coherentes ante los mismos filtros.
- El límite `limit=500` es el pedido inicial; si el servidor lo recorta a un máximo menor, se usa ese máximo detectado desde la respuesta (mismo loop).

### D2. Mapeo de filtros a parámetros de consulta

| Selector | Parámetro enviado |
| --- | --- |
| Administración | `admin_period_start=eq:<año>` y `admin_period_end=eq:<año>` (ambos) |
| Año fiscal | `fiscal_year=eq:<año>` |
| Periodo (trimestre) | `period_id=eq:<id>` |
| Tipo de procedimiento | `procedure_id=eq:<id>` |
| Unidad administrativa (convocante) | `organizer_admin_unit_id=eq:<id>` |
| Proveedor | `provider_id=eq:<id>` |

Solo se envían los parámetros de los selectores con selección; el botón de aplicar filtros es el único disparador de la petición (los `watch` de los selectores actualizan únicamente el estado local del formulario).

### D3. Opciones de los selectores

- `periodos-contratos`, `procedimientos`, `proveedores`, `unidades-administrativas`: se cargan una vez al montar la vista con `new apiRequest().Get({ module: '<catálogo>' })` (mismo patrón que `contract_view.vue`).
- Administración y año fiscal se derivan del **primer juego de datos sin filtros**: pares distintos de `admin_period_start`-`admin_period_end` (etiqueta `"<inicio>-<fin>"`, ordenados por inicio descendente) y años fiscales distintos ordenados descendente.
- Las opciones de estos dos selectores **no se recalculan tras aplicar filtros**: se congelan con el conjunto sin filtrar para que el usuario no pierda opciones al acotar la consulta. Los años fiscales se limitan al rango de la administración elegida solo si eso resulta necesario para evitar combinaciones vacías; comportamiento por defecto: rango completo.

### D4. Registro mínimo de ECharts

Se importa desde `echarts/core` y se registran solo `BarChart`, `PieChart`, `GridComponent`, `TooltipComponent`, `LegendComponent`, `TitleComponent` y `LabelLayout` (svg renderer) para mantener el bundle acotado. El render usa `vue-echarts` (`<v-chart :option="..." autoresize />`).

### D5. Paleta derivada de los tokens

ECharts necesita colores como valores JS, pero `design-system` prohíbe literales de color en `src/**/*.vue` y `src/**/*.js`. El tema de las gráficas se construye en tiempo de ejecución leyendo las custom properties de `:root` con `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')` (más los tonos de la rampa `--color-*-100..900` y los semánticos) y componiendo el array de colores de series. Una sola fuente de verdad: `settings/`.

- *Alternativa descartada*: duplicar la paleta en un módulo JS — rompe la fuente única de tokens.
- *Alternativa descartada*: literales hex en el theme — los detecta la auditoría de `design-system`.

### D6. Estructura de componentes

- `src/components/partials/chart_filters_bar.vue` — barra de filtros: seis `<select class="form__select">` nativos + botón `.form__btn`; patrón `modelValue`/`update:modelValue` como `list_sort_selector.vue`; emite `apply` con el objeto de filtros completo al pulsar el botón. Sin vee-validate (es una toolbar de filtros, como los listados).
- `src/components/partials/contracts_period_bar_chart.vue` — gráfica de barras; recibe `data: [{ periodId, periodName, total }]` por prop y expone el `option` de barras (eje X periodos, eje Y montos).
- `src/components/partials/procedures_pie_chart.vue` — gráfica de pastel; recibe `data: [{ procedureId, procedureName, total }]` por prop.
- `src/helpers/contracts_chart_data.js` — `fetchContractsForCharts(filters)` (paging + filtros) y `aggregateByPeriod(rows)` / `aggregateByProcedure(rows)`; mantiene la vista delgada y la lógica de agregación aislando la parte comprobable.
- `src/components/views/home.vue` — orquesta: opciones de catálogos, estado de filtros, conjunto de datos inicial sin filtros al montar, `applyFilters(filters)` que reconsulta y recalcula ambos agregados, y estados vacío/error.
- Hoja nueva `src/assets/sass/components/_home_charts.sass` (bloque `.home-charts`, `.chart-filters`, `.chart-panel` con modificadores para columnas 65/35), importada con `@use` desde los parciales/vista; tokens exclusivamente.

### D7. Estados vacíos, error y formato monetario

- Sin datos tras aplicar filtros: cada columna muestra un mensaje con la clase existente `.results__no-results` (reutiliza el estilo de "sin resultados" ya presente en el sistema).
- Error: `.catch(error => store.push_alert(error.data))` (catálogo `src/resources/errors.js` con fallback "ERROR DE SERVIDOR"); el estado de datos vigente se limpia para dejar la sección sin datos hasta el siguiente intento.
- Formato monetario con `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })` (no existe helper previo de moneda en el proyecto); se aplica en etiquetas/tooltips de ambas gráficas.

### D8. Accesibilidad de las gráficas

Cada contenedor de gráfica lleva `role="img"` y un `aria-label` computado (p. ej., "Contratos por periodo fiscal: suma del monto total con impuestos por trimestre" / "Montos por tipo de procedimiento"), más la opción `aria.description` de ECharts. Los controles son nativos (`select`, `button`), por lo que el foco visible lo aportan los estilos base del sistema.

## Risks / Trade-offs

- [Volumen alto de contratos ⇒ muchas páginas por aplicación] → `fields` mínimo, `limit` alto, tandas paralelas de 10, y un tope de páginas (p. ej. 200) que, de excederse, deja la sección vacía con alerta en lugar de bloquear la vista.
- [El servidor no acepta `limit=500`] → el loop detecta el máximo real desde la respuesta y pagina con ese valor; no hay código de caso especial.
- [Opciones de administración/año fiscal congeladas pueden no coincidir con resultados filtrados] → comportamiento deliberado (D3): el usuario siempre puede volver a aplicar sin filtros; el estado sin datos muestra el mensaje de la spec.
- [Agregado inicial combina contratos de varias administraciones/años fiscales en las mismas barras] → es el comportamiento pedido (estado inicial = todos los contratos); el filtro de año fiscal/administración acota cuando se desea desagregar.
- [Colores leídos vía `getComputedStyle` dependen de que los estilos estén aplicados] → la lectura se hace al montar (post-`onMounted`), y el renderer es SVG sobre `autoresize`, tolerante a retematizado.

## Migration Plan

Sin migración de datos ni de API. Despliegue: `pnpm add echarts vue-echarts`, implementar la sección y verificar con `pnpm build`. Rollback: revertir el commit que agrega la sección y las dependencias; no deja estados persistentes.

## Open Questions

- Ninguna pendiente que altere specs, enfoque o desglose de tareas.
