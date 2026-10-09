# Spec Delta

## MODIFIED Requirements

### Requirement: Acción de alta contextual

El sistema SHALL ofrecer en la vista activa un acceso de alta del módulo cuando la vista lo registra y el rol de la sesión está autorizado a crear en ese módulo, SHALL no mostrar ese acceso cuando el rol no está autorizado, y SHALL ocultar y limpiar esos
accesos al cambiar de ruta.

#### Scenario: Listado con alta disponible

- **WHEN** un listado registra su acción de alta al montarse
- **THEN** la aplicación muestra el acceso "Nuevo…" que navega al formulario de alta del módulo

#### Scenario: Rol no autorizado a crear

- **WHEN** un listado registra su acción de alta al montarse y el rol de la sesión no está autorizado a crear en ese módulo
- **THEN** el acceso de alta no se muestra

#### Scenario: Cambio de ruta

- **WHEN** el usuario navega a otra ruta
- **THEN** el acceso de alta se cierra y la lista de acciones registradas queda vacía
