# Spec Delta

## Purpose

Define cómo los códigos devueltos por el servidor se convierten en mensajes mostrables al usuario.

## ADDED Requirements

### Requirement: Traducción de códigos a mensajes

El sistema SHALL traducir cada código del servidor a un mensaje con tipo, título y texto del catálogo de mensajes.

#### Scenario: Código de sesión expirada

- **WHEN** la aplicación recibe el código `ACCESS003`
- **THEN** el mensaje mostrable es de tipo error, con título "SESIÓN EXPIRADA" y su texto correspondiente

#### Scenario: Código de éxito

- **WHEN** la aplicación recibe el código `SUCCESS`
- **THEN** el mensaje mostrable es de tipo éxito, con título "PETICIÓN PROCESADA" y su texto correspondiente

### Requirement: Fallback genérico para códigos desconocidos

El sistema SHALL usar el mensaje genérico de error de servidor cuando el código recibido no existe en el catálogo.

#### Scenario: Código no catalogado

- **WHEN** llega un código que el catálogo no reconoce
- **THEN** se muestra el mensaje genérico "ERROR DE SERVIDOR" en lugar de un mensaje vacío o roto

### Requirement: Alertas por operación

El sistema SHALL mostrar una alerta por cada operación que devuelve un código, preservando las alertas anteriores hasta que el listado se actualice.

#### Scenario: Operaciones consecutivas

- **WHEN** una operación exitosa y luego un error devuelven sus códigos
- **THEN** ambas alertas permanecen en pantalla hasta que el listado de alertas se reemplace
