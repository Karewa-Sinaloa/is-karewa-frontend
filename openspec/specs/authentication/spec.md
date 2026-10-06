# authentication Specification

## Purpose

Define cómo el Monitor Karewa establece, mantiene, valida y cierra la sesión del usuario.

## Requirements

### Requirement: Inicio de sesión con credenciales y captcha

El sistema SHALL iniciar sesión enviando correo y contraseña junto con la verificación de captcha, y SHALL establecer la sesión solo si el servidor la acepta.

#### Scenario: Credenciales válidas

- **WHEN** el usuario envía credenciales válidas y completa el captcha
- **THEN** la sesión se establece y es redirigido al inicio de la aplicación

#### Scenario: Credenciales inválidas

- **WHEN** el servidor rechaza las credenciales
- **THEN** se muestra la alerta del código devuelto y el usuario permanece en el inicio de sesión

#### Scenario: Protección con captcha

- **WHEN** el formulario es válido
- **THEN** se presenta el captcha antes de poder enviar las credenciales

### Requirement: Persistencia del token

El sistema SHALL persistir el token de sesión en el almacenamiento local con el prefijo configurado y SHALL restaurar la sesión al recargar la aplicación.

#### Scenario: Recarga con token vigente

- **WHEN** el usuario recarga la página con un token vigente
- **THEN** la sesión continúa sin volver a iniciarla

#### Scenario: Sin token almacenado

- **WHEN** no existe token en el almacenamiento local
- **THEN** la sesión se considera inexistente y el usuario no accede a rutas protegidas

### Requirement: Vigencia del token

El sistema SHALL considerar inválida una sesión cuyo token esté vencido o sea inutilizable, SHALL removerlo y SHALL tratar al usuario como no autenticado.

#### Scenario: Token expirado

- **WHEN** el token almacenado está vencido y el usuario intenta acceder a una ruta protegida
- **THEN** el token se elimina y es redirigido al inicio de sesión

#### Scenario: Token inutilizable

- **WHEN** el token almacenado no puede interpretarse como una sesión válida
- **THEN** se elimina y la sesión queda cerrada

### Requirement: Roles válidos para la sesión

El sistema SHALL aceptar como sesión válida únicamente a usuarios con un rol vigente permitido y SHALL rechazar el resto.

#### Scenario: Rol fuera de rango o ausente

- **WHEN** el token corresponde a un usuario sin rol o con un rol no permitido
- **THEN** la sesión se rechaza y el token se elimina

### Requirement: Cierre de sesión

El sistema SHALL cerrar la sesión notificando al servidor, eliminando el token y los datos de usuario, y SHALL informar el resultado con una alerta.

#### Scenario: Cierre por el usuario

- **WHEN** el usuario cierra sesión
- **THEN** el token se elimina, los datos de usuario se limpian y se muestra la alerta del código devuelto por el servidor

### Requirement: Sesión terminada por el servidor

El sistema SHALL mostrar un aviso de sesión finalizada y SHALL conducir al inicio de sesión cuando el servidor responde con un código de sesión cerrada.

#### Scenario: Respuesta con código de sesión cerrada

- **WHEN** una petición responde con `ACCESS003` o `ACCESS006`
- **THEN** se muestra el popup "SESIÓN FINALIZADA" con un botón que conduce al inicio de sesión

#### Scenario: Confirmación del aviso

- **WHEN** el usuario confirma el popup de sesión finalizada
- **THEN** navega al inicio de sesión

### Requirement: Solicitud de recuperación de contraseña

El sistema SHALL enviar la solicitud de recuperación con el correo del usuario y la URL de cambio de contraseña, tras presentar el captcha, y SHALL informar el resultado con una alerta.

#### Scenario: Solicitud enviada

- **WHEN** el usuario ingresa un correo válido, completa el captcha y envía la solicitud
- **THEN** se envía la petición con el correo y la URL de cambio, y se muestra la alerta del código devuelto

#### Scenario: Sin captcha

- **WHEN** el usuario intenta enviar sin completar el captcha
- **THEN** se presenta el captcha antes de poder enviar

#### Scenario: Respuesta del servidor

- **WHEN** el servidor responde a la solicitud
- **THEN** se muestra la alerta del resultado, sea éxito o error

### Requirement: Cambio de contraseña con enlace

El sistema SHALL cambiar la contraseña cuando el usuario llega con el enlace de recuperación, enviando la contraseña nueva repetida junto con el correo y la marca del enlace, y SHALL informar el resultado con una alerta. La contraseña nueva SHALL tener al
menos 8 caracteres y coincidir con su repetición.

#### Scenario: Enlace válido

- **WHEN** el usuario envía una contraseña nueva de al menos 8 caracteres confirmada con el correo y la marca del enlace
- **THEN** se envía el cambio y se muestra la alerta del código devuelto

#### Scenario: Contraseña inválida

- **WHEN** la contraseña no alcanza 8 caracteres o no coincide con su repetición
- **THEN** se muestra el error del campo y no se emite la petición

#### Scenario: Cambio rechazado por el servidor

- **WHEN** el servidor rechaza el cambio con un error que no es de validación
- **THEN** se muestra la alerta del código devuelto

### Requirement: Registro de cuenta

El sistema SHALL registrar una cuenta nueva enviando los datos del formulario junto con la verificación de captcha, y SHALL informar el resultado con una alerta.

#### Scenario: Registro enviado

- **WHEN** el usuario completa el formulario válido y el captcha
- **THEN** se envía el registro y se muestra la alerta del código devuelto

#### Scenario: Registro rechazado

- **WHEN** el servidor rechaza el registro
- **THEN** se muestra la alerta del código devuelto y el usuario permanece en el formulario

### Requirement: Verificación de correo

El sistema SHALL verificar la cuenta automáticamente al abrir el enlace de verificación, enviando al servidor la marca y el correo contenidos en él, y SHALL mostrar el resultado con un popup de cuenta verificada seguido de la navegación al inicio de sesión, o
con una alerta de error.

#### Scenario: Verificación aceptada

- **WHEN** el usuario abre la verificación con la marca y el correo del enlace y el servidor la acepta
- **THEN** se muestra el popup "Cuenta verificada" y la vista navega al inicio de sesión

#### Scenario: Verificación rechazada

- **WHEN** el servidor rechaza la verificación
- **THEN** se muestra la alerta del error devuelto y la vista navega al inicio de sesión

#### Scenario: Enlace sin parámetros

- **WHEN** el usuario abre la verificación sin los parámetros del enlace
- **THEN** la vista navega al inicio de sesión sin enviar ninguna petición

### Requirement: Autocompletado seguro en los formularios de acceso

El sistema SHALL declarar en los formularios de acceso el autocompletado propio de cada campo: correo como nombre de usuario y contraseña vigente en el inicio de sesión, y contraseña nueva en el cambio de contraseña, para que los gestores de contraseñas
reconozcan y guarden las credenciales sin completar otros campos del formulario.

#### Scenario: Inicio de sesión

- **WHEN** se muestra el formulario de inicio de sesión
- **THEN** el correo declara autocompletado de nombre de usuario y la contraseña declara autocompletado de contraseña vigente

#### Scenario: Cambio de contraseña

- **WHEN** se muestra el formulario de cambio de contraseña
- **THEN** los campos de contraseña declaran autocompletado de contraseña nueva

#### Scenario: Campos fuera del flujo de credenciales

- **WHEN** un formulario no maneja credenciales (por ejemplo la solicitud de recuperación)
- **THEN** no declara autocompletado de contraseña
