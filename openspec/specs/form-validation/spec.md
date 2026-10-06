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

### Requirement: Envío único por formulario

El sistema SHALL impedir que un formulario emita una segunda petición mientras la primera sigue en vuelo: durante el envío el control de envío queda inactivo y se reactiva cuando la petición termina, en éxito o en error.

#### Scenario: Doble activación

- **WHEN** el usuario activa el envío dos veces en rápida sucesión
- **THEN** solo se emite una petición y la segunda activación no genera ninguna petición adicional

#### Scenario: Control inactivo durante el envío

- **WHEN** la petición del formulario está en vuelo
- **THEN** el control de envío permanece inactivo hasta que la respuesta llega

#### Scenario: Reacción tras un error

- **WHEN** la petición termina en error
- **THEN** el control de envío se reactiva y el usuario puede corregir y reintentar

### Requirement: Validación de archivos antes de subir

El sistema SHALL validar en el cliente todo archivo antes de subirlo, conforme al tipo aceptado y al tamaño máximo declarados para ese campo de subida, y SHALL rechazar el archivo con un mensaje cuando no los cumple, sin emitir la petición.

#### Scenario: Archivo fuera de tipo

- **WHEN** el usuario selecciona un archivo cuyo tipo no corresponde al aceptado por el campo
- **THEN** se muestra el error del campo y no se emite la petición de subida

#### Scenario: Archivo que supera el tamaño

- **WHEN** el archivo supera el tamaño máximo declarado para el campo
- **THEN** se muestra el error del campo con el límite y no se emite la petición de subida

#### Scenario: Archivo válido

- **WHEN** el archivo cumple tipo y tamaño
- **THEN** la subida se emite con normalidad
