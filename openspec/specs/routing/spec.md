# routing Specification

## Purpose

Define qué rutas expone el Monitor Karewa, cómo se protegen con la sesión del usuario y cómo se comporta la navegación entre ellas.

## Requirements

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

### Requirement: Rutas de nuevas secciones con CRUD

El sistema SHALL exponer para toda sección nueva con alta, consulta y edición tres rutas: listado en `/seccion`, alta en `/seccion/nuevo` y edición en `/seccion/:id`, con nombre de ruta camelCase derivado del módulo y con la misma protección `meta.login` que
el resto de la aplicación.

#### Scenario: Listado de la nueva sección

- **WHEN** se registra una sección nueva con módulo `/facturas`
- **THEN** `/facturas` muestra su listado y su ruta de nombre camelCase (`facturasList`) enlaza al listado

#### Scenario: Alta y edición

- **WHEN** la sección nueva admite dar de alta y editar
- **THEN** expone `/facturas/nuevo` con nombre `facturasCreate` y `/facturas/:id` con nombre `facturasView`

#### Scenario: Protección de sesión

- **WHEN** las tres rutas de la sección nueva quedan declaradas
- **THEN** cada una lleva `meta.login: true` y el guard las protege igual que a las secciones existentes

#### Scenario: Sección sin alta por ruta

- **WHEN** una sección nueva solo admite consulta desde un listado
- **THEN** no se declaran las rutas de alta ni de edición y el listado no ofrece esas acciones

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
