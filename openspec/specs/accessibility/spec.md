# accessibility Specification

## Purpose

Define las condiciones de accesibilidad que la interfaz del Monitor Karewa debe cumplir: idioma del documento, nombres accesibles en controles solo-icono, semántica de los diálogos, navegación por teclado con foco visible y texto alternativo en imágenes.

## Requirements

### Requirement: Idioma del documento

El sistema SHALL declarar en el documento raíz el idioma en que está la interfaz, de modo que los lectores de pantalla lo anuncien correctamente.

#### Scenario: Interfaz en español

- **WHEN** se carga la aplicación con la interfaz en español
- **THEN** el elemento raíz del documento declara el idioma español

### Requirement: Nombres accesibles en controles solo-icono

El sistema SHALL dotar de nombre accesible todo control cuyo contenido visual sea únicamente un icono o un símbolo —paginación, cierre, acciones de fila— para que un lector de pantalla pueda anunciar su propósito.

#### Scenario: Botón de cerrar

- **WHEN** se muestra un botón que solo contiene un icono de cerrar
- **THEN** el control expone un nombre accesible equivalente a "cerrar"

#### Scenario: Paginación

- **WHEN** se muestran los botones anterior/siguiente de un listado
- **THEN** cada uno expone un nombre accesible que indica la dirección de la navegación

### Requirement: Diálogos anunciados

El sistema SHALL presentar los popups, confirmaciones y ayudas como diálogos para la accesibilidad: con rol de diálogo, referenciado su título, foco dentro del diálogo al abrirse y foco devuelto al elemento de origen al cerrarse.

#### Scenario: Apertura de un popup

- **WHEN** la aplicación muestra un popup de confirmación o de información
- **THEN** el elemento declara rol de diálogo con su título referenciado y el foco pasa a su contenido

#### Scenario: Cierre de un popup

- **WHEN** el usuario confirma o cancela el diálogo
- **THEN** el foco regresa al control desde el que se abrió

### Requirement: Teclado y foco visible

El sistema SHALL permitir alcanzar y activar toda acción interactiva con el teclado y SHALL mostrar un indicador de foco visible en botones, enlaces y controles de formulario al recibir el foco.

#### Scenario: Navegación con teclado

- **WHEN** el usuario recorre la página con el teclado (Tab/Shift+Tab)
- **THEN** el foco avanza por los controles interactivos en orden y es visible en cada uno

#### Scenario: Activación

- **WHEN** un botón o enlace tiene el foco y se presiona Enter o Espacio
- **THEN** se ejecuta la misma acción que con el puntero

### Requirement: Texto alternativo en imágenes

El sistema SHALL proveer texto alternativo a toda imagen informativa y SHALL ocultar de los lectores de pantalla los iconos puramente decorativos.

#### Scenario: Imagen informativa

- **WHEN** una imagen comunica información (logotipo, gráfica, identificación)
- **THEN** tiene un texto alternativo que la describe

#### Scenario: Icono decorativo

- **WHEN** un icono solo decora un control que ya tiene nombre accesible
- **THEN** está marcado como decorativo para que los lectores de pantalla lo ignoren

### Requirement: Semántica HTML

El sistema SHALL construir la interfaz con elementos HTML nativos según el significado de cada bloque —navegación, contenido principal, formularios, listas, tablas y jerarquía de encabezados— y SHALL reservar los atributos ARIA para las funciones que el
elemento nativo no cubre.

#### Scenario: Navegación lateral

- **WHEN** se muestra la navegación lateral de la aplicación
- **THEN** está marcada con el elemento nativo de navegación y no con un contenedor genérico

#### Scenario: Campos de formulario etiquetados

- **WHEN** se muestra un campo de formulario
- **THEN** el campo está asociado a su etiqueta mediante el elemento nativo de etiqueta, sin necesidad de atributos ARIA adicionales

#### Scenario: Jerarquía de encabezados

- **WHEN** se compone una vista con títulos de sección
- **THEN** la jerarquía de encabezados avanza sin saltar niveles

#### Scenario: Función sin elemento nativo equivalente

- **WHEN** una función no tiene elemento nativo (por ejemplo un control personalizado dentro de un diálogo o el estado activo de un enlace de ruta)
- **THEN** se expone con el rol y las propiedades ARIA que describen esa función

#### Scenario: ARIA redundante

- **WHEN** el elemento nativo ya expresa la función por sí mismo
- **THEN** no se le añaden atributos ARIA que solo repiten lo que el elemento comunica
