# Design

## Context

Ver proposal.md - Why. El estado real del sistema, tras auditar el código:

- **Tokens**: `src/assets/sass/settings/_variables.sass` define la paleta base (primary `#548474`, secondary `#02351E`, success, warning, danger, info), 3 familias (`Lato`, `Poppins`, `Oswald`), escala `--fs-*` (smaller→xxxl) y 8 breakpoints; `base/_base.sass`
  los vuelca a `:root` y con los mixins `grayscale-pallete` (14 tonos, `hsl(214 37% L)`) y `pallete-creator` (11 tonos por matiz, 50→950) genera las rampas derivadas, más alias semánticos (`--text-color-*`, `--sidebar-bg`, `--light-border-color`, sombras).
- **Tipografía por rol**: h1–h6 → Oswald 600; label/button/legend → Lato 500; p/li/span/code → Poppins 400; iconos Material Symbols Outlined con variante fija.
- **Componentes**: nomenclatura BEM (`.btn--default`, `.pagination__element--prev`), objetos `_buttons.sass`/`_forms.sass`, estilos por componente en `sass/components/`.
- **Auditoría de adhesión**: cero literales hex/rgb en `src/**/*.vue` y `src/**/*.js`. En estilos SASS de componentes aparecen 4 literales + 1 bug: `#0B0306` (fondo decorativo del panel de acceso), 3 `rgba()` de sombra, 1 degradado `hsl()` decorativo, y
  `var(--color2)` en `_access.sass` — **variable que no existe en ningún lado**, así que los enlaces "¡Olvide mi contraseña!" / "Iniciar sesión" de `/acceso/*` hoy heredan color por accidente.
- **Documentación**: `SPEC.md` §3 es una plantilla genérica con información errónea ("system fonts"); `openspec/specs/` está vacío.

## Goals / Non-Goals

**Goals:**

- Una capability `design-system` que funcione como contrato canónico de la línea visual.
- Dejar la capacidad registrada en la documentación para agentes: `AGENTS.md` referencia el spec como fuente de la línea visual.
- Cerrar los dos hallazgos de la auditoría (`--color2` indefinido, `#0B0306` fuera de la capa de tokens) para que el spec sea verdadero desde su archive.
- Verificación repetible por grep que cualquier adecuación futura pueda correr.

**Non-Goals:**

- Modificar `SPEC.md` (incluida su §3): queda fuera de alcance por decisión de roadmap y se retocará en un trabajo posterior; hoy la fuente canónica es el spec de OpenSpec.
- Rediseñar o cambiar la paleta, tipografía o iconografía existentes.
- Tokenizar sombras `rgba()` ni el degradado del panel de acceso (elementos decorativos; tocarlos altera el aspecto sin beneficio de especificación).
- Crear la spec del área de acceso público: esa superficie aún no está definida; entra cuando se diseñe, reutilizando esta capability.
- Agregar infraestructura de tests (el proyecto no tiene suite; la auditoría es estática).

## Decisions

**1. Una sola capability plana `design-system`.** El proyecto usa layout plano de specs y existe una única identidad visual para toda la app (hoy CMS, mañana superficie pública). Alternativa descartada: capabilities por concern (`color-tokens`, `typography`,
`iconography`) — fragmentaría un contrato que se audita y evoluciona junto.

**2. El spec describe contrato observable, no archivos SASS.** Los requirements hablan de "capa de configuración", "variables CSS", "familia por rol", "bloque__elemento--modificador": sobreviven a refactors de estructura. Los nombres de archivo solo viven en
design.md y tasks.md.

**3. `SPEC.md` queda intacto; `AGENTS.md` es quien referencia el spec.** Decisión de roadmap: se trabajará `SPEC.md` aparte, así que este cambio no lo toca (su §3 seguirá diciendo "system fonts" hasta ese trabajo). La referencia para humanos y agentes vive en
`AGENTS.md`, que apunta al spec de OpenSpec como fuente de la línea visual. Alternativa descartada por ahora: reescribir §3 como índice — duplicaría el esfuerzo del trabajo futuro sobre `SPEC.md`.

**4. Verificación por grep, no por suite de tests.** No existe test suite; una auditoría estática (`grep -rE '#[0-9a-f]{3,6}|rgb\('` sobre `src/**/*.vue|js` y estilos de componentes) es la verificación más barata y repetible. Se documenta como comando exacto
en tasks.

**5. Excepciones decorativas documentadas, no tokenizadas.** El degradado del panel de acceso (7 paradas `hsl()`) y las 3 sombras `rgba(0,0,0,*)` son arte/overlay, no paleta. Tokenizarlos exige decisiones visuales ajenas al objetivo. El spec las reconoce
explícitamente ("elementos puramente decorativos... excepciones registradas en el diseño del cambio") para que el escenario sea verificable sin mentir.

**6. `var(--color2)` se corrige a `var(--color-primary)`.** Es la evidencia concreta del problema: una variable inexistente deja enlaces de autenticación sin color propio. Se elige `--color-primary` porque son acciones sobre fondo claro y la semántica de
enlace del sistema es el color de marca. Alternativa: `--text-color-primary-dark` si la revisión visual prefiere cero cambio respecto al aspecto actual (heredado). Verificación: abrir `/acceso/inicio-de-sesion` y comprobar el color computado del enlace.

**7. `#0B0306` se tokeniza como `--access-panel-bg` en la capa de configuración.** Es un `background-color` literal en un componente, por lo que violaría el escenario de auditoría. Mover el valor a un alias en settings lo cumple sin ningún cambio visual.
Alternativa descartada: excluirlo como decorativo — su rol es de fondo, no de arte.

## Risks / Trade-offs

- [`SPEC.md` §3 sigue desactualizado y contradice al spec] → aceptado y acotado: `SPEC.md` está fuera de alcance de este change; `AGENTS.md` apunta al spec como fuente de la línea visual, y la corrección de §3 queda pendiente en el trabajo posterior sobre
  `SPEC.md`.
- [La auditoría por grep tiene falsos negativos (colores vía SASS o clases utility)] → los estilos pasan por `var(--...)`; se excluye `settings/` por ser la fuente de verdad y se documenta el comando exacto.
- [Cambiar el color de los enlaces de `/acceso/*` altera la vista pública de login] → es la corrección de una variable inexistente; se revisa visualmente antes de commitear y se documenta la alternativa en Decision 6.
- [Futuras adecuaciones violen tokens sin que nadie corra la auditoría] → el escenario del spec es el comando de verificación; queda en tasks como chequeo final de cada grupo.

## Migration Plan

Sin despliegue: el cambio es spec + documentación + 2 micro-correcciones de estilo. El archive posterior copia el delta a `openspec/specs/design-system/spec.md`. Rollback: revert de los commits; no hay datos ni dependencias.

## Open Questions

- ¿El área de acceso público será parte de este repo (misma app, rutas públicas) o un frontend separado? No bloquea este change: la capability ya obliga a reutilizar el sistema en cualquier caso; sí condicionará dónde vive su spec cuando se diseñe.
