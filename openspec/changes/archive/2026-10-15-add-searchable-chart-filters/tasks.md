# Tasks

## 1. Setup

- [x] 1.1 Instalar `vue-multiselect` con `pnpm add vue-multiselect` y verificar que queda en `dependencies` de `package.json` con versión v3 (compatible con Vue 3.5)

## 2. Parcial reutilizable del selector de filtro

- [x] 2.1 Crear `src/components/partials/filter_select.vue` con props `id`, `label`, `modelValue` (string, `''` = sin selección) y `options` (`{ value, label }[]`), que envuelve `<VueMultiselect>` en selección simple con búsqueda interna, `allow-empty` y traduce entre el string del modelo y el objeto opción, emitiendo `update:modelValue` con el `value` elegido o `''` al limpiar; verificar que el componente compila con `pnpm build`
- [x] 2.2 Asociar la `<label :for>` al input interno del multiselect (id/nombre accesible) y mantener el mensaje de sin resultados del buscador en español; verificar leyendo el markup renderizado que la etiqueta apunta al control

## 3. Reescritura de la barra de filtros

- [x] 3.1 Reescribir `src/components/partials/chart_filters_bar.vue` consumiendo `<filter-select>` seis veces (administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa, proveedor) con sus labels y opción vacía ("Todas"/"Todos"), conservando props (`modelValue`, `options`), eventos (`update:modelValue`, `apply`) y el botón "Aplicar filtros"; verificar que `src/components/views/public/home.vue` sigue funcionando sin cambios de contrato

## 4. Estilos

- [x] 4.1 Importar el CSS base de vue-multiselect en el parcial y sobre-escribir sus clases con tokens del sistema (colores, tipografía, foco visible) en la hoja SASS que corresponda, siguiendo BEM y sin literales de color; verificar con una búsqueda en las hojas tocadas que no haya hex ni `rgb()` literales
- [x] 4.2 Verificar en el navegador (`pnpm dev`, puerto 5174, sección de gráficas del home público) que los seis selectores se ven consistentes, el buscador filtra opciones largas (p. ej. proveedores), el foco es visible al navegar con Tab y "Aplicar filtros" sigue siendo la única vía de consulta

## 5. Verificación final

- [x] 5.1 Ejecutar `pnpm build` y `openspec validate --all` y verificar ambos sin errores
