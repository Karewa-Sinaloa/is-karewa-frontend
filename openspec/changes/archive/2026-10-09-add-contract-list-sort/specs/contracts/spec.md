# Delta: contracts

## ADDED Requirements

(ninguna)

## MODIFIED Requirements

### Requirement: Listado de contratos

El sistema SHALL presentar los contratos en una tabla paginada cuya ruta indica la página, con una columna de opciones que permite ver y eliminar cada contrato, una búsqueda libre de texto que la vista envía al servidor con el parámetro `search` y un selector
de orden, colocado junto al campo de búsqueda, cuya elección se envía al servidor en el parámetro `sort` (por defecto `-contract_date`) y reordena el listado desde la primera página.

#### Scenario: Página con contratos

- **WHEN** un usuario con sesión navega a una página del listado de contratos
- **THEN** se muestran los contratos de esa página con sus datos de proveedor, unidades, materia, procedimiento, estado, fecha y tipo

#### Scenario: Búsqueda libre de texto

- **WHEN** el usuario escribe un término en el campo de búsqueda del listado
- **THEN** la vista vuelve a pedir los contratos desde la primera página con el parámetro `search` y muestra únicamente los registros que coinciden

#### Scenario: Búsqueda sin coincidencias

- **WHEN** un término de búsqueda activo no coincide con ningún contrato
- **THEN** la vista muestra el mensaje de sin resultados acompañado del término buscado y no ofrece el alta de contratos

#### Scenario: Orden por fecha

- **WHEN** se carga el listado sin que el usuario haya elegido un orden
- **THEN** los contratos se piden al servidor con `sort=-contract_date` y aparecen del más reciente al más antiguo por fecha de contrato

#### Scenario: Opciones del selector de orden

- **WHEN** el usuario abre el selector de orden del listado
- **THEN** ofrece materia, tipo de procedimiento, estado y tipo de contrato en ambas direcciones alfabéticas, y fecha de inicio de administración y fecha de contrato en ambas direcciones cronológicas

#### Scenario: Ordenamiento seleccionado

- **WHEN** el usuario elige una opción distinta en el selector de orden
- **THEN** la vista vuelve a pedir los contratos desde la primera página con el parámetro `sort` que corresponde al campo y la dirección elegidos y la tabla refleja ese orden

#### Scenario: Orden con búsqueda activa

- **WHEN** el usuario cambia el orden mientras hay un término de búsqueda vigente
- **THEN** la nueva solicitud conserva el parámetro `search` junto al nuevo parámetro `sort`

#### Scenario: Sin contratos

- **WHEN** el servidor no devuelve contratos en la página solicitada
- **THEN** la vista no muestra filas ni control de paginación

#### Scenario: Error del servidor al listar

- **WHEN** la solicitud del listado falla
- **THEN** se muestra la alerta del código devuelto y la vista queda vacía

## REMOVED Requirements

(ninguna)
