# Avance del proyecto

**Última actualización:** 2026-10-16

## Último estado guardado

- Rama: `development`, sincronizada con `origin/development`.
- Commit más reciente: `dc74543` — `Implementa consulta pública de contratos`.
- El árbol de trabajo estaba limpio después de subir ese commit.
- Se ejecutaron `pnpm build` y `openspec validate --all`: ambos terminaron sin errores. Permanecen avisos del tamaño del bundle JS (>500 kB) y advertencias OpenSpec preexistentes en `home` (requirement largo) y `public-home-hero` (Purpose pendiente).

## Trabajo terminado

- Se completó la consulta pública de contratos: listado, búsqueda y filtros, totales del backend, tabla paginada y detalle de solo lectura en `/contratos/:id`.
- El detalle muestra los campos del API salvo los identificadores técnicos excluidos; incluye descripción y monto total con IVA en el encabezado, fechas en español conservando hora, notas expandibles después de 280 caracteres e indicador de `amount_was_exceeded`.
- Se creó `openspec/specs/public-contracts/spec.md` con los ocho requisitos del delta y se archivó el change en `openspec/changes/archive/2026-10-16-public-contracts-view/`.
- El commit anterior incluye también los ajustes locales de Sass/colores, botones, formularios y documentación que estaban pendientes al momento de guardar los cambios.

## Punto actual: `chart-totals-from-api`

El único change activo es `openspec/changes/chart-totals-from-api/`. Su proposal, delta spec (`specs/home/spec.md`), design y tasks están completos, pero la implementación aún no se ha iniciado: **0 de 15 tareas completadas**.

### Objetivo

Cambiar las gráficas del home público para consumir agregados del API, en lugar de descargar y sumar contratos en el cliente; conservar la carga de filtros y el estado de error/vacío. Las barras T1–T4 deben representar los periodos del catálogo fiscal (`period_id` 1–4), no trimestres calculados desde `contract_date`.

### Próximo paso recomendado

Continuar con `openspec apply chart-totals-from-api` y empezar por `src/helpers/contracts_chart_data.js`:

1. Reemplazar el barrido paginado (hasta 200 páginas de 500 filas) por `GET /contracts` con `embed=pagination,totals`.
2. Mapear `totals.by_fiscal_year` y sus `periods` a la gráfica de barras, manteniendo el sembrado `knownYears` y el tope de seis años; mapear `totals.by_procedure` a la gráfica de pastel.
3. Obtener las opciones de administración y año fiscal mediante `groupby`; retirar el código de agregación en cliente que ya no se use.
4. Integrar la consulta de totales y el estado vacío/error en `src/components/views/public/home.vue`; renombrar las claves internas Q1–Q4 a T1–T4 en el helper y `src/components/partials/contracts_period_bar_chart.vue`.
5. Completar verificaciones API, Prettier, build, OpenSpec y `pnpm api:sync` según `openspec/changes/chart-totals-from-api/tasks.md`.

### Valores de referencia anotados en el change

- Sin filtros: `results=2601`, `total_amount=3005615616.27`; año fiscal 2021: `264847072.69`.
- `fiscal_year=eq:2023`: total `1213926705.81`; periodos `478441425.94`, `169708995.28`, `302628058.68` y `263148225.9`.
- `period_id=eq:1`: total `1005772101.10`, repartido por año en `64643874.81`, `432172294.68`, `478441425.94` y `30514505.66`.
- `by_procedure` sin filtros: Público `1552017710.93`, Adjudicación directa `1382275795.56`, Por invitación `71322109.79`.

## Uso de este archivo

Este es el recordatorio único para retomar el trabajo. Al detenerse en otro día, actualizar aquí la fecha, el estado del proyecto, las decisiones relevantes y el siguiente paso; reutilizar `AVANCE.md` en lugar de crear un archivo distinto por fecha.

Este archivo se creó el 2026-10-16 y todavía no está incluido en un commit.