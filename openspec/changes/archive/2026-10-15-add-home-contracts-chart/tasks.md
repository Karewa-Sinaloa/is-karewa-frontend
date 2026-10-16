# Tasks

## 1. Dependencias y documentación

- [x] 1.1 Instalar `echarts` y `vue-echarts` con `pnpm add echarts vue-echarts` y verificar que `package.json` las lista y `pnpm build` sigue compilando
- [x] 1.2 Registrar las dependencias nuevas en `CHANGELOG.md` y `NOTES.md` (nombre, propósito y origen npm) y verificar que las entradas quedan escritas

## 2. Datos y agregación

- [x] 2.1 Crear `src/helpers/contracts_chart_data.js` con `fetchContractsForCharts(filters)`: `GET /contracts` vía `apiRequest().Get` con `fields=period_id,period_name,procedure_id,procedure_name,total_amount,admin_period_start,admin_period_end,fiscal_year`, `limit=500`, `embed=pagination`, parámetros `eq` solo para filtros con selección (D2) y loop de páginas (tandas de 10, tope 200) — verificar por lectura que los parámetros enviados coinciden con la tabla D2 y que el loop corta al agotar `meta.pagination`
- [x] 2.2 Agregar en el mismo helper `aggregateByPeriod(rows)` y `aggregateByProcedure(rows)` (suma de `total_amount` por `period_id` y por `procedure_id`) y el formateador monetario `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })` — verificar por lectura que el agregado usa `total_amount` y que los periodos sin datos devuelven total 0
- [x] 2.3 Agregar en el helper la derivación de opciones de administración (pares `admin_period_start-admin_period_end`, etiqueta `"<inicio>-<fin>"`, inicio descendente) y año fiscal (años distintos, descendente) desde el conjunto sin filtros — verificar por lectura que se calculan solo sobre el conjunto inicial y no se recalculan con datos filtrados

## 3. Parciales de gráficas y estilos

- [x] 3.1 Crear `src/components/partials/contracts_period_bar_chart.vue` (prop `data` con `{ periodId, periodName, total }`) usando `vue-echarts` + `echarts/core` con `BarChart`, ejes X periodos / Y montos monetarios, paleta leída de las custom properties de `:root` (sin literales de color), `role="img"` y `aria-label` con el resumen de la gráfica — verificar por lectura que no hay colores literales y que el nombre accesible está presente
- [x] 3.2 Crear `src/components/partials/procedures_pie_chart.vue` (prop `data` con `{ procedureId, procedureName, total }`) con `PieChart`, porciones etiquetadas con nombre y monto, misma paleta por tokens, `role="img"` y `aria-label` — verificar por lectura que solo dibuja porciones con monto mayor a cero
- [x] 3.3 Crear `src/assets/sass/components/_home_charts.sass` con los bloques BEM `.home-charts` (columnas 65%/35%), `.chart-panel` y `.chart-filters`, usando exclusivamente tokens de `settings/` — verificar por lectura que no hay hex ni `rgb()` y que la hoja se importa con `@use`

## 4. Barra de filtros

- [x] 4.1 Crear `src/components/partials/chart_filters_bar.vue` con los seis selectores nativos (`.form__select`): administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa, proveedor, más el botón `.form__btn` de aplicar — verificar por lectura que el patrón es `modelValue`/`update:modelValue`, que el botón emite `apply` con el objeto completo de filtros y que ningún `watch` dispara consultas

## 5. Integración en la vista de inicio

- [x] 5.1 Integrar en `src/components/views/public/home.vue` la sección de dos columnas bajo el hero, con la barra de filtros sobre las columnas, las dos gráficas en sus parciales, la carga al montar de catálogos (`periodos-contratos`, `procedimientos`, `proveedores`, `unidades-administrativas`) y del conjunto sin filtros que puebla ambas gráficas y las opciones de administración/año fiscal — verificar por lectura que el hero se conserva y que la estructura de columnas 65/35 queda debajo, sin alterar la vista `/admin`
- [x] 5.2 Implementar en `public/home.vue` el handler de `apply(filters)` que reconsulta con los filtros vigentes y recalcula ambos agregados, más los estados: mensaje `.results__no-results` sin datos y `store.push_alert(error.data)` en fallo dejando la sección vacía — verificar por lectura que cambiar un selector solo actualiza el estado local y que la única ruta de consulta es el botón

## 6. Verificación de integración

- [x] 6.1 Ejecutar `pnpm build` y verificar que compila sin errores con las dependencias y código nuevo
- [x] 6.2 Ejecutar `openspec validate --all` y verificar que el change `add-home-contracts-chart` valida sin errores
- [x] 6.3 Contrastar por lectura los escenarios del delta `specs/home/spec.md` contra el código implementado (estructura 65/35 bajo el hero, aplicación explícita por botón, agregados por periodo y por procedimiento, opciones de selectores, estados vacío/error y accesibilidad)
