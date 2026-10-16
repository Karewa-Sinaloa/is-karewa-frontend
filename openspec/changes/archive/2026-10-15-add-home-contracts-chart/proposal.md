# Proposal

## Why

La vista pública de inicio (`/`) hoy solo muestra el hero de portada, sin aprovechar los datos de contratos que el sistema ya administra. El usuario necesita ver de un vistazo la evolución del gasto por periodo fiscal y la distribución del monto por tipo de procedimiento, sin tener que recorrer el listado de contratos.

## What Changes

- Se añade a la vista pública de inicio (`/`) una **sección de dos columnas** (izquierda 65%, derecha 35%) bajo el hero de portada.
- Columna izquierda: **gráfica de barras** (ECharts) con el **monto total con impuestos** (`total_amount`) agregado por **periodo del año fiscal** (trimestre del catálogo `periodos-contratos`), un barra por periodo.
- Columna derecha: **gráfica de pastel** (ECharts) con la **suma de montos por tipo de procedimiento** (licitación pública, adjudicación directa, adjudicación por invitación, etc., según el catálogo `procedimientos`).
- **Barra de filtros sobre la sección de columnas**, con un selector por cada dimensión: administración, año fiscal, periodo (trimestre), tipo de procedimiento, unidad administrativa (convocante) y proveedor; más un botón **Aplicar filtros**.
- Los filtros **solo se ejecutan al pulsar el botón**: cambiar el valor de un selector no consulta ni redibuja nada.
- Ambas gráficas se actualizan con los filtros aplicados; el estado inicial (sin filtros) muestra el agregado de todos los contratos.
- Nuevas dependencias: `echarts` + `vue-echarts` (primer uso de una librería de gráficas en el proyecto; se instalan con pnpm y se documentan en el historial).

## Capabilities

### New Capabilities

<!-- ninguna -->

### Modified Capabilities

- `home`: la vista pública de inicio pasa de ser solo el hero de portada a incluir la sección de gráficas de contratos con su barra de filtros y su comportamiento de consulta (aplicación explícita por botón, agregación de montos, estados vacío/error).

## Impact

- **Vistas/parciales**: `src/components/views/public/home.vue` (incorpora la sección) y nuevos parciales reutilizables en `src/components/partials/` (barra de filtros, gráfica de barras, gráfica de pastel).
- **Datos**: se consume `GET /contracts` con `fields` mínimo y filtros por query; se agregan en cliente el `total_amount` por `period_id` (barras) y por `procedure_id` (pastel). Catálogos para los selectores: `periodos-contratos`, `procedimientos`, `proveedores`, `unidades-administrativas`; años fiscales y administraciones se derivan de los datos de contratos.
- **Dependencias**: `echarts`, `vue-echarts` (nuevas, en `package.json`).
- **Estilos**: nueva hoja SASS en `src/assets/sass/components/` consumiendo solo tokens de `settings/` (BEM).
- **Sin cambios de API**: se usan endpoints existentes (públicos, sin autorización requerida en el contrato); no se crean rutas ni se modifica el enrutamiento ni los permisos (sección de solo lectura visible con y sin sesión en la portada `/`).
