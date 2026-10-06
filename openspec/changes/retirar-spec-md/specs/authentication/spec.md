# Spec Delta

## ADDED Requirements

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
