# Proposal

## Why

El Monitor Karewa ya tiene un sistema de diseño maduro y disciplinado (tokens en `_variables.sass` generados a CSS custom properties, 3 familias tipográficas, escala de tamaños, rampas de color derivadas, nomenclatura BEM) pero nunca se especificó: `SPEC.md`
§3 lo describe de forma vaga y errónea ("system fonts" cuando se usan Lato/Poppins/Oswald), así que cada adecuación futura depende de leer SASS por casualidad. Capturar el diseño como capability de OpenSpec fija la línea visual para futuras adecuaciones del
CMS y para la superficie de acceso público que se implementará después.

## What Changes

- Nueva capability `design-system`: contrato de comportamiento visual (tokens, tipografía, escalas de color, iconografía, nomenclatura, adhesión de superficies nuevas).
- Verificación de adhesión existente: el código actual ya cumple (cero literales hex/rgb en `src/**/*.vue` y `src/**/*.js`); se fija esa regla como escenario auditable para cambios futuros.
- Correcciones puntuales descubiertas por la auditoría (token `--access-panel-bg` para el fondo del panel de acceso y el uso de `var(--color2)`, que no existe, en los enlaces de autenticación).
- Sin cambios de código más allá de esas correcciones: el objetivo es especificar la línea existente, no refactorizar.

## Capabilities

### New Capabilities

- `design-system`: identidad visual única del Monitor Karewa — tokens de color/typografía/espaciado expuestos como CSS custom properties, escalas derivadas, reglas tipográficas por rol, iconografía Material Symbols, nomenclatura BEM de componentes y la
  obligación de que superficies nuevas (incluida el área de acceso público) reutilicen el mismo sistema.

### Modified Capabilities

<!-- Ninguna: openspec/specs/ del frontend está vacío; no hay capacidades previas. -->

## Impact

- **Archivos nuevos**: `openspec/changes/capturar-sistema-diseno/specs/design-system/spec.md` (y su archive posterior a `openspec/specs/design-system/spec.md`).
- **Documentación**: `AGENTS.md` gana la referencia a la capability. `SPEC.md` queda **fuera de alcance** (decisión de roadmap: su §3 seguirá desactualizado hasta un trabajo posterior; la fuente canónica de la línea visual pasa a ser el spec de OpenSpec).
- **Código**: dos micro-correcciones de estilo (tokens) sobre `src/assets/sass/`; sin cambios funcionales.
- **Sistemas afectados en el futuro**: cualquier vista o componente nuevo del CMS y, más adelante, el frontend de área de acceso público — ambos quedan obligados al mismo set de tokens.
