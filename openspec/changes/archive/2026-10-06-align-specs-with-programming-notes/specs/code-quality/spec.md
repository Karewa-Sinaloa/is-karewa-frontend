# Spec Delta

## ADDED Requirements

### Requirement: Sin regresiones al corregir superficies compartidas

El sistema SHALL conservar el comportamiento de las vistas, rutas y componentes que consumen una pieza compartida —parcial, objeto u hoja de estilos— cuando esa pieza se corrige o se modifica.

#### Scenario: Corrección en un parcial compartido

- **WHEN** se corrige un parcial compartido (navegación lateral, encabezado de contenido, popups, paginación, ayuda)
- **THEN** las vistas que lo consumen conservan su presentación y su comportamiento

#### Scenario: Corrección en una forma u hoja compartida

- **WHEN** se corrige un objeto o una hoja compartida (botones, formularios, capa base)
- **THEN** las superficies que la consumen siguen conforme a los tokens y a la nomenclatura del sistema, sin verse afectadas de otro modo

#### Scenario: Pieza compartida por varias rutas

- **WHEN** un cambio modifica una pieza que varias rutas utilizan
- **THEN** se contrasta el resultado con los requisitos de esas rutas y ninguna dejó de cumplir su comportamiento
