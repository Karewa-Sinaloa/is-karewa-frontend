# Spec Delta

## Purpose

Define cómo el Monitor Karewa establece, mantiene, valida y cierra la sesión del usuario.

## ADDED Requirements

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
