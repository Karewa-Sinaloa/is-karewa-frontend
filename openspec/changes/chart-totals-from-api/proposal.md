# Proposal

## Why

Las gráficas del home público calculan hoy sus montos en el cliente: el helper de datos de contratos recorre hasta 200 páginas de 500 registros y suma `total_amount` por año, periodo y procedimiento, con el coste de red y el riesgo de totales incompletos que
eso implica. El contrato OpenAPI vigente (sincronizado con `pnpm api:sync`) ya expone los agregados con `embed=totals`: un objeto `totals` con la suma por año fiscal y su desglose por periodo (`by_fiscal_year[].periods[]`), la suma por tipo de procedimiento
(`by_procedure[]`) y el conteo de coincidencias, calculado por el servidor sobre el conjunto completo que cumple los filtros e ignorando la paginación. Es el momento de que el frontend consuma esos totales en lugar de agregarlos: es el ítem "Totales de
contratos" del checklist de `docs/changes.md`.

## What Changes

- Los montos de la **gráfica de barras** pasan a provenir de `totals.by_fiscal_year` (suma por año fiscal con su desglose por cada periodo) y los de la **gráfica de pastel** de `totals.by_procedure`; el frontend **deja de sumar montos en cliente**.
- El **estado vacío** de ambas columnas se decide con el conteo de coincidencias de `totals` (`results`) en lugar de contar filas recibidas.
- **Cambio observable — semántica de las barras T1..T4:** pasan a representar los cuatro periodos del año fiscal (`period_id` 1..4 del catálogo `periodos-contratos`) en lugar del trimestre de calendario derivado del mes de `contract_date`. Esto corrige la
  desviación frente a la spec `home` ("una barra por cada periodo del año fiscal") y alinea la barra con el selector de periodo; los montos por barra cambian (2023 T1: 468,456,209.93 → 478,441,425.93).
- Las opciones de **administración** y **año fiscal** se obtienen con consultas de agrupación (`groupby`) sobre `GET /contracts`, sin recibir el conjunto de filas; siguen correspondiendo a "los valores registrados en los contratos" que exige la spec `home`.
- Se **elimina el barrido paginado completo** del helper de datos de gráficas (constantes `PAGE_LIMIT`/`BATCH_SIZE`/`MAX_PAGES` y el bucle de peticiones en tandas) y el código de agregación en cliente que queda sin uso.
- La aplicación de filtros **sigue siendo una sola consulta** por pulsación del botón, ahora con `embed=pagination,totals`.

## Capabilities

### New Capabilities

<!-- ninguna -->

### Modified Capabilities

- `home`: se añade el requisito de que los montos de ambas gráficas y el estado vacío provienen de los totales que el API calcula sobre el conjunto filtrado completo (sin agregación en cliente), y se precisa que las barras de la gráfica de barras son los
  cuatro periodos del catálogo de periodos por año fiscal.

## Impact

- **Datos**: `src/helpers/contracts_chart_data.js` — la consulta de gráficas pasa a `GET /contracts?embed=pagination,totals` (una petición por aplicación de filtros) y se mapea `totals` a la forma de ambas gráficas;
  `deriveAdminOptions`/`deriveFiscalYearOptions` se alimentan de respuestas `groupby`; se retiran el escaneo en tandas y las funciones de suma en cliente.
- **Vista**: `src/components/views/public/home.vue` — orquestación de la carga inicial (catálogos + totales sin filtros + agrupaciones, en paralelo) y de la aplicación de filtros (una consulta), más el estado vacío basado en `totals.results`.
- **Componentes**: `src/components/partials/contracts_period_bar_chart.vue` y `procedures_pie_chart.vue` conservan sus formas de entrada; se renombran las claves internas Q1..Q4 a T1..T4 para reflejar periodos.
- **Rendimiento**: de ~6 peticiones × 500 filas (2,601 contratos, hasta 200 páginas) a 1 petición de totales + 2 de agrupación por carga, más los 4 catálogos que ya se pedían.
- **API/contrato**: sin cambios ni dependencias nuevas; se usan `embed` y `groupby` ya documentados en el contrato vigente (`pnpm api:sync` reporta 0 desalineaciones).
- **Especificación**: delta en `openspec/specs/home/spec.md` (1 requisito añadido, 1 requisito modificado).
- **Documentación**: se marca el ítem 1 del checklist de `docs/changes.md` al crearse esta especificación.
