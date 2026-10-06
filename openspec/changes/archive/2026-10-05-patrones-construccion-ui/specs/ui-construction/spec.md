# Spec Delta

## Purpose

Define los patrones estructurales con los que se crean o modifican secciones, elementos y componentes en el Monitor Karewa: dónde vive cada pieza, cómo se compone, qué estilos consume y cómo se integra una sección nueva en la navegación.

## ADDED Requirements

### Requirement: Ubicación por rol del componente

El sistema SHALL ubicar cada componente nuevo según su rol: las secciones que son destino de una ruta viven en `src/components/views/` organizadas por módulo, y los elementos reutilizables por varias vistas viven en `src/components/partials/`.

#### Scenario: Nueva sección con ruta

- **WHEN** se crea una sección que será destino de una ruta
- **THEN** su componente vive en `src/components/views/` dentro de la carpeta de su módulo, o en la raíz de `views/` si no tiene submódulo

#### Scenario: Elemento reutilizable

- **WHEN** se crea un elemento destinado a usarse en varias vistas
- **THEN** su componente vive en `src/components/partials/`

#### Scenario: Modificación de una sección existente

- **WHEN** se modifica una sección o componente ya existente
- **THEN** la modificación se hace en su archivo actual, sin duplicarlo en otra ubicación

### Requirement: Anatomía del componente

El sistema SHALL construir los componentes con Composition API en `<script setup>`, un bloque `<template>` y, cuando llevan estilos, un bloque `<style lang="sass">` con alcance scoped que declara con `@use` las capas de estilos que consume.

#### Scenario: Componente nuevo completo

- **WHEN** se crea un componente nuevo
- **THEN** tiene bloque de script con Composition API, bloque template y, si aplica, bloque de estilos sass con alcance scoped

#### Scenario: Estilos sin efecto lateral

- **WHEN** un componente declara estilos scoped
- **THEN** sus reglas no alteran la presentación de otros componentes

#### Scenario: Dependencias de estilo declaradas

- **WHEN** los estilos de un componente necesitan tokens, mixins u objetos
- **THEN** las importa con `@use` en su propia hoja en lugar de redeclararlas

### Requirement: Reutilización de los parciales compartidos

El sistema SHALL componer las secciones con los parciales compartidos ya existentes —navegación lateral, encabezado de contenido, notificaciones, popups, popup de confirmación, indicador de carga, paginación, opciones de resultado y ayuda— antes de crear un
componente equivalente nuevo.

#### Scenario: Sección nueva compuesta

- **WHEN** se crea una sección nueva de la aplicación
- **THEN** reutiliza la navegación lateral y el encabezado de contenido compartidos en lugar de recrearlos

#### Scenario: Diálogo o confirmación

- **WHEN** una vista necesita confirmar una acción o mostrar un diálogo
- **THEN** usa los parciales de popup/confirmación existentes en lugar de implementar un modal propio

### Requirement: Composición por capas de estilos

El sistema SHALL mantener la separación de capas al agregar estilos: los tokens solo se declaran en `settings/`, las formas reutilizables (botones, formularios) en `objects/`, los estilos de componentes en `components/` y el reinicio/base en `base/`,
consumiendo cada capa lo que necesita mediante `@use`.

#### Scenario: Estilos de una vista nueva

- **WHEN** una vista nueva necesita estilos propios
- **THEN** su hoja vive en `assets/sass/components/` y el componente la incluye con `@use` desde su bloque scoped

#### Scenario: Forma reutilizable

- **WHEN** varias superficies necesitan la misma forma (por ejemplo un botón o un campo)
- **THEN** se define en `objects/` y se consume desde donde se usa, sin copiar reglas

#### Scenario: Sin tokens fuera de settings

- **WHEN** se agrega un color, tamaño tipográfico o breakpoint nuevo
- **THEN** se declara en `settings/` y queda disponible como variable CSS, sin declararlo en la hoja del componente

### Requirement: Registro de secciones nuevas en la navegación

El sistema SHALL registrar cada sección nueva en la navegación lateral con enlaces que apuntan por nombre de ruta a su listado y a su alta, siguiendo el agrupamiento de secciones existente.

#### Scenario: Sección registrada

- **WHEN** una sección nueva queda declarada en el router
- **THEN** la navegación lateral muestra sus enlaces de listado y de alta

#### Scenario: Enlace por nombre de ruta

- **WHEN** la navegación lateral enlaza una sección
- **THEN** lo hace por el nombre de la ruta declarada, no por la URL en texto
