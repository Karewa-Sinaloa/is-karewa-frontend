# Spec Delta

## Purpose

Define la sección de configuración general del Monitor Karewa: su dashboard de tarjetas, el listado paginado de usuarios con acciones de ver, edición y baja, la alta y ficha de usuario, la administración de roles en popup y la consulta y edición de los
parámetros de configuración.

## MODIFIED Requirements

### Requirement: Dashboard de configuración general

El sistema SHALL mostrar la configuración general en una ruta propia como un dashboard de tarjetas al estilo de la configuración de contratos, con la tarjeta de usuarios, la tarjeta de roles y la tarjeta de parámetros de configuración.

#### Scenario: Acceso al dashboard

- **WHEN** un usuario con sesión navega a la configuración general
- **THEN** ve el dashboard con la tarjeta de usuarios, la tarjeta de roles y la tarjeta de parámetros de configuración

#### Scenario: Tarjeta sin usuarios

- **WHEN** el listado no devuelve ningún usuario
- **THEN** la tarjeta muestra su estado vacío junto con la acción de alta

#### Scenario: Error del servidor al listar

- **WHEN** la consulta del listado falla
- **THEN** se muestra la alerta del código devuelto y la tarjeta queda vacía

## ADDED Requirements

### Requirement: Tarjeta de parámetros de configuración

El sistema SHALL mostrar los parámetros de `GET /config` en el dashboard como una tarjeta por cada registro —sin paginación y sin acciones de alta ni de baja—, listando en cada fila una de las claves del `value` del registro.

#### Scenario: Acceso a la tarjeta

- **WHEN** un usuario con sesión abre la configuración general
- **THEN** cada registro devuelto por `GET /config` aparece como una tarjeta con su nombre y su clave

#### Scenario: Registro con value en JSON

- **WHEN** el `value` de un registro es JSON
- **THEN** cada clave del JSON ocupa una fila con su valor como descripción

#### Scenario: Registro sin valores

- **WHEN** el `value` de un registro está vacío
- **THEN** la tarjeta muestra su estado vacío

#### Scenario: Error del servidor al listar

- **WHEN** la consulta de `GET /config` falla
- **THEN** se muestra la alerta del código devuelto y la tarjeta muestra su estado vacío

#### Scenario: Acciones de la fila

- **WHEN** el usuario abre el menú de una fila
- **THEN** la fila ofrece únicamente la acción de edición, sin alta ni baja

### Requirement: Consulta y edición de un parámetro en popup

El sistema SHALL permitir consultar y editar un parámetro desde un popup dentro del dashboard —nombre, clave y valor— y SHALL enviar `PUT /config/{id}` solo cuando la validación en cliente aprueba el formulario.

#### Scenario: Apertura del popup

- **WHEN** el usuario elige editar en una fila
- **THEN** se abre un popup con el nombre, la clave y el valor del parámetro en formato editable, sin salir del dashboard

#### Scenario: Valor en formato JSON

- **WHEN** el `value` del parámetro es JSON
- **THEN** el popup lo presenta formateado y exige que el valor guardado siga siendo JSON válido

#### Scenario: Valor que no es JSON

- **WHEN** el `value` del parámetro no es JSON
- **THEN** el popup lo presenta y lo guarda como texto plano sin exigirle formato JSON

#### Scenario: Formulario inválido

- **WHEN** el formulario tiene errores de validación
- **THEN** se muestran los mensajes en español en cada campo con error y no se emite la solicitud

#### Scenario: Parámetro guardado

- **WHEN** el usuario envía el formulario válido
- **THEN** el servidor actualiza el parámetro, se muestra la alerta del código devuelto, se cierra el popup y la tarjeta refleja el cambio

#### Scenario: Rechazo del servidor con errores por campo

- **WHEN** el servidor rechaza la actualización con errores por campo
- **THEN** cada error se muestra junto a su campo y el popup conserva los valores ingresados

### Requirement: Respaldo de valores sensibles

El sistema SHALL ocultar en la tarjeta y en el popup el valor de las claves sensibles —`pass`, `password`, `secret`, `token`, `apikey` y `api_key`—, SHALL ofrecer en el popup un control para mostrarlos u ocultarlos y SHALL restaurarlos al guardar.

#### Scenario: Fila de una clave sensible

- **WHEN** una fila corresponde a una clave sensible
- **THEN** la tarjeta muestra un valor oculto en lugar de su contenido

#### Scenario: Mostrar valores sensibles

- **WHEN** el usuario activa el control de mostrar valores en el popup
- **THEN** los valores sensibles aparecen editables y el control pasa a proponer ocultarlos

#### Scenario: Guardado con el valor oculto

- **WHEN** el usuario guarda sin haber mostrado los valores sensibles
- **THEN** se envía el valor original del secreto junto con el resto de los cambios editados

#### Scenario: Secreto ausente del texto

- **WHEN** el texto editado ya no contiene uno de los valores ocultos
- **THEN** el popup no permite guardar y pide mostrar los valores para volver a incluirlo
