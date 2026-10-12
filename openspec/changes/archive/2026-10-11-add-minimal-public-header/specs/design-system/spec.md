# Spec Delta

## ADDED Requirements

### Requirement: Alineación horizontal pública reutilizable
El sistema SHALL resolver la separación lateral del header público con el sistema de tokens o utilidades compartidas, de modo que otras secciones públicas puedan reutilizar la misma alineación sin declarar márgenes incompatibles.

#### Scenario: Header y contenido comparten ancho útil
- **WHEN** una vista pública coloca contenido debajo del encabezado
- **THEN** el contenido puede alinearse con la misma referencia horizontal del header sin introducir una separación lateral distinta por defecto

### Requirement: Estética mínima del header público
El sistema SHALL presentar el header público con fondo claro y enlaces sobrios construidos con la paleta, tipografías y escalas de espaciado ya definidas por el sistema de diseño.

#### Scenario: Auditoría de estilos del encabezado
- **WHEN** se revisan los estilos del header público
- **THEN** su fondo, tipografía, color de enlaces y separación interna provienen del sistema de diseño existente en lugar de valores visuales ajenos a los tokens
