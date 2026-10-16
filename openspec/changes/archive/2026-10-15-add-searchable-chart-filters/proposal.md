# Proposal

## Why

La barra de filtros de las gráficas del home público usa `<select>` nativos; con catálogos largos (proveedores, unidades administrativas, procedimientos) elegir una opción obliga a hacer scroll por toda la lista sin forma de localizar un elemento por nombre. Se necesita un selector con buscador para filtrar las opciones escribiendo.

## What Changes

- Se sustituyen los seis `<select>` nativos de la barra de filtros del home público por selectores con buscador basados en la librería **vue-multiselect** (v3, compatible con Vue 3; nueva dependencia en `package.json`).
- Se crea un **parcial reutilizable** del selector de filtro (label + multiselect + manejo del estado vacío) en `src/components/partials/`, de modo que la barra de filtros lo consume seis veces en lugar de repetir el markup de cada selector.
- Se conserva el comportamiento existente: cambiar la selección no consulta; la consulta solo se dispara con el botón **Aplicar filtros**; la opción vacía ("Todas/Todos") sigue disponible para limpiar un filtro.
- Estilos del multiselect alineados a los tokens del sistema de diseño (BEM, `var(--...)`), sin literales de color.
- Accesibilidad de los selectores: etiqueta asociada al control, operación por teclado y foco visible, conforme a la spec `accessibility`.

## Capabilities

### New Capabilities

<!-- ninguna -->

### Modified Capabilities

- `home`: el requerimiento de la barra de filtros pasa de especificar `<select>` nativos a especificar **selectores con buscador** que filtran las opciones escribiendo, manteniendo la aplicación explícita por botón y la opción vacía por dimensión.

## Impact

- **Código**: `src/components/partials/chart_filters_bar.vue` (usa el nuevo parcial), nuevo parcial en `src/components/partials/` (selector de filtro con vue-multiselect), `src/components/views/public/home.vue` sin cambios de contrato (mismas props/eventos de la barra).
- **Estilos**: ajustes en `src/assets/sass/components/_home_charts.sass` y sobre-estilos del multiselect con tokens del sistema.
- **Dependencias**: nueva `vue-multiselect` (instalada con `pnpm`).
- **Sin cambios de API**: se sigue consumiendo `GET /contracts` y los mismos catálogos; las opciones de los selectores no cambian de fuente ni de forma (`{ value, label }`).
