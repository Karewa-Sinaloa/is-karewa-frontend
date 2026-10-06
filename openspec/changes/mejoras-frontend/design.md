# Design

## Context

Estado actual verificado que motiva cada eje (detalle de brechas al final):

- **Rendimiento/caché**: `src/router/index.js` importa las 16+ vistas estáticamente → un solo bundle (`dist/assets/index-*.js`, ~588 KB) sin code-splitting ni `manualChunks` en `vite.config.js`. `sw.js` existe con estrategia rota (`caches.match` sin fallback)
  pero su registro está comentado en `src/App.vue` (`//registerServiceWorker()`), así que hoy no hay service worker en ejecución.
- **Bugs/limpieza**: `console.log` en 10 puntos (incluido `src/helpers/frontend.logs.js` que además imprime cada payload); `helpers/site.config.vue` usa la API de Vuex (`this.$store.commit`) sin ser importado; `home.vue` declara un computed sin usar;
  `verification.vue` llama a la acción inexistente `store.set_alert` (su comportamiento deseado ya está capturado en el delta de `authentication` de `retirar-spec-md`); paginación de proveedores/unidades enlaza `:page` en rutas que no lo declaran.
- **Calidad/DX**: sin ESLint (solo Prettier y `pnpm build`); `sass-loader` declarado en devDependencies sin uso aparente.
- **Accesibilidad**: cero atributos `aria-*` en todo `src/**/*.vue`; `index.html` declara `<html lang="en">` con la interfaz en español; botones solo-icono (paginación, cierre, `result_options`) sin nombre accesible; `:focus` definido solo dentro de
  `objects/_forms.sass`, no para botones/enlaces.

Cobertura existente: `design-system` rige la identidad visual (tokens, tipografías, iconografía, BEM) pero no la semántica de accesibilidad; `performance` y `routing` existirán con sus requisitos base tras archivar `retirar-spec-md`; no hay capability de
calidad de código.

Ver `proposal.md` — Why para la motivación y el alcance "solo specs" decidido con el usuario.

## Goals / Non-Goals

**Goals:**

- Capturar el estado deseado de los cuatro ejes como requirements verificables, en capabilities con frontera clara.
- Dejar documentadas las brechas spec↔código para que los cambios de implementación futuros tengan punto de partida.

**Non-Goals:**

- Implementar cualquier mejora en este change (solo specs, decisión explícita del usuario).
- Módulos de CI/CD, pre-commit hooks o incorporación de nuevas herramientas.
- Requisitos de contraste de color o pruebas de pantalla lectora, que exigirían medición sobre el diseño existente.
- Modificar los requisitos existentes de `performance`/`routing` ni las capabilities visuales.

## Decisions

1. **Dos capabilities nuevas en vez de una catch-all.** `accessibility` agrupa semántica y teclado (propiedad observable de la interfaz); `code-quality` agrupa condiciones verificables del repositorio. Alternativa descartada: una capability `frontend-quality`
   con los cuatro ejes — mezclaría interfaz con proceso y violaría el criterio de frontera cohesiva.
2. **Accesibilidad separada de `design-system`.** `design-system` define _cómo se ve_ (paleta, tipografía, iconos); `accessibility` define _cómo se percibe con tecnologías de apoyo_ (idioma, nombres, roles, foco). Su requisito de "superficies nuevas reutilizan
   el sistema" no cubre ARIA ni teclado.
3. **`performance` y `routing` ampliados con `ADDED`, no `MODIFIED`.** Los requisitos existentes (paginación/búsqueda en `performance`, rutas y guards en `routing`) siguen siendo válidos; lo nuevo son exigencias adicionales. `routing` ya fue ampliado igual por
   `patrones-construccion-ui` — dos deltas `ADDED` sobre la misma capability en cambios distintos son compatibles al archivar (se concatenan requirements).
4. **Orden de archivo: `retirar-spec-md` antes que este.** Ese change crea la capability `performance`; si este se archivara primero, su delta crearía la spec principal sin el Purpose ni los requisitos base. Tarea de verificación incluida.
5. **Prohibición de `console.log` a nivel de bundle de producción.** El sistema de logging ya habla con el servidor (`frontend-logs`); el requisito prohíbe las trazas de depuración en el artefacto publicado, sin prohibir el mecanismo de logging controlado.
6. **Brechas como parte del diseño.** Dado que el alcance es "solo specs", la lista spec↔código vive en `design.md` (artefacto de planificación) en lugar de crearse una capability o archivo nuevo; los cambios de implementación la consumirán como backlog.

## Brechas spec↔código (entrada a cambios futuros)

- `routing` ↔ código: `proveedoresList` y `unidadesAdministrativasList` no declaran `:page` (`src/router/index.js`).
- `performance` ↔ código: imports estáticos en `src/router/index.js`; `sw.js` dormido con estrategia de caché inválida; `//registerServiceWorker()` comentado en `src/App.vue`.
- `accessibility` ↔ código: `<html lang="en">` (`index.html`); 0 `aria-*` en `src/**/*.vue`; botones solo-icono en `pagination`, `search`, `popups`, `help.popup`, `result_options`, `section_popup_slot`; `:focus` solo en `objects/_forms.sass`.
- `code-quality` ↔ código: sin ESLint; 10 `console.log`; `helpers/site.config.vue` sin importar; computed sin usar en `home.vue`; `sass-loader` sin uso.
- `authentication` (delta de `retirar-spec-md`) ↔ código: `store.set_alert` inexistente en `src/components/partials/verification.vue`.

## Risks / Trade-offs

- [Specs aspiracionales: los escenarios no se cumplen hoy] → Aceptado por el alcance "solo specs"; las brechas quedan listadas para que cada implementación sea un change con sus propias tareas de contraste.
- [Tres changes en vuelo editan `AGENTS.md`] → El apply que se ejecute segundo o tercero rebasa; no afecta specs.
- [Solapamiento percibido entre `accessibility` y `design-system`] → Fronteras separadas (semántica vs identidad visual); ningún requisito de este cambio toca tokens o paleta.
- [Specs sin suite de tests] → Verificación por lectura de escenarios y comandos (`rg`, `pnpm build` en futuros cambios de implementación) + `openspec validate --all`.

## Migration Plan

1. Archivar `retirar-spec-md` primero (crea `performance`, `app-store` y las demás) y enseguida este change, sincronizando `accessibility`, `code-quality` y los `ADDED` de `performance`/`routing` a `openspec/specs/`.
2. En el mismo apply: tabla de capabilities y `CHANGELOG.md`.
3. Cambios futuros de implementación, uno por eje o combinados, consumiendo la lista de brechas: rendimiento/caché → `performance`; rutas paginadas → `routing`; a11y → `accessibility`; lint/limpieza → `code-quality`; `set_alert` → ya cubierto por el delta de
   `authentication`.
4. Rollback: revertir el commit del apply; no hay cambios de código que resguardar.

## Open Questions

<!-- Ninguna: los cuatro ejes y el alcance "solo specs" quedaron decididos con el usuario en la fase de propuesta. -->
