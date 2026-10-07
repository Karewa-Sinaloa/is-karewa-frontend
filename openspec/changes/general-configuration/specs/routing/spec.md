# Spec Delta

## ADDED Requirements

### Requirement: Rutas de la sección de configuración general

El sistema SHALL exponer la configuración general con su base `/configuracion` redirigida a la primera página, el listado paginado en `/configuracion/p/:page`, el alta de usuarios en `/configuracion/usuarios/nuevo` y la ficha de usuario en
`/configuracion/usuarios/:id`, con nombre de ruta camelCase derivado del módulo y con la protección `meta.login` del resto de la aplicación.

#### Scenario: Base de la sección

- **WHEN** se navega a `/configuracion`
- **THEN** la URL resultante es `/configuracion/p/1` y se muestra el dashboard

#### Scenario: Página del listado

- **WHEN** se navega a `/configuracion/p/3`
- **THEN** se muestra la tercera página de la tarjeta de usuarios

#### Scenario: Alta de usuario

- **WHEN** se navega a `/configuracion/usuarios/nuevo`
- **THEN** se muestra el formulario de usuario en modo alta

#### Scenario: Ficha de usuario

- **WHEN** se navega a `/configuracion/usuarios/123`
- **THEN** se muestra la ficha del usuario 123

#### Scenario: Protección de sesión

- **WHEN** un usuario sin sesión navega a cualquiera de estas rutas
- **THEN** es redirigido a `/acceso/inicio-de-sesion` y la ruta solicitada no se muestra
