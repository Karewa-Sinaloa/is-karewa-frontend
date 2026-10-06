# Spec Delta

## MODIFIED Requirements

### Requirement: Ubicación por rol del componente

El sistema SHALL ubicar cada componente nuevo según su rol: las secciones que son destino de una ruta viven en `src/components/views/` organizadas por módulo, y los elementos reutilizables por varias vistas viven en `src/components/partials/`.

#### Scenario: Nueva sección con ruta

- **WHEN** se crea una sección que será destino de una ruta
- **THEN** su componente vive en `src/components/views/` dentro de la carpeta de su módulo, o en la raíz de `views/` si no tiene submódulo

#### Scenario: Elemento reutilizable

- **WHEN** se crea un elemento destinado a usarse en varias vistas
- **THEN** su componente vive en `src/components/partials/`

#### Scenario: Modificación de una sección existente

- **WHEN** se modifica o se corrige una sección o componente ya existente
- **THEN** el cambio se aplica en su archivo actual —sin duplicarlo en otra ubicación—, se conserva el comportamiento correcto que ya tenía y solo se altera lo necesario para el propósito del cambio

## ADDED Requirements

### Requirement: Vínculos y recursos externos

El sistema SHALL tratar los enlaces y los recursos de orígenes externos conforme a la política de navegación y seguridad del proyecto: un enlace que abre contenido fuera de la aplicación declara una apertura segura y los recursos externos se limitan a los
orígenes que el proyecto declara.

#### Scenario: Enlace que abre fuera de la aplicación

- **WHEN** una vista muestra un enlace que abre en una pestaña o ventana distinta
- **THEN** el enlace declara la apertura segura (`rel="noopener"`) para que el destino no acceda a la ventana de la aplicación

#### Scenario: Recurso de un origen no declarado

- **WHEN** un cambio intenta cargar un script, una fuente u otro recurso de un origen externo que el proyecto no declara
- **THEN** el recurso no se incorpora hasta que su origen quede declarado en la documentación del proyecto

#### Scenario: Recurso declarado

- **WHEN** se auditan los orígenes externos que la aplicación carga
- **THEN** corresponden a los declarados en la documentación del proyecto
