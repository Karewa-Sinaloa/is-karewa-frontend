# Spec Delta

## ADDED Requirements

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
