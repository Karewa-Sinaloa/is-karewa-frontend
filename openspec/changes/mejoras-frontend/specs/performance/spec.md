# Spec Delta

## ADDED Requirements

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
