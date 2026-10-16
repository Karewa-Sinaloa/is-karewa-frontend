# ui-construction Specification

## Purpose

Define los patrones estructurales con los que se crean o modifican secciones, elementos y componentes en el Monitor Karewa: dónde vive cada pieza, cómo se compone, qué estilos consume y cómo se integra una sección nueva en la navegación.

## Requirements

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

El sistema SHALL componer las secciones con los parciales compartidos ya existentes de su superficie correspondiente: el panel administrativo reutiliza navegación lateral, encabezado de contenido, notificaciones, popups, popup de confirmación, indicador de carga, paginación, opciones de resultado y ayuda; el frontend público reutiliza su propio header, menú y footer compartidos antes de crear equivalentes nuevos.

#### Scenario: Sección nueva compuesta

- **WHEN** se crea una sección nueva del panel administrativo
- **THEN** reutiliza la navegación lateral y el encabezado de contenido compartidos en lugar de recrearlos

#### Scenario: Sección pública compuesta

- **WHEN** se crea una sección nueva del frontend público
- **THEN** reutiliza el header, el menú y el footer públicos compartidos en lugar de implementar variantes duplicadas

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

El sistema SHALL registrar cada sección nueva en la navegación compartida de la superficie a la que pertenece: el panel administrativo la expone en la navegación lateral con enlaces por nombre de ruta a su listado y a su alta, y el frontend público la expone en su menú público sin depender de sidebar.

#### Scenario: Sección registrada

- **WHEN** una sección nueva del panel queda declarada en el router
- **THEN** la navegación lateral muestra sus enlaces de listado y de alta

#### Scenario: Sección pública registrada

- **WHEN** una sección nueva del frontend público queda declarada en el router
- **THEN** el menú público incorpora el enlace correspondiente a esa vista sin usar la navegación lateral administrativa

#### Scenario: Enlace por nombre de ruta

- **WHEN** una navegación compartida enlaza una sección
- **THEN** lo hace por el nombre de la ruta declarada, no por la URL en texto

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

### Requirement: Registro de la configuración general en el pie de la navegación

El sistema SHALL registrar la sección de configuración general en la navegación lateral mediante el icono de configuración de su pie, que enlaza por nombre de ruta al dashboard de la sección.

#### Scenario: Icono del pie

- **WHEN** se muestra el pie de la navegación lateral
- **THEN** el icono de configuración queda visible con un nombre accesible que indica su propósito

#### Scenario: Enlace a la configuración

- **WHEN** el usuario activa el icono de configuración del pie
- **THEN** la navegación se resuelve por el nombre de la ruta declarada, no por la URL en texto, y se abre el dashboard de la sección

### Requirement: Header público como parcial reutilizable

El sistema SHALL construir el encabezado público en `src/components/partials/` como un parcial compartido distinto de `src/components/partials/content_header.vue`, para que la superficie pública no dependa del encabezado del panel administrativo.

#### Scenario: Creación del header público

- **WHEN** se implemente el encabezado del frontend público
- **THEN** su archivo vive en `src/components/partials/` como parcial reutilizable y no sustituye ni duplica el encabezado administrativo existente

#### Scenario: Reutilización entre vistas públicas

- **WHEN** dos o más vistas públicas compartan el mismo shell
- **THEN** consumen el mismo parcial de header público en lugar de rehacer su markup en cada vista

#### Scenario: Header montado en todas las vistas públicas

- **WHEN** se abre cualquier vista de `src/components/views/public/`
- **THEN** esa vista monta el parcial de header público existente en lugar de declarar su propio encabezado

### Requirement: Composición del shell público sin sidebar administrativo

El sistema SHALL componer las vistas públicas que usen este header sin incorporar `sidebar.vue` ni la estructura visual del panel, preservando un shell específico para navegación pública horizontal.

#### Scenario: Vista pública con header propio

- **WHEN** se muestre una vista del frontend público que incluya el header minimalista
- **THEN** la composición visible usa el header público compartido y omite la navegación lateral administrativa

### Requirement: Hojas de estilo separadas para la superficie pública

El sistema SHALL mantener los estilos del frontend público en archivos Sass separados de los del panel administrativo, reutilizando los mismos tokens y objetos compartidos sin mezclar reglas específicas de ambas superficies en una sola hoja.

#### Scenario: Estilo específico del frontend público

- **WHEN** una vista o parcial público necesita estilos propios
- **THEN** sus reglas viven en archivos Sass específicos de la superficie pública y consumen los tokens y objetos compartidos mediante `@use`

#### Scenario: Estilo del panel sin contaminación pública

- **WHEN** se revisan las hojas del panel administrativo
- **THEN** no contienen reglas exclusivas del header, menú o footer del frontend público
