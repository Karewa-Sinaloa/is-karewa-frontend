# Proposal

## Why

El dashboard de configuración general solo cubre usuarios y roles, mientras que `GET /config` publica los parámetros con los que opera el sistema —redes sociales y SMTP— que hoy no se pueden consultar ni editar desde la interfaz.

## What Changes

- Se agrega la tarjeta de parámetros de configuración al dashboard de la sección, con una tarjeta por cada registro devuelto por `GET /config`, sin paginación y sin acciones de alta ni de baja.
- Cada tarjeta lista las claves del `value` del registro; cuando el `value` es JSON, cada clave ocupa una fila con su valor como descripción.
- La fila de cada clave abre un popup dentro del dashboard que permite consultar y editar `name`, `slug` y `value` con `PUT /config/{id}`.
- El popup detecta el formato del `value`: si es JSON lo presenta formateado y exige que el valor guardado siga siendo JSON válido; si no lo es, lo presenta y lo guarda como texto plano.
- El popup y la tarjeta ocultan el valor de las claves sensibles (`pass`, `password`, `secret`, `token`, `apikey`, `api_key`) hasta que el usuario lo solicite, y lo restauran al guardar.
- La acción de eliminar del menú de fila pasa a ser condicional a `optionList.delete`, y los controles solo-icono de fila y de cierre de popup reciben nombre accesible.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `general-configuration`: el dashboard gana la tarjeta de parámetros de configuración, el popup de consulta y edición de un parámetro y el respaldo de los valores sensibles.

## Impact

- `src/components/views/configuracion/`: `config.vue`, `config_card.vue` y `config_view.vue` (nuevos) y `dash.vue` (agrega la tarjeta al grid).
- `src/helpers/config.value.js` (nuevo): detección de formato, formateo, validación y máscara de los valores sensibles.
- `src/assets/sass/components/_config.sass` (nuevo): badge de formato, área de valor y botón de valores sensibles.
- `src/components/partials/result_options.vue`: la acción de eliminar queda condicionada a `optionList.delete`, se declara el evento `showPopup` y el control de fila recibe nombre accesible.
- `src/components/partials/section_popup_slot.vue`: el botón de cerrar recibe nombre accesible.
- Consumo de la API: `GET /config` y `PUT /config/{id}`.
- Sin cambios en rutas, en las tarjetas de usuarios y roles ni en el resto de secciones.
