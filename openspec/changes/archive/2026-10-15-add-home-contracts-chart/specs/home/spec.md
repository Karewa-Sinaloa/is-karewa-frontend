# Spec Delta

## ADDED Requirements

### Requirement: Sección de gráficas en la vista de inicio

El sistema SHALL mostrar en la vista pública de inicio (`/`), debajo del hero de portada, una sección de dos columnas: la izquierda ocupa el 65% del ancho y presenta la gráfica de barras de contratos, y la derecha ocupa el 35% y presenta la gráfica de pastel por tipo de procedimiento.

#### Scenario: Estructura de dos columnas

- **WHEN** un visitante navega a la vista pública de inicio
- **THEN** la vista conserva el encabezado público y el hero y, debajo, muestra la sección de gráficas con la gráfica de barras en la columna izquierda (65%) y la gráfica de pastel en la columna derecha (35%)

#### Scenario: Barra de filtros sobre las columnas

- **WHEN** se muestra la sección de gráficas
- **THEN** la barra de filtros aparece sobre la sección de columnas, no dentro de ninguna de las dos columnas

### Requirement: Barra de filtros de la sección de gráficas

La sección de gráficas SHALL incluir una barra de filtros con un selector por cada una de estas dimensiones: administración, año fiscal, periodo (trimestre), tipo de procedimiento, unidad administrativa (convocante) y proveedor, junto con un botón para aplicar los filtros.

#### Scenario: Selectores presentes

- **WHEN** se muestra la barra de filtros
- **THEN** presenta los seis selectores etiquetados (administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa y proveedor) y el botón de aplicación de filtros

#### Scenario: Cambiar un valor no ejecuta la consulta

- **WHEN** el usuario cambia el valor de cualquiera de los selectores
- **THEN** no se realiza ninguna consulta ni se actualiza ninguna gráfica por el solo hecho de cambiar el valor

### Requirement: Ejecución explícita de los filtros

El sistema SHALL aplicar los filtros de la barra únicamente cuando el usuario pulsa el botón de aplicación, combinando las dimensiones con selección vigente en una sola consulta cuyo resultado refresca ambas gráficas.

#### Scenario: Aplicar filtros combinados

- **WHEN** el usuario elige valores en algunos selectores y pulsa el botón de aplicar filtros
- **THEN** ambas gráficas se actualizan con los datos que cumplen todos los filtros elegidos

#### Scenario: Selector sin selección

- **WHEN** al pulsar el botón un selector no tiene selección
- **THEN** esa dimensión no restringe la consulta y los datos se agregan sin considerarla

#### Scenario: Valor cambiado sin aplicar

- **WHEN** el usuario cambia un valor de filtro después de una aplicación y no vuelve a pulsar el botón
- **THEN** las gráficas siguen mostrando el resultado de la última aplicación, no el valor recién elegido

#### Scenario: Filtro de administración

- **WHEN** el usuario elige una administración y aplica los filtros
- **THEN** la consulta se restringe a los contratos de esa administración

### Requirement: Gráfica de barras por periodo del año fiscal

El sistema SHALL presentar en la columna izquierda una gráfica de barras que muestra en el eje Y el monto total con impuestos agregado de los contratos y en el eje X una barra por cada periodo del año fiscal.

#### Scenario: Agregado por periodo

- **WHEN** la gráfica de barras se dibuja con contratos disponibles
- **THEN** cada barra representa un periodo del año fiscal y su altura corresponde a la suma del monto total con impuestos de los contratos de ese periodo

#### Scenario: Periodos sin importes

- **WHEN** un periodo del año fiscal no tiene contratos bajo los filtros aplicados
- **THEN** su barra se muestra sin altura (monto cero) y el periodo permanece identificado en el eje X

#### Scenario: Importes legibles

- **WHEN** se muestra una barra con monto mayor a cero
- **THEN** el valor asociado a la barra se presenta en formato monetario con separadores de miles

### Requirement: Gráfica de pastel por tipo de procedimiento

El sistema SHALL presentar en la columna derecha una gráfica de pastel que muestra la suma del monto total con impuestos de los contratos agrupada por tipo de procedimiento.

#### Scenario: Porciones por procedimiento

- **WHEN** la gráfica de pastel se dibuja con contratos disponibles
- **THEN** cada porción representa un tipo de procedimiento y su tamaño corresponde a la suma del monto total con impuestos de los contratos de ese procedimiento, identificada con el nombre del procedimiento y su monto

#### Scenario: Procedimientos sin importes

- **WHEN** un tipo de procedimiento no tiene contratos bajo los filtros aplicados
- **THEN** no se dibuja porción para ese procedimiento

### Requirement: Opciones de los selectores de filtro

El sistema SHALL poblar los selectores de filtro con opciones veraces: los periodos, tipos de procedimiento, proveedores y unidades administrativas provienen de sus catálogos del sistema, y las administraciones y años fiscales corresponden a los valores registrados en los contratos.

#### Scenario: Catálogos del sistema

- **WHEN** se abre un selector de periodo, tipo de procedimiento, proveedor o unidad administrativa
- **THEN** sus opciones corresponden a los registros de su catálogo y permiten elegir cualquiera de ellos

#### Scenario: Administraciones y años fiscales

- **WHEN** se abren los selectores de administración y año fiscal
- **THEN** sus opciones corresponden a las administraciones y los años fiscales registrados en los contratos

### Requirement: Estados vacíos y de error de las gráficas

El sistema SHALL mostrar un mensaje de sin datos en la columna de una gráfica cuando los filtros aplicados no producen contratos, y SHALL mostrar la alerta del código devuelto cuando la consulta falla, dejando la sección sin datos hasta un nuevo intento.

#### Scenario: Sin contratos para los filtros aplicados

- **WHEN** la consulta con los filtros aplicados no devuelve contratos
- **THEN** ambas columnas muestran un mensaje de sin datos en lugar de gráficas vacías

#### Scenario: Error del servidor en la consulta

- **WHEN** la consulta de datos de las gráficas falla
- **THEN** se muestra la alerta del código devuelto y la sección queda sin datos hasta que el usuario aplique los filtros de nuevo

### Requirement: Accesibilidad de la sección de gráficas

La sección de gráficas SHALL ser accesible: cada gráfica expone un nombre accesible que describe qué muestra, y los controles de la barra de filtros son operables por teclado con foco visible.

#### Scenario: Nombre accesible de las gráficas

- **WHEN** un lector de pantalla recorre la sección de gráficas
- **THEN** cada gráfica expone un nombre accesible que indica qué representa (contratos por periodo o montos por tipo de procedimiento)

#### Scenario: Operación por teclado de los filtros

- **WHEN** el usuario navega la barra de filtros solo con teclado
- **THEN** puede recorrer los selectores y el botón de aplicar filtros, con foco visible en el control activo
