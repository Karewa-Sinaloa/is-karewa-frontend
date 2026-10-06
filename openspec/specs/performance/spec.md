# performance Specification

## Purpose

Define el comportamiento transversal de rendimiento del Monitor Karewa: paginación de listados en el servidor y el umbral de la búsqueda, de modo que las vistas grandes no carguen de golpe y las consultas de búsqueda no se disparen con entradas incompletas.

## Requirements

### Requirement: Paginación de listados en el servidor

El sistema SHALL solicitar los listados por página con un límite de elementos por página y SHALL mostrar el control de paginación únicamente cuando el servidor informa más de una página, refrescando el listado cuando la ruta de página cambia.

#### Scenario: Solicitud paginada

- **WHEN** un listado se carga
- **THEN** la petición incluye la página actual y el límite de elementos, y los datos llegan del servidor ya paginados

#### Scenario: Control de paginación

- **WHEN** el servidor devuelve una sola página de resultados
- **THEN** no se muestra el control de paginación

#### Scenario: Cambio de página en ruta paginada

- **WHEN** el usuario navega a otra página en un listado cuya ruta incluye la página
- **THEN** el listado se vuelve a solicitar con la página seleccionada

### Requirement: Búsqueda con umbral y sanitización

El sistema SHALL consultar resultados de búsqueda solo cuando la cadena tiene al menos 3 caracteres después de eliminar caracteres no permitidos y espacios duplicados, SHALL limpiar los resultados cuando la cadena queda por debajo del umbral y SHALL cerrar la
búsqueda con la tecla Escape.

#### Scenario: Cadena bajo el umbral

- **WHEN** el usuario escribe menos de 3 caracteres válidos
- **THEN** no se emite ninguna petición de búsqueda y no se muestran resultados

#### Scenario: Cadena con caracteres no permitidos

- **WHEN** la entrada contiene símbolos distintos de letras, números o espacios
- **THEN** la consulta usa la cadena depurada, sin símbolos ni espacios duplicados

#### Scenario: Resultados paginados

- **WHEN** la búsqueda devuelve más resultados de los que caben en una página
- **THEN** los resultados se muestran con su propia paginación

#### Scenario: Cierre con Escape

- **WHEN** el usuario presiona Escape con la búsqueda abierta
- **THEN** la búsqueda se cierra

### Requirement: Carga por ruta con code-splitting

El sistema SHALL dividir el código por ruta, de modo que la carga inicial descargue solo el arranque de la aplicación y el código de la ruta inicial, y cada ruta posterior descargue su propio bloque al ser navegada.

#### Scenario: Carga inicial

- **WHEN** el usuario visita la aplicación por primera vez
- **THEN** se descargan únicamente el arranque y el código de la ruta inicial, sin incluir el de las demás rutas

#### Scenario: Navegación a otra ruta

- **WHEN** el usuario navega a una ruta que aún no se ha visitado
- **THEN** se descarga el bloque de código de esa ruta y la vista se muestra

#### Scenario: Ruta ya visitada

- **WHEN** el usuario regresa a una ruta ya navegada en la misma sesión
- **THEN** la vista se muestra sin volver a descargar su bloque

### Requirement: Artefactos actualizados tras un despliegue

El sistema SHALL servir tras cada despliegue los artefactos de la versión publicada, sin que la caché del cliente mantenga en ejecución scripts o estilos de una versión anterior.

#### Scenario: Despliegue de una versión nueva

- **WHEN** se publica una versión nueva y el usuario vuelve a cargar la aplicación
- **THEN** la aplicación ejecuta los artefactos de la versión nueva

#### Scenario: Caché con service worker

- **WHEN** la aplicación usa un service worker para cachear recursos
- **THEN** la activación de la versión nueva retira los recursos cacheados por la versión anterior

#### Scenario: Sin service worker

- **WHEN** la aplicación no usa ningún service worker
- **THEN** no hay caché local de artefactos que pueda servir una versión anterior
