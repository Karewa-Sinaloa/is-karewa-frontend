# Spec Delta

## Purpose

Define la relación del frontend con el contrato OpenAPI que publica la API: el swagger como fuente canónica de módulos, rutas y campos, la sincronización re-ejecutable con copia versionada y el reporte que clasifica las divergencias entre el código y el
contrato.

## ADDED Requirements

### Requirement: Contrato publicado como fuente canónica

El sistema SHALL implementar cada módulo consumido por el frontend —ruta, método y campos enviados— conforme al contrato OpenAPI publicado por la API en su documentación, y SHALL tratar al contrato vigente como la referencia a la que alinearse cuando cambia.

#### Scenario: Módulo conforme al contrato

- **WHEN** una vista realiza una petición cuyo módulo y método existen en el contrato publicado
- **THEN** la petición se considera alineada y no requiere corrección

#### Scenario: Cambio del contrato

- **WHEN** el contrato publica un cambio en un módulo que el frontend ya consume
- **THEN** la siguiente sincronización lo detecta y el código queda marcado para alinearse al contrato nuevo

### Requirement: Sincronización re-ejecutable con copia versionada

El sistema SHALL ofrecer un comando de sincronización que derive el origen del contrato desde la configuración de la API, descargue la especificación vigente, la guarde como copia versionada en el repositorio y genere un reporte de divergencias contra los
módulos usados en el código, sin sobrescribir la copia anterior cuando la descarga falla.

#### Scenario: Sincronización con contrato disponible

- **WHEN** se ejecuta la sincronización con la API accesible
- **THEN** la copia versionada y el reporte quedan actualizados con la especificación vigente

#### Scenario: El swagger cambió

- **WHEN** la API publica una especificación distinta a la copia versionada
- **THEN** la sincronización actualiza la copia y el diff contra la versión anterior refleja el cambio

#### Scenario: API no disponible

- **WHEN** la descarga de la especificación falla
- **THEN** la copia versionada anterior se conserva intacta y el comando informa el error

### Requirement: Reporte de divergencias con dos clases

El sistema SHALL generar en cada sincronización un reporte que clasifica cada divergencia entre código y contrato en desalineación de código —cuando el contrato declara el equivalente— o gap de contrato —cuando el código usa algo que el contrato no declara—,
listando el módulo o ruta afectado en ambos casos.

#### Scenario: Desalineación de código

- **WHEN** el frontend invoca un módulo cuyo path equivalente existe en el contrato bajo otro nombre
- **THEN** el reporte lo clasifica como desalineación de código y ese módulo se corrige para resolver en el endpoint documentado

#### Scenario: Gap de contrato

- **WHEN** el frontend invoca un path o envía un campo que el contrato no declara
- **THEN** el reporte lo clasifica como gap de contrato y el comportamiento del frontend se conserva sin cambios

### Requirement: Módulos conformes o registrados

El sistema SHALL garantizar que todo módulo usado por el frontend resuelva en un path y método del contrato vigente, o figure en el reporte como gap de contrato con su motivo.

#### Scenario: Módulo sin equivalente ni registro

- **WHEN** el código usa un módulo que no resuelve en ningún path del contrato y no está registrado como gap
- **THEN** el reporte lo señala como desalineación pendiente de resolverse

#### Scenario: Inventario completo

- **WHEN** se revisa el reporte de una sincronización
- **THEN** cada módulo usado en el código aparece ya sea como conforme, como desalineación corregida, o como gap de contrato registrado
