# Spec Delta

## Purpose

Define qué rutas expone el Monitor Karewa, cómo se protegen con la sesión del usuario y cómo se comporta la navegación entre ellas.

## ADDED Requirements

### Requirement: Rutas de aplicación protegidas

El sistema SHALL permitir el acceso a las secciones de la aplicación únicamente con una sesión válida y SHALL redirigir al inicio de sesión cuando no la haya.

#### Scenario: Acceso sin sesión

- **WHEN** un usuario sin sesión navega a una ruta protegida (por ejemplo `/contratos`)
- **THEN** es redirigido a `/acceso/inicio-de-sesion` y la ruta solicitada no se muestra

#### Scenario: Acceso con sesión

- **WHEN** un usuario con sesión válida navega a una ruta protegida
- **THEN** la ruta solicitada se muestra

### Requirement: Landing del módulo de acceso

El sistema SHALL redirigir la landing del módulo de acceso a la pantalla de inicio de sesión.

#### Scenario: Landing `/acceso/`

- **WHEN** se navega a `/acceso/`
- **THEN** la URL resultante es `/acceso/inicio-de-sesion`

### Requirement: Sesión activa fuera del flujo de acceso

El sistema SHALL enviar al inicio a un usuario con sesión que intente reingresar a inicio de sesión, recuperación o cambio de contraseña, y SHALL permitirle los flujos de registro y verificación.

#### Scenario: Reintento de inicio de sesión

- **WHEN** un usuario con sesión navega a `/acceso/inicio-de-sesion`, `/acceso/olvide-mi-contrasena` o `/acceso/cambiar-contrasena`
- **THEN** es redirigido a la ruta de inicio

#### Scenario: Registro o verificación con sesión

- **WHEN** un usuario con sesión navega a `/acceso/crear-cuenta` o `/acceso/verificacion-de-usuario`
- **THEN** la ruta se muestra para que complete el flujo pendiente

### Requirement: Listado de contratos paginado

El sistema SHALL servir el listado de contratos en una ruta paginada y SHALL redirigir la ruta base del módulo a su primera página.

#### Scenario: Redirección a la primera página

- **WHEN** se navega a `/contratos`
- **THEN** la URL resultante es `/contratos/p/1` y se muestra el listado

#### Scenario: Página arbitraria

- **WHEN** se navega a `/contratos/p/3`
- **THEN** se muestra el listado correspondiente a la tercera página

### Requirement: Rutas de alta y de edición

El sistema SHALL exponer una ruta de alta (`/nuevo`) y una ruta de edición con identificador (`/:id`) para proveedores, unidades administrativas y contratos.

#### Scenario: Alta

- **WHEN** se navega a `/proveedores/nuevo`
- **THEN** se muestra el formulario vacío en modo alta

#### Scenario: Edición

- **WHEN** se navega a `/proveedores/123`
- **THEN** se muestra el formulario con la entrada 123

### Requirement: Navegación con scroll al inicio

El sistema SHALL posicionar el scroll al inicio de la página en cada cambio de ruta.

#### Scenario: Cambio de ruta con desplazamiento

- **WHEN** el usuario navega de una ruta a otra estando desplazado al final de la página
- **THEN** la nueva ruta muestra su contenido desde el inicio
