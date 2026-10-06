# Spec Delta

## ADDED Requirements

### Requirement: Toda ruta de listado paginado expone la página

El sistema SHALL identificar la página de todo listado paginado en su ruta, con un segmento de página como el de los contratos, y SHALL redirigir la ruta base del módulo a su primera página.

#### Scenario: Listado paginado con página en la ruta

- **WHEN** un módulo ofrece un listado paginado
- **THEN** su ruta identifica la página actual (por ejemplo `/proveedores/p/2`) y el listado muestra esa página

#### Scenario: Ruta base del módulo

- **WHEN** se navega a la ruta base de un módulo paginado sin número de página
- **THEN** se redirige a su primera página

#### Scenario: Listado no paginado

- **WHEN** un módulo ofrece un listado que no se pagina
- **THEN** su ruta no declara segmento de página
