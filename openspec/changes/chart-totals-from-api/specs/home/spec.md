# Spec Delta

## ADDED Requirements

### Requirement: Totales de las gráficas provistos por el API

El sistema SHALL obtener los montos que alimentan la gráfica de barras y la gráfica de pastel desde el objeto `totals` que `GET /contracts` devuelve con `embed=totals` (suma por año fiscal con su desglose por periodo, suma por tipo de procedimiento y conteo de
coincidencias), calculado por el servidor sobre todos los contratos que cumplen los filtros aplicados e ignorando la paginación, y SHALL NO agregar montos por suma en el cliente.

#### Scenario: Sumas del servidor bajo filtros aplicados

- **WHEN** el visitante aplica los filtros y se actualizan las gráficas
- **THEN** las barras y las porciones muestran las sumas por periodo y por tipo de procedimiento que el servidor calculó sobre todos los contratos que cumplen los filtros vigentes

#### Scenario: Totales ajenos a la paginación

- **WHEN** el conjunto de contratos que cumple los filtros excede el tamaño de una página
- **THEN** los montos mostrados reflejan el conjunto completo que cumple los filtros, no solo la página recibida

#### Scenario: Correspondencia con los montos de los contratos

- **WHEN** se compara un monto mostrado con la suma del monto total con impuestos de los contratos que cumplen los filtros
- **THEN** ambos valores coinciden

#### Scenario: Estado vacío según el conteo de coincidencias

- **WHEN** el conteo de coincidencias que informa el objeto de totales es cero
- **THEN** ambas columnas muestran el mensaje de sin datos en lugar de gráficas

## MODIFIED Requirements

### Requirement: Gráfica de barras por periodo del año fiscal

El sistema SHALL presentar en la columna izquierda una gráfica de barras que muestra en el eje Y el monto total con impuestos agregado de los contratos y en el eje X, por cada año fiscal del eje, una barra por cada uno de los cuatro periodos del año fiscal
definidos en el catálogo de periodos.

#### Scenario: Agregado por periodo

- **WHEN** la gráfica de barras se dibuja con contratos disponibles
- **THEN** cada barra representa un periodo del año fiscal y su altura corresponde a la suma del monto total con impuestos de los contratos de ese periodo

#### Scenario: Periodos sin importes

- **WHEN** un periodo del año fiscal no tiene contratos bajo los filtros aplicados
- **THEN** su barra se muestra sin altura (monto cero) y el periodo permanece identificado en el eje X

#### Scenario: Importes legibles

- **WHEN** se muestra una barra con monto mayor a cero
- **THEN** el valor asociado a la barra se presenta en formato monetario con separadores de miles

#### Scenario: Periodo registrado y no fecha de firma

- **WHEN** un contrato se contabiliza en la gráfica
- **THEN** su monto se acumula en el periodo del año fiscal registrado en el contrato, no en el trimestre de calendario que corresponde a la fecha del contrato
