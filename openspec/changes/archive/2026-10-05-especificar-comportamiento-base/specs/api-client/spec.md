# Spec Delta

## Purpose

Define el contrato del cliente HTTP del frontend: operaciones disponibles, autenticación automática, estados de carga global y manejo de errores.

## ADDED Requirements

### Requirement: Operaciones CRUD y carga de archivos

El sistema SHALL ofrecer operaciones GET, POST, PUT y DELETE sobre los módulos de la API, y SHALL cargar archivos por multipart en el módulo indicado.

#### Scenario: Lectura y escritura

- **WHEN** una vista necesita leer o guardar una entidad
- **THEN** la petición se emite al módulo correspondiente, incluyendo el identificador cuando la entidad ya existe

#### Scenario: Baja sin identificador

- **WHEN** se intenta eliminar una entrada sin un identificador válido (nulo, no numérico o no positivo)
- **THEN** la operación se rechaza localmente con el código `API_NO_ENTRY_ID_PROVIDED` sin llegar al servidor

#### Scenario: Carga de archivos

- **WHEN** una vista solicita subir archivos
- **THEN** la petición se envía como multipart con los archivos indicados

### Requirement: Autenticación automática en las peticiones

El sistema SHALL enviar con cada petición el token de sesión en el encabezado de autorización, junto con los encabezados JSON de la API, usando la URL base configurada.

#### Scenario: Petición autenticada

- **WHEN** cualquier vista realiza una petición con una sesión activa
- **THEN** esta incluye el token almacenado sin que el usuario tenga que intervenir

### Requirement: Estado de carga global

El sistema SHALL activar el indicador de carga global mientras una petición está en vuelo y SHALL desactivarlo al terminar, tanto en éxito como en error.

#### Scenario: Durante la petición

- **WHEN** una petición está en curso
- **THEN** el indicador global de carga está activo

#### Scenario: Al finalizar

- **WHEN** la petición termina, ya sea en éxito o en error
- **THEN** el indicador global de carga se desactiva

### Requirement: Errores normalizados

El sistema SHALL entregar todo error con el estado HTTP y el payload del servidor, incluyendo el detalle por campo cuando el servidor responde validación.

#### Scenario: Error de validación

- **WHEN** el servidor responde con un estado de validación y errores por campo
- **THEN** la vista recibe ese detalle para aplicarlo a su formulario

#### Scenario: Error de negocio

- **WHEN** el servidor responde con un código de negocio
- **THEN** la vista recibe el código y su mensaje

### Requirement: Cierre de sesión ante respuesta 401

El sistema SHALL cerrar la sesión local ante cualquier respuesta 401: eliminar el token, limpiar los datos de usuario y mostrar la alerta del código devuelto.

#### Scenario: Respuesta 401

- **WHEN** una petición responde 401
- **THEN** el token se elimina, los datos de usuario se limpian y se muestra la alerta del código devuelto
