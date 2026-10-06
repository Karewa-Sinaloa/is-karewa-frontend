# Design

## Context

Patrones observados en el código que este cambio captura (verificación de tareas incluida):

- `src/components/views/` organiza las secciones por módulo (`proveedores/`, `admin_units/`, `contracts/`) con excepciones en la raíz (`home.vue`, `organization.vue`, `access.vue`); `src/components/partials/` contiene los 20+ elementos compartidos (sidebar,
  content_header, popups, confirmation_popup, notifications, loading, pagination, result_options, help…).
- El router nombra las rutas `<módulo><Acción>` en camelCase (`proveedoresList`, `proveedoresCreate`, `proveedoresView`, `contractList`…) y todas las de aplicación llevan `meta.login: true`; el sidebar enlaza con `router-link :to="{ name: … }"` y agrupa el
  listado y el alta de cada sección.
- La estructura SASS por capas es real: `settings/_variables.sass` (únicos tokens, escala de colores derivada), `mixins/`, `base/_base.sass` (emite `:root` con `--ff*`, `--fs-*`, `--color-*`, breakpoints), `objects/_buttons.sass` y `_forms.sass` (formas
  reutilizables), `components/_*.sass` (hojas por componente). Las vistas las incluyen con `@use "../../../assets/sass/components/_results.sass"` dentro de `<style lang="sass" scoped>` (28 usos), y las hojas declaran sus dependencias con `@use` (por ejemplo
  `_access.sass` consume `objects/_forms` y `objects/_buttons`).
- Cobertura existente: `design-system` obliga al sistema visual (tokens, tipografías, iconografía, BEM, superficies nuevas), `routing` protege rutas y define alta/edición nombrando solo los tres módulos actuales. Ninguna capability cubre ubicación, anatomía,
  reutilización de parciales ni el sidebar.

Ver `proposal.md` — Why para la motivación.

## Goals / Non-Goals

**Goals:**

- Un contrato verificable para toda petición futura de sección/modificación/componente, alineado con los patrones que la app ya practica.
- Cerrar los huecos estructurales: ubicación, anatomía, reutilización, capas SASS, navegación y generalización del patrón de rutas.

**Non-Goals:**

- Corregir código actual ni añadir lint/herramientas de validación de patrones.
- Cambiar `design-system` (la identidad visual ya está especificada) ni requirements existentes de `routing`.
- Definir estilos nuevos, tokens o variantes visuales.
- Documentar el flujo de desarrollo (comandos, build) que ya cubren `AGENTS.md` y el contexto de OpenSpec.

## Decisions

1. **Capability nueva `ui-construction` en vez de ampliar `design-system`.** La frontera de `design-system` es _qué_ se ve (tokens, tipografía, iconos, BEM); la nueva capability es _cómo se estructura_ el código de UI (ubicación, anatomía, composición,
   navegación). Alternativa descartada: meter todo en `design-system` — lo convertiría en una capability catch-all y mezclaría requisitos visuales con estructurales.
2. **`routing` se amplía con `ADDED`, no `MODIFIED`.** El requirement existente "Rutas de alta y de edición" sigue siendo cierto para los tres módulos que nombra; el patrón general para nuevas secciones entra como requisito aparte. Alternativa descartada:
   reescribir el existente para generalizarlo — obligaría a reescribir texto intacto bajo `MODIFIED` y arriesga perder escenarios al archivar.
3. **El registro en el sidebar vive en `ui-construction`, no en `routing`.** El sidebar es interfaz (cómo se navega), mientras `routing` conserva rutas, guards y redirecciones; separarlos evita que un cambio de menú obligue a tocar el contrato de rutas.
4. **Captura retrospectiva fiel.** Cada requirement se redacta desde la práctica actual para que apply no fuerce cambios de código; si la verificación encuentra excepciones (por ejemplo hojas con `@use` inesperados o componentes mal ubicados), se anotan como
   hallazgos en las tareas en vez de "corregirlas" en este cambio documental.
5. **Actualización documental incluida.** La tabla de capabilities de `AGENTS.md` y `CHANGELOG.md` se actualizan junto con el apply, porque la convención del proyecto es que `AGENTS.md` indexe las capabilities. Nota: el change en vuelo `retirar-spec-md`
   también edita `AGENTS.md`; el segundo apply en ejecutarse rebasa su edición.

## Risks / Trade-offs

- [Solapamiento percibido con `design-system` (tokens)] → El nuevo requisito de capas solo dice _dónde se declaran_ los tokens; cómo se derivan y exponen queda íntegramente en `design-system`.
- [Codificar patrones accidentales como si fueran contrato] → Los requirements se redactan a nivel observable (ubicación, composición, enlaces por nombre de ruta) y no congelan detalles cosméticos; evolucionar un patrón futuro será un delta normal.
- [Dos changes en vuelo editan `AGENTS.md`] → Resuelto en apply con rebase del que se ejecute segundo; no cambia specs ni tareas.
- [Specs sin suite de tests] → Verificación por lectura de escenarios contra el código y `openspec validate --all`, según la convención del proyecto.

## Migration Plan

1. Aplicar los dos deltas y archivar el change para sincronizar `ui-construction` y el delta de `routing` a `openspec/specs/`.
2. En el mismo apply: actualizar la tabla de capabilities y la convención de componentes en `AGENTS.md`, más el registro en `CHANGELOG.md`.
3. Verificación: `openspec validate --all` y lectura de los escenarios contra `router/index.js`, `sidebar.vue` y la estructura `src/assets/sass/`.
4. Rollback: revertir el commit del apply; no hay cambios de código que resguardar.

## Open Questions

<!-- Ninguna: el alcance (solo specs) y el objeto de los patrones (esta app frontend) quedaron decididos con el usuario en la fase de propuesta. -->
