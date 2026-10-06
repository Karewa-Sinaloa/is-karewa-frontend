# Spec Delta

## ADDED Requirements

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
