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
