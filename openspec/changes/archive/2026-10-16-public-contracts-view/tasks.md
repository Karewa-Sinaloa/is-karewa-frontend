# Tasks

## 1. Datos y consultas públicas

- [x] 1.1 Crear una consulta reutilizable para el listado público con `page`, tamaños admitidos, los seis filtros de portada, búsqueda `search` y `embed=pagination,totals`; verificar parámetros y campos solicitados contra `docs/openapi.json` y compilar con `pnpm build`.
- [x] 1.2 Integrar la carga de catálogos y opciones de administración/año fiscal reutilizando la estrategia de la portada; comprobar que los seis filtros mantienen etiquetas y valores existentes sin generar una consulta por cada cambio de selector.
- [x] 1.3 Mapear el conteo/páginas y agregados del backend a estado de vista, con cero para categorías ausentes y protección ante respuestas obsoletas; verificar que los montos representan todo el resultado filtrado y no solo la página actual.

## 2. Listado, filtros y paginación

- [x] 2.1 Completar `src/components/views/public/contracts.vue` con encabezado, descripción, botón de descarga sin acción, filtros reutilizados, búsqueda libre y estados de carga, error y sin resultados; verificar que el contenido no menciona firmado ni estatus.
- [x] 2.2 Implementar la tabla pública con “Ver más” en la primera columna y las columnas informativas especificadas, omitiendo estatus y opciones administrativas; verificar los campos por fila y que no existan acciones de gestión.
- [x] 2.3 Implementar paginación pública de servidor con 12 por defecto, opciones 12/24/48/96, primera/anterior/siguiente/última página, selector, página actual y conteo total; verificar que los criterios nuevos reinician en página 1 y el selector no envía otros tamaños.
- [x] 2.4 Añadir búsqueda libre compatible con `search`, combinada con filtros aplicados y con reinicio a página 1; verificar el término codificado, el comportamiento de búsqueda y que no se envíen criterios de estatus.

## 3. Ficha pública de contrato

- [x] 3.1 Crear la vista de detalle pública de solo lectura y consultar el objeto completo del contrato por identificador; verificar campos visibles/excluidos, título con descripción y monto total con IVA, notas expandibles después de 280 caracteres, fechas largas con hora preservada, indicador de excedente con colores semánticos y manejo de registro inexistente/error.
- [x] 3.2 Registrar `/contratos/:id` sin protección de sesión y enlazar “Ver más” y el retorno al listado; verificar navegación directa sin sesión y que las rutas `/contratos` y `/admin/contratos/:id` conservan su destino actual.

## 4. Presentación y verificación integral

- [x] 4.1 Crear estilos con BEM/tokens compartidos para encabezado, filtros/búsqueda alineados, tarjetas uniformes con iconos, etiquetas de procedimiento y tabla responsiva con scroll horizontal y encabezado sticky; verificar colores semánticos, formato MXN, legibilidad y foco visible en vista estrecha.
- [x] 4.2 Validar sin sesión los flujos de listado, filtros combinados, búsqueda, montos, páginas/tamaños, vacío/error, detalle y retorno; verificar notas expandibles, formato largo de fechas con hora y navegación por teclado.
- [x] 4.3 Ejecutar `pnpm build` y `openspec validate --all`; revisar que el diff de implementación solo afecta la experiencia pública de contratos y que no introduce regresiones en portada o contratos administrativos.
