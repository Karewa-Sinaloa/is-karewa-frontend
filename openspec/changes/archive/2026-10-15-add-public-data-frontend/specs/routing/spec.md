# Spec Delta

> Este delta fija el comportamiento objetivo de routing para una futura superficie pública. No implica aplicar el cambio inmediatamente en código.

## MODIFIED Requirements

### Requirement: Reserva de la raíz para el frontend público
El sistema SHALL servir la raíz `/` como punto de entrada del frontend público y SHALL mantener esa URI libre de vistas del panel administrativo.

#### Scenario: Redirección de la raíz
- **WHEN** se navega a `/`
- **THEN** se muestra el frontend público de visualización de datos y la URL no redirige a `/admin`

#### Scenario: Compatibilidad de `/inicio`
- **WHEN** se navega a `/inicio`
- **THEN** la URL resultante es `/` y se muestra la misma vista pública de inicio

#### Scenario: Sin vistas del panel en la raíz
- **WHEN** se revisa el árbol de rutas del panel
- **THEN** ninguna vista del panel administrativo está declarada en `/`

#### Scenario: Dashboard administrativo preservado
- **WHEN** se navega a `/admin`
- **THEN** se muestra la pantalla de inicio del panel administrativo con su navegación y encabezado actuales
