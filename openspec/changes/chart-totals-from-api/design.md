# Design

## Context

Ver `proposal.md` (Why). Estado actual relevante:

- `src/helpers/contracts_chart_data.js` construye la query de `GET /contracts` con `fields` mínimo (`CHART_FIELDS`), `embed=pagination` y los filtros con selección; `fetchContractsForCharts` pagina con `PAGE_LIMIT=500`, tandas de `BATCH_SIZE=10` y tope
  `MAX_PAGES=200` (lee la paginación en `body.pagination || meta.pagination || meta`), y devuelve las filas para que el cliente agregue: `aggregateByYearQuarter` (suma por año y por trimestre derivado del mes de `contract_date` vía `quarterFromDate`, eje
  sembrado con `knownYears` y tope de 6 años), `aggregateByProcedure`, `deriveAdminOptions` y `deriveFiscalYearOptions`.
- `src/components/views/public/home.vue`: `loadCatalogs` pide una vez `periodos-contratos`, `procedimientos`, `proveedores` y `unidades-administrativas`; `loadInitialData` deriva las opciones de administración/año fiscal de las filas y llama
  `updateCharts(rows)`; aplicar filtros vuelve a pedir todas las filas; `hasRows`/`showEmpty` se deciden con `rows.length`.
- Contrato vigente (`pnpm api:sync`, 0 desalineaciones): `GET /contracts` acepta `embed=pagination,totals` y devuelve
  `totals = { results, total_amount, subtotal, by_fiscal_year: [{ fiscal_year, total_amount, subtotal, periods: [{ period_id, period_name, total_amount, subtotal }] }], by_procedure: [{ procedure_id, procedure_name, total_amount }] }`, calculado sobre el
  conjunto completo que cumple los filtros e ignorando la paginación. Verificado contra la API real: sin filtros `results=2601`, `total_amount=3005615616.27`; `fiscal_year=eq:2023` → `1213926705.81` y `period_id=eq:1` → `1005772101.10` con `results=285`, ambos
  iguales a la suma manual de las filas.
- `groupby` devuelve filas distintas con valores representativos, **nunca sumas** (sondado: `total_amount:sum`, `agg=`, `metrics=` se ignoran o dropean campos): sirve para obtener valores distintos de `admin_period_start,admin_period_end` (`2017-2021`,
  `2021-2027`) y de `fiscal_year` (`2021..2024`), no para montos.
- Catálogo `periodos-contratos`: exactamente cuatro registros (id 1..4, nombres `1o`..`4o`).
- Los requisitos afectados viven en `openspec/specs/home/spec.md` (ver delta en `specs/home/spec.md` de este cambio).

## Goals / Non-Goals

**Goals:**

- Que cada aplicación de filtros sea **una sola consulta** de totales y que ninguna suma de dinero ocurra en el cliente.
- Eliminar el barrido paginado del conjunto de contratos (de ~6 × 500 filas a 1 petición de totales + 2 de agrupación por carga inicial).
- Preservar el comportamiento observable vigente fuera de ese alcance: filtros que solo consultan con el botón, catálogos, opciones congeladas al montar, estado vacío/error y la política de eje (máximo 6 años, años sin contratos en cero).

**Non-Goals:**

- Documentar en la spec `home` la regla del tope de 6 años del eje (queda pendiente como cambio aparte; hoy no está en la spec).
- Cambios de backend o del contrato: se usan `embed` y `groupby` ya publicados; nada de nuevas rutas ni parámetros.
- Refrescar las opciones de los selectores en cada aplicación (siguen congeladas al montar, como hoy).
- Modificar la barra de filtros, los catálogos de selectores ni las gráficas más allá de su fuente de datos.

## Decisions

- **D1 — Origen y mapeo de los totales.** Se pide `embed=pagination,totals` y se mapea: `by_fiscal_year[].fiscal_year` → `year`; `periods[]` con `period_id` 1..4 → las cuatro claves de periodo (ausentes → 0); `total_amount` del año → `total`; `by_procedure[]`
  → `{ procedureId, procedureName, total }`; `results` → estado vacío. Se usa `total_amount` (el mismo campo que hoy suma el frontend y que la spec define como monto total con impuestos); `subtotal` queda fuera de alcance. Alternativas descartadas: seguir
  sumando en cliente (mantiene el barrido y la deriva de `contract_date`); N+1 consultas `embed=totals` por procedimiento (más idas y vueltas que una consulta); `groupby` para montos (devuelve valores representativos, no sumas).
- **D2 — La barra es el periodo del catálogo, no la fecha de firma.** Se adopta `periods` del API (`period_id` 1..4). Rationale: la spec `home` exige "una barra por cada periodo del año fiscal" y la propuesta original de la gráfica (`add-home-contracts-chart`)
  definía el "trimestre del catálogo `periodos-contratos`"; la derivación de `contract_date` es una desviación observable (2023 T1: 468,456,209.93 calendario vs 478,441,425.93 periodo) y rompe la coherencia con el selector de periodo, que filtra por
  `period_id`. Alternativa descartada: conservar el trimestre de calendario (viola la spec y el filtro).
- **D3 — Orquestación de consultas.** Montaje, en paralelo: los 4 catálogos existentes + 1 consulta de totales sin filtros + 2 consultas `groupby` (opciones de administración y año fiscal). Aplicar filtros: exactamente 1 consulta de totales con los filtros
  vigentes (preserva el requisito de "una sola consulta" por pulsación). Las opciones quedan congeladas al montar, como hoy. Alternativa descartada: refrescar opciones en cada aplicación (más consultas y cambio de comportamiento que la spec no pide).
- **D4 — La política de eje sigue siendo del frontend.** El tope de 6 años y el sembrado de años en cero (`knownYears` = opciones de año fiscal congeladas) se conservan tal cual; solo cambia que la altura de cada barra viene de los totales del API en lugar de
  una suma de filas. Rationale: es política de presentación, no verdad de los datos, y la spec no la documenta (fuera de alcance de este cambio).
- **D5 — Estado vacío y errores.** `showEmpty = totals.results === 0` en el estado inicial y tras cada aplicación; el fallo de cualquiera de las consultas conserva el manejo actual (`push_alert` con el código y sección sin datos). Nota: `embed=pagination` no
  agrega la clave `pagination` cuando `results=0`, por eso el vacío se decide con `totals.results` y no con la paginación.

## Risks / Trade-offs

- [El contrato cambia la forma de `totals`] → el mapeo queda aislado en una sola función del helper y la verificación compara los montos contra la API real; `pnpm api:sync` reporta desalineaciones en el reporte.
- [Los montos por barra cambian visiblemente al pasar de trimestre de calendario a periodo] → es intencional: es lo que exige la spec `home`; queda documentado como cambio observable en `proposal.md` y las etiquetas/aria siguen en nomenclatura T1..T4.
- [`groupby` ignora parámetros no soportados sin error] → se usa solo para valores distintos de opciones, nunca para montos (lección de los sondeos).
- [Filtros sin resultados] → `totals` viene con arreglos vacíos y `results=0`; el estado vacío evita dibujar gráficas con datos ausentes.

## Migration Plan

1. Helper: consulta única con `embed=pagination,totals`, mapeo a las formas de las dos gráficas y opciones por `groupby`; retiro del barrido en tandas y de las funciones de suma en cliente (código sin uso, spec `code-quality`).
2. `home.vue`: orquestación de montaje/aplicación y estado vacío por `totals.results`.
3. Componentes: renombrar las claves internas Q1..Q4 a T1..T4 (periodos), conservando etiquetas, leyenda, tooltip y `aria-label`.
4. Verificación: `prettier --check`, `pnpm build`, `openspec validate --all`, lectura de los escenarios del delta contra el código y comparación de montos con la API real.

Rollback: revert del commit; el cambio no migra datos ni estado y solo afecta la vista pública de inicio.

## Open Questions

Ninguna pendiente: la duda de los totales por procedimiento se resolvió con el contrato actualizado (`by_procedure`, petición del usuario en m00359), la semántica de las barras la fija la spec `home` (D2) y las opciones por `groupby` se asumieron sin objeción.
