# Tasks

## 1. Consulta de datos y mapeo en el helper

- [ ] 1.1 Reemplazar el barrido paginado de `fetchContractsForCharts` por una consulta única de `GET /contracts` con `embed=pagination,totals`, retirar las constantes `PAGE_LIMIT`, `BATCH_SIZE` y `MAX_PAGES` con su bucle en tandas; verificar con `grep` sobre
      `src/helpers/contracts_chart_data.js` que esas constantes ya no existen y que la query construida contiene `embed=pagination,totals`
- [ ] 1.2 Mapear `totals.by_fiscal_year` (con su `periods` anidado) a la forma de la gráfica de barras, conservando el sembrado de `knownYears` y el tope de 6 años; verificar con un script node contra la API real que los montos por año y periodo coinciden con
      los de `totals` (sin filtros: 2021 = 264847072.69; con `fiscal_year=eq:2023`: total 1213926705.81 y periodos 478441425.94 / 169708995.28 / 302628058.68 / 263148225.9)
- [ ] 1.3 Mapear `totals.by_procedure` a `{ procedureId, procedureName, total }`; verificar que las tres entradas coinciden con las de la API sin filtros (Público 1552017710.93, Adjudicación directa 1382275795.56, Por invitación 71322109.79) y con un filtro
      aplicado
- [ ] 1.4 Sustituir `deriveAdminOptions` y `deriveFiscalYearOptions` por consultas `groupby` sobre `admin_period_start,admin_period_end` y `fiscal_year`, y eliminar las funciones de suma en cliente y `quarterFromDate`; verificar con `grep` que no quedan
      referencias a las funciones retiradas y que las opciones producidas siguen siendo `2017-2021`/`2021-2027` y `2021..2024`
- [ ] 1.5 Ejecutar `pnpm prettier --check` sobre `src/helpers/contracts_chart_data.js` y verificar que pasa

## 2. Integración en la vista de inicio

- [ ] 2.1 Reordenar en `src/components/views/public/home.vue` la carga inicial (catálogos + consulta de totales sin filtros + las dos consultas de agrupación, en paralelo) y la aplicación de filtros (una sola consulta con `embed=totals`); verificar leyendo el
      flujo que cambiar cualquier selector sin pulsar el botón de aplicar no emite ninguna consulta
- [ ] 2.2 Alimentar el estado vacío de ambas columnas con el conteo de coincidencias de los totales; verificar con un filtro sin resultados (conteo cero) que se muestra el mensaje de sin datos y con resultados que ambas gráficas se pintan
- [ ] 2.3 Conservar el manejo de fallo de consulta (alerta del código devuelto y sección sin datos) en todas las consultas nuevas; verificar leyendo los bloques `catch` que siguen invocando la alerta y dejando la sección sin datos

## 3. Alineación de la gráfica de barras

- [ ] 3.1 Renombrar las claves internas de periodo Q1..Q4 a T1..T4 en el helper y en `src/components/partials/contracts_period_bar_chart.vue`; verificar con `grep` que ya no quedan claves Q1..Q4 y que etiquetas, leyenda, tooltip y `aria-label` siguen mostrando
      T1..T4 en español
- [ ] 3.2 Verificar contra la API real que con el filtro de periodo 1 las barras reflejan el periodo registrado (`period_id=eq:1`, total 1005772101.10 repartido como 64643874.81 / 432172294.68 / 478441425.94 / 30514505.66 por año) y no el trimestre de
      calendario de `contract_date`

## 4. Verificación integral

- [ ] 4.1 Ejecutar `pnpm prettier --check` sobre todos los archivos modificados y verificar que pasan
- [ ] 4.2 Ejecutar `pnpm build` y verificar que termina sin errores
- [ ] 4.3 Ejecutar `openspec validate --all` y verificar 0 fallos
- [ ] 4.4 Contrastar los escenarios del delta de `home` (totales provistos por el API, gráfica por periodo registrado) contra el código, confirmando además que no quedaron `console.log` de depuración ni archivos ni funciones de código sin uso
- [ ] 4.5 Ejecutar `pnpm api:sync` y verificar que reporta 0 desalineaciones con el contrato vigente

## Workflow follow-up

- Ejecutar la implementación con el flujo de apply (`openspec apply chart-totals-from-api`) y archivar el change cuando la revisión lo apruebe, lo que sincroniza el delta a `openspec/specs/home/spec.md`.
