# Spec Delta

## MODIFIED Requirements

### Requirement: Rutas de aplicación protegidas

El sistema SHALL permitir el acceso a las secciones de la aplicación únicamente con una sesión válida y SHALL redirigir al inicio de sesión cuando no la haya.

#### Scenario: Acceso sin sesión

- **WHEN** un usuario sin sesión navega a una ruta protegida (por ejemplo `/admin/contratos`)
- **THEN** es redirigido a `/admin/acceso/inicio-de-sesion` y la ruta solicitada no se muestra

#### Scenario: Acceso con sesión

- **WHEN** un usuario con sesión válida navega a una ruta protegida
- **THEN** la ruta solicitada se muestra

### Requirement: Landing del módulo de acceso

El sistema SHALL redirigir la landing del módulo de acceso a la pantalla de inicio de sesión.

#### Scenario: Landing `/acceso/`

- **WHEN** se navega a `/admin/acceso/`
- **THEN** la URL resultante es `/admin/acceso/inicio-de-sesion`

### Requirement: Sesión activa fuera del flujo de acceso

El sistema SHALL enviar al inicio a un usuario con sesión que intente reingresar a inicio de sesión, recuperación o cambio de contraseña, y SHALL permitirle los flujos de registro y verificación.

#### Scenario: Reintento de inicio de sesión

- **WHEN** un usuario con sesión navega a `/admin/acceso/inicio-de-sesion`, `/admin/acceso/olvide-mi-contrasena` o `/admin/acceso/cambiar-contrasena`
- **THEN** es redirigido a la ruta de inicio

#### Scenario: Registro o verificación con sesión

- **WHEN** un usuario con sesión navega a `/admin/acceso/crear-cuenta` o `/admin/acceso/verificacion-de-usuario`
- **THEN** la ruta se muestra para que complete el flujo pendiente

### Requirement: Listado de contratos paginado

El sistema SHALL servir el listado de contratos en una ruta paginada y SHALL redirigir la ruta base del módulo a su primera página.

#### Scenario: Redirección a la primera página

- **WHEN** se navega a `/admin/contratos`
- **THEN** la URL resultante es `/admin/contratos/p/1` y se muestra el listado

#### Scenario: Página arbitraria

- **WHEN** se navega a `/admin/contratos/p/3`
- **THEN** se muestra el listado correspondiente a la tercera página

### Requirement: Rutas de alta y de edición

El sistema SHALL exponer una ruta de alta (`/nuevo`) y una ruta de edición con identificador (`/:id`) para proveedores, unidades administrativas y contratos.

#### Scenario: Alta

- **WHEN** se navega a `/admin/proveedores/nuevo`
- **THEN** se muestra el formulario vacío en modo alta

#### Scenario: Edición

- **WHEN** se navega a `/admin/proveedores/123`
- **THEN** se muestra el formulario con la entrada 123

### Requirement: Rutas de nuevas secciones con CRUD

El sistema SHALL exponer para toda sección nueva con alta, consulta y edición tres rutas: listado en `/admin/seccion`, alta en `/admin/seccion/nuevo` y edición en `/admin/seccion/:id`, con nombre de ruta camelCase derivado del módulo y con la misma protección
`meta.login` que el resto de la aplicación.

#### Scenario: Listado de la nueva sección

- **WHEN** se registra una sección nueva con módulo `/admin/facturas`
- **THEN** `/admin/facturas` muestra su listado y su ruta de nombre camelCase (`facturasList`) enlaza al listado

#### Scenario: Alta y edición

- **WHEN** la sección nueva admite dar de alta y editar
- **THEN** expone `/admin/facturas/nuevo` con nombre `facturasCreate` y `/admin/facturas/:id` con nombre `facturasView`

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
- **THEN** su ruta identifica la página actual (por ejemplo `/admin/proveedores/p/2`) y el listado muestra esa página

#### Scenario: Ruta base del módulo

- **WHEN** se navega a la ruta base de un módulo paginado sin número de página
- **THEN** se redirige a su primera página

#### Scenario: Listado no paginado

- **WHEN** un módulo ofrece un listado que no se pagina
- **THEN** su ruta no declara segmento de página

### Requirement: Rutas de la sección de configuración general

El sistema SHALL exponer la configuración general con su base `/admin/configuracion` redirigida a la primera página, el listado paginado en `/admin/configuracion/p/:page`, el alta de usuarios en `/admin/configuracion/usuarios/nuevo` y la ficha de usuario en
`/admin/configuracion/usuarios/:id`, con nombre de ruta camelCase derivado del módulo y con la protección `meta.login` del resto de la aplicación.

#### Scenario: Base de la sección

- **WHEN** se navega a `/admin/configuracion`
- **THEN** la URL resultante es `/admin/configuracion/p/1` y se muestra el dashboard

#### Scenario: Página del listado

- **WHEN** se navega a `/admin/configuracion/p/3`
- **THEN** se muestra la tercera página de la tarjeta de usuarios

#### Scenario: Alta de usuario

- **WHEN** se navega a `/admin/configuracion/usuarios/nuevo`
- **THEN** se muestra el formulario de usuario en modo alta

#### Scenario: Ficha de usuario

- **WHEN** se navega a `/admin/configuracion/usuarios/123`
- **THEN** se muestra la ficha del usuario 123

#### Scenario: Protección de sesión

- **WHEN** un usuario sin sesión navega a cualquiera de estas rutas
- **THEN** es redirigido a `/admin/acceso/inicio-de-sesion` y la ruta solicitada no se muestra

## ADDED Requirements

### Requirement: Prefijo `/admin` en las rutas del panel

El sistema SHALL servir todas las rutas del panel administrativo bajo el prefijo `/admin`, declarando el dashboard en `/admin`.

#### Scenario: Dashboard del panel

- **WHEN** se navega a `/admin`
- **THEN** se muestra la pantalla de inicio con la navegación lateral y el encabezado de contenido

#### Scenario: Sección bajo el prefijo

- **WHEN** se navega a `/admin/contratos`
- **THEN** se muestra el listado de contratos en esa URI

#### Scenario: Ruta nueva del panel

- **WHEN** se declara una ruta nueva para una sección del panel
- **THEN** su path comienza por `/admin`

### Requirement: Reserva de la raíz para el frontend público

El sistema SHALL redirigir la raíz `/` al dashboard y SHALL reservar esa URI como el único punto de entrada del frontend público, sin declarar en ella vistas del panel.

#### Scenario: Redirección de la raíz

- **WHEN** se navega a `/`
- **THEN** la URL resultante es `/admin` y se muestra la pantalla de inicio

#### Scenario: Sin vistas del panel en la raíz

- **WHEN** se revisa el árbol de rutas del panel
- **THEN** ninguna vista del panel está declarada en `/`

### Requirement: URIs no reconocidas

El sistema SHALL resolver toda URI que no corresponda a una ruta declarada redirigiéndola a `/admin`, de modo que una forma antigua o un error de tipeo no muestre una pantalla en blanco.

#### Scenario: Forma antigua sin prefijo

- **WHEN** se navega a `/contratos`
- **THEN** no se muestra el listado de contratos y la navegación termina en `/admin`

#### Scenario: Ruta desconocida bajo el prefijo

- **WHEN** se navega a `/admin/una-ruta-inexistente`
- **THEN** la navegación termina en `/admin` y no se muestra una pantalla en blanco
