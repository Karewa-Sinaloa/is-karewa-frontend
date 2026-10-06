# form-validation Specification

## Purpose
Define cómo el frontend valida los formularios antes de enviarlos y cómo muestra los errores al usuario.

## Requirements

### Requirement: Validación antes del envío

El sistema SHALL verificar en el cliente los campos obligatorios y el formato de cada formulario, y SHALL enviar la petición solo cuando no hay errores.

#### Scenario: Campo con formato inválido

- **WHEN** un campo no cumple su formato (por ejemplo un correo sin `@`)
- **THEN** se muestra el error del campo y la petición no se emite

#### Scenario: Formulario válido

- **WHEN** todos los campos son válidos
- **THEN** el formulario puede enviarse, aplicando el captcha cuando el flujo lo requiere

### Requirement: Mensajes de validación en español

El sistema SHALL mostrar los errores de validación en español, referenciando la etiqueta del campo afectado.

#### Scenario: Campo obligatorio vacío

- **WHEN** un campo obligatorio está vacío
- **THEN** se muestra un mensaje en español que incluye la etiqueta del campo (contraseña, correo, etc.)

#### Scenario: Longitud mínima

- **WHEN** un valor no alcanza la longitud mínima
- **THEN** el mensaje indica en español la longitud mínima requerida

### Requirement: Errores de servidor aplicados por campo

El sistema SHALL aplicar al campo correspondiente los errores por campo devueltos por el servidor en una respuesta de validación.

#### Scenario: Rechazo con errores por campo

- **WHEN** el servidor responde con un estado de validación que detalla errores por campo
- **THEN** cada error se muestra junto a su campo y el formulario conserva los valores ingresados
