# Design

## Context

Consulta la motivación en `proposal.md` y los resultados esperados en `specs/public-contracts/spec.md`. La ruta `/contratos` ya renderiza `src/components/views/public/contracts.vue`, pero solo contiene el shell público; `src/router/index.js` no tiene una ruta pública para detalle. La portada de `src/components/views/public/home.vue` ya integra `chart-filters-bar`, catálogos y `fetchContractsForCharts`; este helper recorre páginas para agregar datos de gráficas. El listado administrativo usa `GET /contracts` con `page`, `limit`, `embed=pagination` y `search`, pero contiene opciones de edición/borrado y la columna de estatus, que no aplican a la vista pública.

La API documenta en `docs/openapi.json` el uso de `embed=pagination,totals` para solicitar filas, conteo y agregados de la consulta filtrada completa. La vista pública debe conservar la sesión visual existente, pero no depender de permisos administrativos. El listado no presenta el estatus; la ficha de detalle muestra todos los campos recibidos, incluido el estatus si está presente en la respuesta.

## Goals / Non-Goals

**Goals:**
- Completar el listado público y añadir una ficha pública de solo lectura con una ruta sin protección de sesión.
- Compartir filtros y catálogos existentes donde su semántica coincide con la portada, manteniendo un único criterio activo para filas, paginación y totales.
- Usar paginación de contratos del servidor y los agregados documentados del backend, sin descargar todo el conjunto para construir la tabla ni volver a sumar totales en cliente.
- No filtrar por estatus ni condición de firmado, y omitir el estatus del listado. La ficha presenta todos los campos de la respuesta del contrato; la búsqueda libre se mantiene sobre los campos admitidos por el endpoint.

**Non-Goals:**
- No implementar descarga, exportación, ni acciones de mantenimiento de contratos.
- No cambiar la portada pública, el listado administrativo, las reglas de negocio de contratos ni el contrato OpenAPI.
- No crear un nuevo mecanismo de búsqueda por estatus ni filtrar por una condición de firmado.

## Decisions

1. **Consulta paginada dedicada para el listado y agregados del API.** Crear una función de consulta pública que use `apiRequest.Get` sobre `contracts`, con `page`, `limit`, `embed=pagination,totals`, los seis filtros activos existentes y `search` cuando haya término. Solicitar los campos requeridos para la tabla y evitar solicitar/renderizar `status_name` en el listado. Usar `pagination` para páginas y conteo, y `totals.total_amount` más `totals.by_procedure` para las tarjetas. El endpoint es preferible a `fetchContractsForCharts`, que recorre múltiples páginas (hasta 200) y fue diseñado para agregar gráficas en cliente; esa estrategia sería costosa y podría mostrar agregados de solo una página si se adaptara incorrectamente.

2. **Reutilizar filtros y sus catálogos actuales, no la vista de gráficas.** Montar `chart-filters-bar` en la página de contratos y manejar sus eventos locales como en `home.vue`. Cargar periodos, procedimientos, proveedores y unidades desde los mismos módulos de catálogo; derivar administración y año fiscal con la estrategia disponible en `contracts_chart_data.js` para conservar opciones y etiquetas coherentes. Mantener independientes los datos de la tabla y las gráficas de inicio. Alternativa descartada: duplicar el formulario, porque las opciones y comportamiento divergirían.

3. **Una sola consulta lógica por criterios y página.** Mantener filtros seleccionados y término de búsqueda en estado de vista; cualquier cambio de criterios vuelve a página 1, y la navegación/cambio de tamaño solicita otra página sin alterar los criterios. El término se recorta y codifica como `search`; no se sintetiza un `status_id`. Aplicar un retardo corto al tipeo para evitar una petición por tecla, preservando la búsqueda inmediata del CMS en comportamiento y sin añadir dependencia. Ignorar respuestas de consultas anteriores si una respuesta más reciente ya corresponde a los criterios actuales.

4. **Separar listado y detalle con rutas públicas.** Mantener `publicContractsView` en `/contratos` y añadir una vista de detalle reutilizando el patrón de `public-shell`, con ruta `/contratos/:id` sin `meta.login`. Obtener el registro completo por identificador con lectura (`GET /contracts/{id}`) y mostrar los campos presentes en el objeto `data`, excepto los identificadores técnicos `id`, `procedure_id`, `subject_id`, `partida_type`, `period_id`, `status_id`, `partida_id`, `provider_id`, `organizer_admin_unit_id`, `admin_unit_type_id`, `applicant_admin_unit_id` y `contract_type_id`. Mostrar valores nulos/vacíos con un marcador visible y usar etiquetas legibles y formato adecuado para importes, fechas, booleanos y enlaces. Usar la descripción como título del resumen superior y mostrar debajo el monto total con IVA. Formatear fechas con estilo largo en español sin descartar la hora recibida; truncar notas y notas de organización después de 280 caracteres con control accesible de expansión. Presentar `amount_was_exceeded` como etiqueta “Sin exceder”/success para `0` y “Excedido”/danger para `1`, con el fondo limitado a la etiqueta redondeada. La ficha enlaza de vuelta a `/contratos` y permanece en modo de solo lectura; no se reutiliza `ContractView`, porque esa pantalla pertenece a `/admin`, tiene formularios y depende del flujo autenticado.

5. **Presentación desde tokens compartidos.** Crear estilos scoped/BEM para secciones, tarjetas y tabla, usando variables CSS exportadas por `settings/` en lugar de colores literales. Usar el formateador `formatCurrency` para MXN y asignar los tokens semánticos `primary`, `success`, `warning` y `danger` a las cuatro tarjetas y a las etiquetas conocidas de procedimiento. Mantener la tabla en un contenedor con overflow horizontal y encabezado sticky; conservar controles y texto legibles en tamaños estrechos.

6. **Consulta y errores con estados separados.** Mantener estados explícitos de carga, resultado vacío y fallo; en una consulta nueva limpiar o marcar como no vigentes los agregados previos y filas hasta el éxito, y reportar errores a `store.push_alert`, siguiendo el patrón de `home.vue`. La descarga permanecerá visible pero deshabilitada/sin handler hasta que exista una decisión y endpoint de exportación.

## Risks / Trade-offs

- [La respuesta de la API podría no incluir `totals.by_procedure` para algún procedimiento o usar nombres distintos de los tres nombres visibles] → normalizar nombres conocidos, mostrar cero para categorías ausentes y verificar contra la respuesta OpenAPI real; mantener el total general proveniente de `totals.total_amount`.
- [La derivación de filtros de administración y año fiscal recorre contratos, como ya hace la portada] → limitar esa lectura al conjunto de opciones y no reutilizarla para filas ni totales; revisar rendimiento con el tamaño real de datos y, si resulta excesivo, proponer por separado que la API ofrezca esos catálogos.
- [Una respuesta lenta anterior puede reemplazar resultados de una búsqueda posterior] → asociar consultas con una secuencia/criterios vigentes y descartar respuestas obsoletas.
- [La API puede agregar campos al contrato] → construir la ficha desde las propiedades realmente presentes en `data`, con etiquetas conocidas y un fallback legible para campos nuevos; solo omitir los identificadores técnicos acordados.

## Migration Plan

No se requiere migración de datos ni cambio de API. Añadir componentes/rutas de la vista pública conservando `/contratos`; desplegar el frontend y validar listados (sin columna de estatus), filtros, agregados, ficha con todos los campos recibidos y navegación sin sesión. Para revertir, retirar la nueva ruta de detalle y volver a dejar el componente de contratos en su estado previo; la ruta pública existente sigue funcionando.
