# code-quality Specification

## Purpose

Define las condiciones de calidad verificables del repositorio del frontend: verificación de estilo ejecutable, ausencia de logs de depuración en el build de producción y ausencia de dependencias y archivos de código sin uso.

## Requirements

### Requirement: Verificación de estilo ejecutable

El sistema SHALL exponer un comando de verificación de estilo configurado con las reglas del proyecto, compatible con el formato de Prettier, y su ejecución SHALL terminar informando si el código cumple o qué violaciones contiene.

#### Scenario: Comando disponible

- **WHEN** se ejecuta el comando de lint del proyecto
- **THEN** corre sobre el código fuente y termina con un resultado que distingue entre sin-violaciones y violaciones listadas

#### Scenario: Código conforme

- **WHEN** el código cumple las reglas configuradas
- **THEN** el comando termina sin reportar errores

### Requirement: Sin logs de depuración en producción

El sistema SHALL construir el paquete de producción sin mensajes `console.log` de depuración, de modo que la consola de una sesión real no muestre trazas internas del desarrollo.

#### Scenario: Bundle de producción

- **WHEN** se genera el build de producción
- **THEN** el código empaquetado no contiene llamadas `console.log` de depuración

### Requirement: Sin dependencias sin uso

El sistema SHALL declarar únicamente dependencias que el código fuente o la configuración del proyecto utilicen; una dependencia declarada que ninguna fuente referencia se elimina.

#### Scenario: Dependencia no importada

- **WHEN** un paquete declarado en `package.json` no es importado por ninguna fuente ni referenciado por la configuración
- **THEN** se considera una violación y se elimina del manifiesto

### Requirement: Sin archivos de código sin uso

El sistema SHALL mantener en el árbol de fuentes únicamente archivos referenciados por el código o la aplicación; los archivos de ayuda o componentes sin ninguna referencia se retiran.

#### Scenario: Archivo huérfano

- **WHEN** un archivo de `src/` no es importado ni referenciado por ningún otro archivo
- **THEN** se considera una violación y se retira del repositorio

### Requirement: Archivos de entorno no versionados

El sistema SHALL mantener fuera del control de versiones los archivos de entorno con valores reales del despliegue: solo se versiona su plantilla pública y el archivo con valores reales queda ignorado por git, aunque exista localmente para el desarrollo y el
arranque por docker.

#### Scenario: Plantilla versionada

- **WHEN** se revisa el repositorio
- **THEN** la plantilla pública de variables de entorno está versionada

#### Scenario: Archivo real no versionado

- **WHEN** se revisa el inventario de archivos rastreados por git
- **THEN** el archivo de entorno con valores reales no aparece, aunque exista en el disco de trabajo

#### Scenario: Archivo nuevo en desarrollo

- **WHEN** un desarrollador crea su archivo de entorno local a partir de la plantilla
- **THEN** git lo ignora y no lo incluye en ningún commit

### Requirement: Sin regresiones al corregir superficies compartidas

El sistema SHALL conservar el comportamiento de las vistas, rutas y componentes que consumen una pieza compartida —parcial, objeto u hoja de estilos— cuando esa pieza se corrige o se modifica.

#### Scenario: Corrección en un parcial compartido

- **WHEN** se corrige un parcial compartido (navegación lateral, encabezado de contenido, popups, paginación, ayuda)
- **THEN** las vistas que lo consumen conservan su presentación y su comportamiento

#### Scenario: Corrección en una forma u hoja compartida

- **WHEN** se corrige un objeto o una hoja compartida (botones, formularios, capa base)
- **THEN** las superficies que la consumen siguen conforme a los tokens y a la nomenclatura del sistema, sin verse afectadas de otro modo

#### Scenario: Pieza compartida por varias rutas

- **WHEN** un cambio modifica una pieza que varias rutas utilizan
- **THEN** se contrasta el resultado con los requisitos de esas rutas y ninguna dejó de cumplir su comportamiento
