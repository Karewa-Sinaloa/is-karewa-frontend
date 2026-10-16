# Design

## Context

- La vista pública de inicio vive en `src/components/views/public/home.vue` (ruta `/`, nombre `publicHomeView`) y hoy solo renderiza `<public-header />` con un comentario de placeholder.
- El precedente de `<picture>` en el proyecto está en `src/components/views/access.vue`: sources con `media` y un `<img>` como fallback.
- Los tokens SASS se declaran únicamente en `src/assets/sass/settings/_variables.sass` y se exportan como custom properties en `:root` desde `src/assets/sass/base/_base.sass` (p. ej. `--color-dark`, `--color-grayscale-*`, `--fs-*`, `--ff*`, `--public-gutter`). Las hojas de componentes viven en `src/assets/sass/components/` y se consumen con `@use` desde el bloque `<style lang="sass">` del componente (spec `ui-construction`).
- Ambas imágenes del hero ya existen en `src/assets/images/` (`hero_home.webp`, `hero_home_mobile.webp`), por lo que no hay tarea de generación de assets.

## Goals / Non-Goals

**Goals:**

- Hero fullwidth con `aspect-ratio: 3 / 1` integrado en la vista pública de inicio, sin alterar el encabezado público existente.
- Selección de imagen por `<picture>` con corte en 1024px, siguiendo el patrón ya usado en `access.vue`.
- Overlay oscuro basado en tokens (sin literales de color fuera de `settings/`) que garantice contraste del texto.
- Texto del hero (`h1` + párrafo) exactamente el definido en la propuesta.

**Non-Goals:**

- No se definen llamadas a la acción (botones/enlaces) dentro del hero; el usuario no las solicitó.
- No se modifica la vista autenticada `/admin` ni su widget "Bienvenidos".
- No se agregan nuevos tokens de color: se reutilizan los existentes.
- No se toca el router ni la navegación pública.

## Decisions

1. **Implementación inline en la vista vs. partial**: el hero se construye directamente en `src/components/views/public/home.vue` y no como partial en `partials/`. Rationale: la spec `ui-construction` ubica en `partials/` lo reutilizable por varias vistas; el hero solo lo consume la portada pública. Alternativa descartada: partial `home_hero.vue`, que prematura la extracción hasta que otra vista lo reutilice.
2. **Corte de imagen con `media` en px**: `<source media="(min-width: 1024px)" srcset=".../hero_home.webp">` y `<img src=".../hero_home_mobile.webp">` como fallback (que además cubre viewports < 1024px). Rationale: coincide con el precedente de `access.vue` y con lo pedido (mayores/menores de 1024px). Se usa el literal `1024px` en el `media` igual que en `access.vue`; el token `--bp5` (64rem) no es evaluable dentro de un atributo `media` HTML.
3. **Proporción 3:1 con `aspect-ratio`**: el contenedor del hero declara `aspect-ratio: 3 / 1` y la imagen usa `width/height: 100%` con `object-fit: cover`. Rationale: `aspect-ratio` mantiene la proporción en cualquier ancho sin media queries ni JS. Alternativa descartada: padding-top hack, innecesaria con soporte moderno de `aspect-ratio`.
4. **Overlay como pseudo-elemento con token**: el overlay se dibuja con un `::before` (o elemento equivalente) que usa `background-color: var(--color-dark)` y una opacidad derivada del token (p. ej. `opacity` o `color-mix`), evitando literales `rgba()`/hex fuera de `settings/` conforme a la spec `design-system`. Si la implementación requiriera un nuevo valor (por ejemplo un degradado), queda registrado aquí como excepción decorativa; no es el caso: basta un color sólido translúcido.
5. **Imagen decorativa**: el `<img>` del `<picture>` lleva `alt=""` (y no tiene interacción), porque la información la aportan el `h1` y el párrafo; así se cumple la spec `accessibility` (ocultar lo decorativo). El texto superpuesto usa `h1` (Fira Sans 600 por token) y párrafo (Poppins 400), con colores claros sobre el overlay.
6. **Estilos**: nueva hoja `src/assets/sass/components/_home_hero.sass` con nomenclatura BEM (bloque `.home-hero`, elementos `__media`, `__overlay`, `__content`), incluida con `@use` desde el bloque scoped del componente y consumiendo tokens (colores, tamaños `--fs-*`, familias `--ff*`, `--public-gutter`) sin redeclararlos.

## Risks / Trade-offs

- [Contraste insuficiente si la imagen es muy clara] → el overlay oscuro cubre toda la imagen con opacidad fija sobre `--color-dark`; se valida visualmente el texto blanco sobre el hero en ambos breakpoints.
- [Relación aspecto vs. altura de texto en viewports móviles estrechos] → con 3:1 en pantallas pequeñas el hero es bajo; se permite que el contenido se ajuste (tamaño de fuente desde tokens) y, si el párrafo no cabe, se verifica legibilidad sin desbordes; no se pide cambiar la proporción solicitada.
- [Sobreposición con el header público] → el hero se inserta debajo de `<public-header />` en el flujo normal del documento, sin posicionamiento fijo que lo superponga.
- [Cambio futuro de assets] → las rutas de imagen quedan centralizadas en el template del componente, no en el CSS, para que `src/` siga siendo la única fuente de los binarios (spec `tooling`).

## Migration Plan

Cambio de solo adición en la vista pública: desplegar el build normal (`pnpm build`). Rollback: revertir el commit que modifica `src/components/views/public/home.vue` y elimina `_home_hero.sass`; no hay datos ni contrato afectados.

## Open Questions

- Ninguna abierta: el destino (vista pública de inicio), las imágenes, la proporción y los textos fueron definidos por el usuario; el overlay y el tratamiento decorativo de la imagen derivan de las specs existentes.
