# Tasks

## 1. Contrato y utilería compartida

- [x] 1.1 Ejecutar `pnpm api:sync` y confirmar que el módulo `config` resuelve en `GET /config` y `PUT /config/{id}` sin desalineaciones. Verificación: reporte con "Desalineaciones de código: Ninguna desalineación de código pendiente" y las dos filas `config`
      en "Módulos conformes".
- [x] 1.2 Crear `src/helpers/config.value.js` con `parseJsonObject`, `detectValueMode`, `toEditableValue`, `maskSecrets`, `restoreSecrets`, `maskForDisplay` e `isSecretKey`. Verificación: con los dos registros reales de `GET /config`, el modo detectado es
      JSON, el formateo produce pretty-print y el ciclo ocultar→restaurar devuelve el texto original idéntico.
- [x] 1.3 Condicionalizar la acción de eliminar de `src/components/partials/result_options.vue` con `v-if="optionList.delete"`, declarar `showPopup` entre los eventos y agregar `aria-label` al control de fila; agregar `aria-label` al botón de cerrar de
      `section_popup_slot.vue`. Verificación: los once usos existentes pasan `delete: true` y conservan su menú completo, y las nuevas filas de config no ofrecen baja.

## 2. Tarjeta de parámetros

- [x] 2.1 Crear `src/components/views/configuracion/config.vue` que consulta `GET /config` con `page=1`, `limit=99` y `sort=+name`, cubre los estados de carga, vacío y error con `store.push_alert`, y renderiza una tarjeta por registro sin elemento contenedor.
      Verificación: los escenarios "Acceso a la tarjeta" y "Error del servidor al listar" quedan respaldados por el componente.
- [x] 2.2 Crear `src/components/views/configuracion/config_card.vue` con encabezado de nombre y clave, filas por clave del `value` en JSON, estado vacío cuando el registro no tiene claves y `result-options` solo con `{pop}`. Verificación: los escenarios
      "Registro con value en JSON", "Registro sin valores" y "Acciones de la fila" quedan respaldados por el componente.
- [x] 2.3 Registrar la tarjeta en `src/components/views/configuracion/dash.vue` dentro de `main__dash-grid`. Verificación: el dashboard muestra las tarjetas de usuarios, roles y parámetros repartidas por las dos columnas del grid.
- [x] 2.4 Ocultar el valor de las claves sensibles en las filas de la tarjeta. Verificación: el escenario "Fila de una clave sensible" queda respaldado por el componente con el `pass` de `smtp_config`.

## 3. Popup de consulta y edición

- [x] 3.1 Crear `src/components/views/configuracion/config_view.vue` con `name`, `slug` y `value`, inicializado desde el registro de la tarjeta y abierto con `section-popup-slot`. Verificación: el escenario "Apertura del popup" queda respaldado por el
      componente.
- [x] 3.2 Detectar el formato del `value`, presentar el JSON formateado con su badge y validar con Yup que en modo JSON el valor siga parseando, dejando el modo texto sin esa exigencia. Verificación: los escenarios "Valor en formato JSON" y "Valor que no es
      JSON" quedan respaldados por el componente.
- [x] 3.3 Emplear `setFieldMessages` de `helpers/yup.locale.js` para los mensajes en español y para los errores por campo del servidor, más `store.push_alert` para el resto. Verificación: los escenarios "Formulario inválido" y "Rechazo del servidor con errores
      por campo" quedan respaldados por el componente.
- [x] 3.4 Enviar `PUT /config/{id}` con `name`, `slug` y `value`, desactivar el control de envío mientras la petición está en vuelo, cerrar el popup y recargar la tarjeta en éxito. Verificación: el escenario "Parámetro guardado" queda respaldado por el
      componente.

## 4. Respaldo de valores sensibles

- [x] 4.1 Enmascarar los valores sensibles al cargar el popup y mostrar el botón de mostrar/ocultar solo cuando hay secretos. Verificación: el escenario "Fila de una clave sensible" aplica también al popup, donde `pass` llega como token.
- [x] 4.2 Alternar entre restaurar y volver a enmascarar sobre el texto actual, conservando lo editado, y avisar cuando no es posible restaurar. Verificación: el escenario "Mostrar valores sensibles" queda respaldado por el componente.
- [x] 4.3 Restaurar los secretos antes de enviar cuando el usuario guardó con el valor oculto, y bloquear el guardado con mensaje en el campo si falta alguno. Verificación: los escenarios "Guardado con el valor oculto" y "Secreto ausente del texto" quedan
      respaldados por el componente.

## 5. Verificación integral

- [x] 5.1 Ejecutar `pnpm build` y confirmar que termina sin errores. Verificación: salida del build en 0.
- [x] 5.2 Ejecutar `npx prettier --check` sobre los archivos nuevos y modificados. Verificación: "All matched files use Prettier code style!".
- [x] 5.3 Ejecutar `openspec validate --all` y confirmar que todos los specs y el change pasan. Verificación: totals con 0 fallas.
