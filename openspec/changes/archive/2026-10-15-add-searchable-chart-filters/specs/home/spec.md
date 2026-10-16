# Spec Delta

## ADDED Requirements

### Requirement: Selectores de filtro con búsqueda

La barra de filtros de las gráficas del home público SHALL usar en cada dimensión un selector con buscador que permita localizar las opciones escribiendo parte de su nombre, en lugar de un desplegable nativo que obliga a recorrer la lista completa con scroll.

#### Scenario: Filtrado de opciones por texto

- **WHEN** el visitante escribe texto en el buscador de un selector de filtro
- **THEN** solo quedan visibles las opciones cuyo nombre contiene el texto escrito, sin necesidad de hacer scroll por la lista completa

#### Scenario: Búsqueda sin coincidencias

- **WHEN** el texto escrito no coincide con ninguna opción del selector
- **THEN** el selector muestra un mensaje de sin resultados y no permite seleccionar nada hasta que el texto cambie o se limpie

#### Scenario: Los seis selectores son de búsqueda

- **WHEN** se muestra la barra de filtros con sus dimensiones (administración, año fiscal, periodo, tipo de procedimiento, unidad administrativa y proveedor)
- **THEN** las seis dimensiones usan el mismo patrón de selector con buscador y misma apariencia y comportamiento

### Requirement: Selección y limpieza en los selectores de filtro

Cada selector de filtro SHALL permitir elegir una opción, ver la opción elegida tras cerrar el desplegable y volver al estado sin selección ("Todas"/"Todos") de la dimensión, manteniendo que ningún cambio de selección dispara consulta: la consulta sigue siendo exclusiva del botón de aplicación de filtros.

#### Scenario: Selección de una opción

- **WHEN** el visitante elige una opción del desplegable de un filtro
- **THEN** el selector muestra esa opción como selección vigente y no se realiza ninguna consulta por el solo hecho de elegir

#### Scenario: Volver al estado sin selección

- **WHEN** el visitante limpia la selección de un filtro
- **THEN** ese filtro vuelve a su estado sin selección, la dimensión deja de restringir la consulta y no se dispara ninguna consulta hasta pulsar el botón de aplicación

#### Scenario: Aplicar con selección de un buscador

- **WHEN** el visitante elige una opción mediante el buscador y pulsa el botón de aplicar filtros
- **THEN** la consulta se restringe al valor elegido, igual que si se hubiera elegido sin usar la búsqueda
