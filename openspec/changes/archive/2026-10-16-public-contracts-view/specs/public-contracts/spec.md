# Spec Delta

## Purpose

Define la consulta pública de contratos de Karewa para que cualquier persona pueda explorar el conjunto de registros, acotar resultados y consultar sus datos sin acceder a funciones administrativas.

## ADDED Requirements

### Requirement: Acceso público y consulta de solo lectura
El sistema SHALL permitir consultar contratos y sus fichas desde la superficie pública sin requerir sesión, y SHALL omitir acciones de creación, edición y eliminación.

#### Scenario: Consulta pública sin sesión
- **WHEN** una persona abre el listado o la ficha pública de un contrato sin iniciar sesión
- **THEN** la vista se muestra dentro del shell público y permite consultar la información sin redirigir al acceso administrativo

#### Scenario: Sin acciones administrativas
- **WHEN** se muestra el listado o una ficha pública
- **THEN** no se ofrecen controles para crear, editar o eliminar contratos

#### Scenario: Conjunto consultado
- **WHEN** se carga la vista pública de contratos
- **THEN** se consultan los contratos sin inferir ni aplicar un filtro de “firmado” o de estatus

### Requirement: Encabezado y controles de consulta
El sistema SHALL presentar el título “Contratos”, una descripción clara, un botón visible “Descargar información” sin acción, los filtros del inicio público y un campo de búsqueda libre que no sugiera buscar por estatus.

#### Scenario: Encabezado del listado
- **WHEN** una persona abre el listado público de contratos
- **THEN** ve el título “Contratos”, una descripción profesional que explica cómo consultar y abrir detalles, y el botón “Descargar información” sin que se genere una descarga

#### Scenario: Jerarquía visual de controles
- **WHEN** se presenta el encabezado y la búsqueda
- **THEN** el encabezado ocupa una superficie blanca con bordes redondeados y separación de las secciones vecinas, el botón se alinea a la derecha del título y la búsqueda queda alineada a la derecha bajo los filtros

#### Scenario: Filtros del inicio público
- **WHEN** se muestran los controles de filtro
- **THEN** ofrecen administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa convocante y proveedor con los mismos catálogos y semántica que los filtros del inicio público

#### Scenario: Búsqueda libre
- **WHEN** la persona proporciona un término de búsqueda y ejecuta la consulta
- **THEN** el término se envía al mecanismo `search` de contratos junto con los filtros activos, sin presentar ni aplicar búsqueda por estatus

#### Scenario: Aplicación combinada
- **WHEN** la persona aplica filtros o cambia el término de búsqueda
- **THEN** el listado, el conteo y los montos agregados representan la misma combinación vigente de criterios

### Requirement: Tarjetas de montos agregados
El sistema SHALL mostrar tarjetas para el monto total y los montos por Licitación Pública, Invitación y Adjudicación Directa, calculados por el backend sobre todo el conjunto que coincide con los criterios vigentes, sin limitarse a la página visible.

#### Scenario: Consulta agregada inicial
- **WHEN** se completa la consulta de contratos
- **THEN** las tarjetas muestran el monto total y los montos de las tres categorías de procedimiento usando los totales devueltos por el backend

#### Scenario: Consulta con filtros o búsqueda
- **WHEN** se aplica una combinación distinta de filtros o búsqueda
- **THEN** las tarjetas se actualizan con los agregados de todos los resultados coincidentes, aunque la tabla solo muestre una página

#### Scenario: Categoría sin contratos coincidentes
- **WHEN** el backend no devuelve contratos para una de las tres categorías de tarjeta
- **THEN** esa tarjeta muestra un monto de cero y el monto total sigue incluyendo cualquier otro procedimiento coincidente

#### Scenario: Composición de tarjetas
- **WHEN** se muestran las tarjetas de montos
- **THEN** tienen tamaños uniformes, se alinean horizontalmente cuando hay espacio y cada una incluye un icono representativo, monto legible y descripción breve

#### Scenario: Presentación monetaria
- **WHEN** se presentan los montos agregados
- **THEN** se expresan en pesos mexicanos con formato numérico legible y se identifican con colores semánticos de la paleta: total `primary`, Licitación Pública `success`, Invitación `warning` y Adjudicación Directa `danger`

### Requirement: Listado público de contratos
El sistema SHALL mostrar en tabla los contratos coincidentes, sin la columna de estatus ni acciones administrativas, con una acción “Ver más” en la primera columna y las columnas informativas del listado administrativo excepto estatus y opciones.

#### Scenario: Filas y datos del listado
- **WHEN** la consulta devuelve contratos
- **THEN** cada fila presenta “Ver más” primero, seguido de identificador del contrato, proveedor, unidad convocante, unidad solicitante, materia, procedimiento, administración, descripción, fecha y tipo de contrato

#### Scenario: Acceso al detalle desde una fila
- **WHEN** la persona activa “Ver más” en una fila
- **THEN** navega a la ficha pública correspondiente al contrato de esa fila

#### Scenario: Distinción visual del procedimiento
- **WHEN** se muestra el nombre de procedimiento en una fila
- **THEN** aparece centrado dentro de una etiqueta visual con bordes redondeados y color semántico asociado a la categoría cuando corresponda

#### Scenario: Sin resultados
- **WHEN** la consulta no devuelve contratos
- **THEN** se muestra un mensaje que informa que no hubo coincidencias y no se presenta una tabla vacía como si contuviera registros

### Requirement: Paginación y conteo de resultados
El sistema SHALL paginar los contratos en el servidor con un tamaño inicial de 12 filas, ofrecer tamaños de 12, 24, 48 y 96, y mostrar la cantidad total de coincidencias devuelta por el backend.

#### Scenario: Navegación entre páginas
- **WHEN** existen varias páginas de resultados
- **THEN** se puede ir a la primera, anterior, siguiente y última página y se informa la página actual y el total de páginas

#### Scenario: Cambio del tamaño de página
- **WHEN** la persona selecciona 12, 24, 48 o 96 resultados por página
- **THEN** el listado solicita el tamaño seleccionado y vuelve a la primera página

#### Scenario: Conteo total
- **WHEN** se completa una consulta con filtros o búsqueda
- **THEN** se muestra el total de resultados coincidentes reportado por el backend, independientemente de la página actual

#### Scenario: Criterios modificados
- **WHEN** se aplican filtros o búsqueda mientras se está en otra página
- **THEN** la consulta comienza desde la primera página y actualiza filas, páginas y conteo para los nuevos criterios

### Requirement: Tabla adaptable y accesible
El sistema SHALL preservar la legibilidad de la tabla en distintos tamaños de pantalla, permitir desplazamiento horizontal cuando sus columnas excedan el ancho y mantener visibles los encabezados durante el desplazamiento vertical del listado.

#### Scenario: Tabla en pantalla estrecha
- **WHEN** la tabla es más ancha que el área disponible
- **THEN** se puede recorrer horizontalmente sin perder el acceso a las columnas ni deformar su contenido para ocultarlo

#### Scenario: Desplazamiento vertical
- **WHEN** la persona desplaza verticalmente las filas
- **THEN** la fila de encabezados permanece visible para identificar las columnas

#### Scenario: Uso por teclado y tecnologías de asistencia
- **WHEN** la persona navega por búsqueda, filtros, paginación y enlaces de detalle mediante teclado o lector de pantalla
- **THEN** los controles tienen etiquetas y nombres accesibles, el foco es visible y la tabla conserva semántica de encabezados y celdas

### Requirement: Ficha pública de contrato
El sistema SHALL ofrecer una ruta pública de detalle del contrato y presentar en modo de solo lectura sus campos recibidos en el objeto `data`, sin acciones administrativas.

#### Scenario: Abrir ficha de contrato
- **WHEN** se abre el enlace “Ver más” de un contrato
- **THEN** se muestran los campos del contrato con etiquetas legibles y formato adecuado, excepto los identificadores técnicos `id`, `procedure_id`, `subject_id`, `partida_type`, `period_id`, `status_id`, `partida_id`, `provider_id`, `organizer_admin_unit_id`, `admin_unit_type_id`, `applicant_admin_unit_id` y `contract_type_id`; los valores nulos/vacíos tienen un marcador y hay un mecanismo para regresar al listado

#### Scenario: Resumen superior del contrato
- **WHEN** se muestra el encabezado de la ficha
- **THEN** la descripción del contrato ocupa el título y debajo se muestra el monto total con IVA

#### Scenario: Expandir notas extensas
- **WHEN** las notas del contrato o de la organización superan 280 caracteres
- **THEN** el texto se presenta inicialmente truncado y un botón accesible permite expandirlo y contraerlo

#### Scenario: Fechas en detalle
- **WHEN** un campo de fecha se presenta en la ficha
- **THEN** se usa el formato largo en español y, si el dato incluye hora, esta se conserva

#### Scenario: Indicador de excedente
- **WHEN** `amount_was_exceeded` vale `0` o `1`
- **THEN** se presenta “Sin exceder” con fondo success o “Excedido” con fondo danger, aplicados solo a la etiqueta con extremos redondeados y no al contenedor del campo

#### Scenario: Identificador inexistente o consulta fallida
- **WHEN** el identificador no corresponde a un contrato disponible o la consulta falla
- **THEN** se informa que no fue posible mostrar el detalle y se mantiene una vía de regreso al listado público

### Requirement: Estados de consulta y errores
El sistema SHALL comunicar de forma diferenciada la carga inicial, la ausencia de coincidencias y los errores de consulta, sin presentar valores agregados de una consulta anterior como si correspondieran a la vigente.

#### Scenario: Consulta en curso
- **WHEN** se solicita el listado o se actualizan sus criterios
- **THEN** se indica que la consulta está en curso y no se atribuyen a los nuevos criterios datos agregados desactualizados

#### Scenario: Error de listado o agregados
- **WHEN** falla la consulta de contratos
- **THEN** se informa el error mediante la alerta del sistema y se muestra un estado vacío de datos vigentes hasta que una consulta posterior tenga éxito
