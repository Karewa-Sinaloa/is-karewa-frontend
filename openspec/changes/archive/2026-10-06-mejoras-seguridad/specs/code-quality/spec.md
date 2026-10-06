# Spec Delta

## ADDED Requirements

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
