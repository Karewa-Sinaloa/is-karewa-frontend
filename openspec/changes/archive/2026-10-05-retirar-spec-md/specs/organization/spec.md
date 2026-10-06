# Spec Delta

## Purpose

Define la consulta, actualización y eliminación del perfil de la organización en el Monitor Karewa, incluyendo su bloqueo de edición y la dependencia de las direcciones asociadas al eliminar.

## ADDED Requirements

### Requirement: Consulta del perfil de la organización

El sistema SHALL mostrar el perfil de la organización desde los datos de la organización en el store, y SHALL conducir al inicio cuando esos datos no existen.

#### Scenario: Perfil disponible

- **WHEN** un usuario con sesión navega a la vista de su organización con datos de organización cargados
- **THEN** ve el formulario con el nombre, nombre corto, correo de contacto y domicilio actuales

#### Scenario: Sin datos de organización

- **WHEN** el usuario navega a la vista de su organización sin datos de organización en el store
- **THEN** es redirigido al inicio

### Requirement: Actualización del perfil

El sistema SHALL permitir editar el perfil solo cuando el usuario lo habilita, y SHALL guardar los cambios con validación en cliente: nombre, nombre corto, correo de contacto y calle obligatorios, y código postal numérico entre 1000 y 99999.

#### Scenario: Guardado exitoso

- **WHEN** el usuario envía el formulario válido
- **THEN** se actualiza la organización, se muestra la alerta del código devuelto, el formulario vuelve a bloquearse y se recargan los datos del perfil

#### Scenario: Campo inválido

- **WHEN** falta el nombre, el nombre corto, la calle o el correo no tiene formato válido
- **THEN** se muestra el error del campo en español y no se emite la petición

#### Scenario: Error del servidor

- **WHEN** el servidor rechaza la actualización
- **THEN** se muestra la alerta del código devuelto y el formulario conserva los valores ingresados

### Requirement: Eliminación de la organización

El sistema SHALL eliminar la organización únicamente tras una confirmación explícita, y SHALL mostrar el aviso del servidor cuando la operación no es posible por direcciones asociadas.

#### Scenario: Confirmación pendiente

- **WHEN** el usuario elige eliminar la organización
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** se muestra la alerta del código devuelto

#### Scenario: Direcciones asociadas

- **WHEN** el servidor rechaza la eliminación porque existen direcciones asociadas
- **THEN** se muestra la alerta del error con la indicación de borrar primero las direcciones asociadas
