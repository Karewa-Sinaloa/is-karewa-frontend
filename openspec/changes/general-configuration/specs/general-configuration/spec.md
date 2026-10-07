# Spec Delta

## Purpose

Define la sección de configuración general del Monitor Karewa: su dashboard de tarjetas, el listado paginado de usuarios con acciones de ver, edición y baja, la alta y ficha de usuario, y la administración de roles en popup.

## ADDED Requirements

### Requirement: Dashboard de configuración general

El sistema SHALL mostrar la configuración general en una ruta propia como un dashboard de tarjetas al estilo de la configuración de contratos, con la tarjeta de usuarios y la tarjeta de roles.

#### Scenario: Acceso al dashboard

- **WHEN** un usuario con sesión navega a la configuración general
- **THEN** ve el dashboard con la tarjeta de usuarios y la tarjeta de roles

#### Scenario: Tarjeta sin usuarios

- **WHEN** el listado no devuelve ningún usuario
- **THEN** la tarjeta muestra su estado vacío junto con la acción de alta

#### Scenario: Error del servidor al listar

- **WHEN** la consulta del listado falla
- **THEN** se muestra la alerta del código devuelto y la tarjeta queda vacía

### Requirement: Listado paginado de usuarios

El sistema SHALL listar los usuarios en su tarjeta de diez en diez, ordenados por nombre, mostrando el nombre completo y el correo de cada uno, con la página actual identificada en la ruta del dashboard.

#### Scenario: Más de diez usuarios

- **WHEN** hay más de diez usuarios registrados
- **THEN** la tarjeta muestra diez usuarios en la página actual y ofrece el control de paginación

#### Scenario: Cambio de página

- **WHEN** el usuario cambia de página desde el control de paginación
- **THEN** se muestran los usuarios de esa página sin salir del dashboard

#### Scenario: Diez usuarios o menos

- **WHEN** hay diez usuarios o menos
- **THEN** se muestran todos en una sola página y no aparece el control de paginación

### Requirement: Acciones sobre un usuario desde la tarjeta

El sistema SHALL ofrecer en cada fila de la tarjeta de usuarios las acciones de ver, editar y borrar, y SHALL exigir una confirmación explícita antes de borrar.

#### Scenario: Ver o editar

- **WHEN** el usuario elige ver o editar en una fila
- **THEN** se abre la ficha de ese usuario

#### Scenario: Confirmación de baja

- **WHEN** el usuario elige borrar en una fila
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** el usuario desaparece del listado y se muestra la alerta del código devuelto

#### Scenario: Baja rechazada

- **WHEN** el servidor rechaza la eliminación
- **THEN** el usuario permanece en el listado y se muestra la alerta del error

### Requirement: Alta de usuarios

El sistema SHALL permitir dar de alta un usuario desde el encabezado de la tarjeta, con nombre, apellido y correo obligatorios y contraseña, validados en el cliente antes de enviar.

#### Scenario: Acción de alta

- **WHEN** el usuario pulsa la acción de alta en el encabezado de la tarjeta
- **THEN** se abre el formulario de usuario en modo alta, también cuando el listado está vacío

#### Scenario: Alta exitosa

- **WHEN** el usuario envía el formulario válido en modo alta
- **THEN** se crea el usuario, se muestra la alerta del código devuelto y la vista pasa a la ficha del usuario recién creado

#### Scenario: Formulario inválido

- **WHEN** el formulario tiene errores de validación
- **THEN** se muestran los mensajes en español en cada campo con error y no se envía la solicitud

### Requirement: Ficha de usuario

El sistema SHALL mostrar la ficha de usuario en modo consulta con sus datos, SHALL permitir pasar a edición —incluida la contraseña solo cuando se captura una nueva— y SHALL eliminar el usuario tras confirmación explícita.

#### Scenario: Consulta

- **WHEN** se abre la ficha de un usuario
- **THEN** los campos muestran sus datos en modo solo lectura

#### Scenario: Edición

- **WHEN** el usuario activa la edición desde la ficha o llega a la ficha con la indicación de edición en la ruta
- **THEN** los campos quedan habilitados para modificarlos y guardarlos

#### Scenario: Guardado de la edición

- **WHEN** el usuario envía la edición válida
- **THEN** el servidor actualiza el usuario y se muestra la alerta del código devuelto

#### Scenario: Contraseña sin cambiar

- **WHEN** el campo de contraseña está vacío al guardar una edición
- **THEN** no se envía contraseña y el resto de los campos se actualiza

#### Scenario: Registro sin identificador válido

- **WHEN** la ruta de la ficha carece de identificador o indica el valor 0
- **THEN** la vista redirige al modo de alta

#### Scenario: Baja desde la ficha

- **WHEN** el usuario confirma la eliminación desde la ficha
- **THEN** se elimina el usuario, se muestra la alerta y la vista regresa al dashboard de configuración

### Requirement: Catálogos del formulario de usuario

El sistema SHALL poblar el selector de rol desde el catálogo de roles del sistema y SHALL ofrecer los estatus 1 (activo) y 2 (inactivo) mientras el contrato no declare el catálogo de estatus de usuarios.

#### Scenario: Roles disponibles

- **WHEN** se abre el formulario de usuario
- **THEN** el selector de rol ofrece las entradas devueltas por el catálogo de roles

#### Scenario: Catálogo de roles sin entradas

- **WHEN** el catálogo de roles está vacío o su consulta falla
- **THEN** el campo de rol conserva el valor por defecto del contrato y, si la consulta falló, se muestra la alerta del error

#### Scenario: Estatus de usuario

- **WHEN** se abre el formulario de usuario
- **THEN** el selector de estatus ofrece Activo (1) e Inactivo (2)

### Requirement: Tarjeta de roles

El sistema SHALL administrar los roles desde su tarjeta con popups dentro del dashboard —alta desde el encabezado y consulta y edición de cada rol en el mismo popup— y SHALL exigir confirmación explícita antes de borrar, sin declarar rutas propias para los
roles.

#### Scenario: Acción de alta

- **WHEN** el usuario pulsa la acción de alta en el encabezado de la tarjeta de roles
- **THEN** se abre un popup con el formulario de rol vacío en modo alta, sin salir del dashboard

#### Scenario: Ver o editar un rol

- **WHEN** el usuario elige editar en una fila de roles
- **THEN** se abre el popup con el formulario que muestra los datos del rol y permite guardarlos

#### Scenario: Rol guardado

- **WHEN** el usuario envía el formulario de rol válido en alta o en edición
- **THEN** el servidor crea o actualiza el rol, se muestra la alerta del código devuelto, se cierra el popup y el listado refleja el cambio

#### Scenario: Confirmación de baja

- **WHEN** el usuario elige borrar un rol
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** el rol desaparece del listado y se muestra la alerta del código devuelto

#### Scenario: Baja rechazada

- **WHEN** el servidor rechaza la eliminación —por ejemplo porque un usuario aún referencia el rol—
- **THEN** el rol permanece en el listado y se muestra la alerta del error

#### Scenario: Lista de roles vacía

- **WHEN** el catálogo de roles no devuelve ninguna entrada
- **THEN** la tarjeta muestra su estado vacío junto con la acción de alta
