# Spec Delta

## ADDED Requirements

### Requirement: Registro de la configuración general en el pie de la navegación

El sistema SHALL registrar la sección de configuración general en la navegación lateral mediante el icono de configuración de su pie, que enlaza por nombre de ruta al dashboard de la sección.

#### Scenario: Icono del pie

- **WHEN** se muestra el pie de la navegación lateral
- **THEN** el icono de configuración queda visible con un nombre accesible que indica su propósito

#### Scenario: Enlace a la configuración

- **WHEN** el usuario activa el icono de configuración del pie
- **THEN** la navegación se resuelve por el nombre de la ruta declarada, no por la URL en texto, y se abre el dashboard de la sección
