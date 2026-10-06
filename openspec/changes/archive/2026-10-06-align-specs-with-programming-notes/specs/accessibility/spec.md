# Spec Delta

## ADDED Requirements

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
