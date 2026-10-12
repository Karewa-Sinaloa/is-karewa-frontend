# Spec Delta

## ADDED Requirements

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
