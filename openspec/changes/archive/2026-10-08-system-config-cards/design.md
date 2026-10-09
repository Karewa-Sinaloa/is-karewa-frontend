# Design

## Context

El dashboard de configuración general (`configuracion/dash.vue`) ya compone dos tarjetas dentro de `main__dash-grid` y las tarjetas siguen un patrón repetido: `section` con encabezado, filas con `result-options` y popup con `section-popup-slot`. El contrato
OpenAPI sincronizado documenta el CRUD de `/config` (`id`, `name`, `slug`, `value`), y la respuesta real de `GET /config` devuelve dos registros cuyo `value` es un objeto JSON —redes sociales y parámetros SMTP— con una clave `pass` que contiene una credencial.

## Goals / Non-Goals

**Goals:**

- Consultar y editar los parámetros de `/config` desde el dashboard, sin nuevas rutas.
- Aprovechar el patrón de tarjeta y popup ya existente en la sección en lugar de crear superficies nuevas.
- Tolerar un `value` que no sea JSON, sin perder la edición.
- Nunca imprimir credenciales en el listado ni en el popup sin que el usuario lo pida.

**Non-Goals:**

- Alta ni baja de parámetros: el contrato expone `POST /config` y `DELETE /config/{id}`, pero los parámetros los define el backend.
- Paginación, búsqueda u ordenamiento de los parámetros en la tarjeta.
- Administrar el resto de credenciales del sistema o cifrar valores en el cliente.
- Cambios en las tarjetas de usuarios y roles ni en las rutas de la sección.

## Decisions

1. **Una tarjeta por registro, con las claves como filas** — `config.vue` consulta `GET /config?sort=+name` una sola vez y renderiza `config_card.vue` por registro; cada tarjeta lista `Object.entries(value)` como filas. Alternativa descartada: una sola tarjeta
   con todas las claves de todos los registros, que pierde la identidad (nombre y clave) de cada parámetro.

2. **Componente contenedor con raíz en fragmento** — `config.vue` devuelve `<template v-if>` con secciones de carga/vacío y `config_card` en `v-else`, sin elemento contenedor, para que las tarjetas sean hijos directos de `main__dash-grid` y `columns: 2` del
   grid siga repartiendo tarjetas. Alternativa descartada: envolver en un `<div>`, que convertiría el envoltorio en la única columna del grid.

3. **El popup recibe el registro completo, sin vuelta a `GET /config/{id}`** — `config_view.vue` se inicializa con el `entry` que ya trae la tarjeta, evitando una petición y un estado de carga. El popup se destruye al guardar, de modo que la lectura única de
   la prop en `setup` no queda obsoleta.

4. **Detección de formato en el cliente** — `detectValueMode` intenta `JSON.parse` y solo acepta objetos y arreglos como JSON; el resto es texto. En modo JSON el textarea trae `JSON.stringify(..., null, 2)` y Yup exige que el valor siga parseando; en modo
   texto no se impone ningún formato. Alternativa descartada: un textarea sin detección, que obligaría al usuario a adivinar si debe respetar comillas.

5. **Máscara por token con restauración al guardar** — los valores de las claves sensibles se sustituyen por `__KAREWA_OCULTO_n__` al cargar; el botón del popup alterna entre restaurar y volver a enmascarar releyendo el texto actual, de modo que una edición
   hecha con el valor a la vista se conserva. Al guardar sin mostrar, se restauran los tokens antes de enviar y, si falta alguno, el guardado se bloquea con un mensaje en el campo. Alternativa descartada: campo de contraseña aparte, que no escala cuando el
   `value` es JSON anidado.

6. **Claves sensibles por nombre, con reserva en modo texto** — la máscara por nombre (`pass`, `password`, `secret`, `token`, `apikey`, `api_key`) funciona igual en JSON y en texto; en modo texto la sustitución es sobre la cadena, por lo que solo se enmascaran
   secretos de tres caracteres o más para no romper el texto.

7. **Estilos por capas, sin tokens nuevos** — `config_view.vue` declara `@use` de `_section.sass` y de la hoja nueva `_config.sass`; `config_card.vue` y `config.vue` consumen `_section.sass` y `_results.sass` ya cargados de forma global por `dash.vue`. No se
   agregan colores, familias ni tamaños (spec `design-system`).

8. **Acción de baja condicional en `result-options`** — el botón "Eliminar" se renderiza solo si `optionList.delete` está presente, como los demás atributos del menú; los once usos existentes ya lo pasan, por lo que su comportamiento no cambia.

## Risks / Trade-offs

- [Un `value` con formato no soportado hoy dejaría de ser editable como JSON] → cae a texto plano y la tarjeta lo muestra como una sola fila "Valor", sin bloquear la edición.
- [El backend acepta `PUT /config/{id}` como actualización parcial: un campo vacío no se actualiza] → la validación en cliente impide enviar `name` o `slug` vacíos, y un `value` vacío en modo JSON se rechaza antes de salir.
- [Cambiar la clave de un secreto con el valor oculto deja el token sin su clave] → el token se restaura por valor, no por clave, así que el secreto viaja igual; lo que se pierde es la asociación con el nombre nuevo.
- [`GET /config` no declara paginación forzosa y hoy devuelve dos registros] → se pide `limit=99`; si el catálogo creciera habría que agregar paginación y replantear el número de tarjetas del grid.
- [El popup comparte `section-popup-slot` con roles y confirmaciones] → se conserva su comportamiento; el rol de diálogo y la gestión de foco que exige la spec `accessibility` quedan pendientes fuera de este cambio.

## Migration Plan

Sección ya existente y sin rutas nuevas: no hay migración. El rollback es retirar la tarjeta del grid y borrar `config.vue`, `config_card.vue`, `config_view.vue`, `config.value.js` y `_config.sass`, y devolver `result_options.vue` a su acción de eliminar
incondicional.

## Open Questions

Ninguno: la granularidad de las tarjetas (una por registro), el respaldo de los valores sensibles y la estrategia frente a un `value` que no sea JSON quedaron definidos con el usuario, contrastados contra la respuesta real de `GET /config`.
