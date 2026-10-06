# Spec Delta

## Purpose

Define cómo se construye y se desarrolla el frontend del Monitor Karewa: qué herramienta procesa el código fuente, con qué administrador de paquetes se manejan las dependencias, dónde terminan los artefactos de producción frente a las fuentes de desarrollo y
cómo se edita el código mientras corre el entorno reproducible.

## ADDED Requirements

### Requirement: Procesamiento con el bundler del proyecto

El sistema SHALL procesar el código fuente —estilos SASS y JavaScript— con el bundler declarado por el proyecto, y SHALL ejecutar sus scripts y la administración de dependencias con `pnpm`, sin que participe otro administrador de paquetes.

#### Scenario: Compilación del proyecto

- **WHEN** se ejecuta el script de build del proyecto
- **THEN** el bundler procesa los estilos SASS y el código JavaScript y la ejecución termina sin errores

#### Scenario: Administración de dependencias

- **WHEN** se instalan o actualizan dependencias
- **THEN** se usan `pnpm` y su archivo de bloqueo, y el repositorio no acumula bloqueos de otro administrador de paquetes

### Requirement: Separación entre fuentes de desarrollo y artefactos de producción

El sistema SHALL mantener `src/` exclusivamente como directorio de desarrollo y SHALL generar los artefactos compilados fuera de `src/`, en el directorio de salida del build, sin versionarlos.

#### Scenario: Salida del build

- **WHEN** se genera el build de producción
- **THEN** los artefactos (HTML, CSS, JavaScript) quedan en el directorio de salida configurado y `src/` conserva únicamente fuentes

#### Scenario: Artefacto compilado dentro de `src/`

- **WHEN** se detecta un archivo compilado dentro de `src/`
- **THEN** se considera una violación y se retira, porque `src/` no contiene artefactos de producción

#### Scenario: Artefactos fuera de los archivos rastreados

- **WHEN** se revisa el inventario de archivos rastreados por git
- **THEN** los artefactos compilados del build no aparecen, aunque existan en el disco de trabajo

#### Scenario: Publicación de la aplicación

- **WHEN** se publica una versión de producción
- **THEN** se sirven los artefactos del directorio de salida del build, no las fuentes de desarrollo de `src/`

### Requirement: Compresión únicamente en producción

El sistema SHALL servir las fuentes sin comprimir durante el desarrollo y SHALL aplicar la minificación únicamente al build de producción.

#### Scenario: Entorno de desarrollo

- **WHEN** se ejecuta el servidor de desarrollo
- **THEN** los estilos y los scripts se sirven sin comprimir y legibles, para poder depurarlos

#### Scenario: Build de producción

- **WHEN** se genera el build de producción
- **THEN** el CSS y el JavaScript resultantes quedan minificados

### Requirement: Entorno de desarrollo editable fuera del contenedor

El sistema SHALL mantener los archivos de desarrollo y su configuración en el directorio de trabajo, editables y aplicables mientras el entorno reproducible está en marcha, y SHALL permitir cambiar las variables de entorno sin entrar al contenedor.

#### Scenario: Edición de una fuente con el entorno en marcha

- **WHEN** se modifica un archivo fuente mientras corre el entorno docker
- **THEN** el cambio se refleja en la aplicación sin reconstruir la imagen ni entrar al contenedor

#### Scenario: Cambio de una variable de entorno

- **WHEN** se cambia el valor de una variable en el archivo de entorno local
- **THEN** la aplicación la usa tras recargar, sin editar nada dentro del contenedor

#### Scenario: Fuente que solo existe en el contenedor

- **WHEN** un archivo de desarrollo existe únicamente dentro de la imagen del contenedor
- **THEN** se considera una violación, porque debe vivir y editarse en el directorio de trabajo
