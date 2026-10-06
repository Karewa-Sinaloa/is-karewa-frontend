# home Specification

## Purpose

Define la vista de inicio del Monitor Karewa: la pantalla de bienvenida que recibe al usuario autenticado desde la navegación principal.

## Requirements

### Requirement: Pantalla de bienvenida

El sistema SHALL mostrar en la ruta de inicio un widget de bienvenida con el título "Bienvenidos" y el texto descriptivo del sistema, junto a la navegación lateral y el encabezado de contenido.

#### Scenario: Acceso con sesión

- **WHEN** un usuario con sesión navega al inicio
- **THEN** ve la navegación lateral, el encabezado y el widget de bienvenida

#### Scenario: Contenido del widget

- **WHEN** se muestra la vista de inicio
- **THEN** el widget presenta el título "Bienvenidos" y la descripción de Karewa como sistema de monitoreo de cuentas públicas
