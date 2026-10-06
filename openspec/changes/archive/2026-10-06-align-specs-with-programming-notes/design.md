# Design

## Context

Comparación hecha entre las tres notas del área `Programación` del vault (`Programación.md`, `Regla de estilos: variables centralizadas.md`, `Regla de estilos: BEM, ITCSS y procesamiento SASS.md`) y los 18 specs de `openspec/specs/`, leyendo íntegros
`design-system`, `ui-construction`, `code-quality`, `accessibility`, `form-validation`, `api-client`, `error-handling` y `performance`, que son los que podían recibir los criterios de las notas.

Resultado del contraste, verificado contra el código y la configuración del repositorio:

- **Cubierto ya (sin cambio)**: reutilización de parciales antes de crear equivalentes y modificación sin duplicar archivo (`ui-construction`), tokens de color/tipografía/tamaño y alta de token antes de usarlo (`design-system`), BEM (`design-system`) e ITCSS
  por capas con `settings/` como única fuente (`ui-construction`), captcha y validación en cliente (`form-validation`), estados de carga/éxito/error (`api-client` + `error-handling` + `form-validation`), variables de entorno no versionadas (`code-quality`),
  teclado/foco/idioma/alt (`accessibility`).
- **Falta (aquí se agrega)**: bundler y `pnpm` como contrato de build, separación `src/` ↔ `dist/`, minificación solo en producción, edición fuera del contenedor (ninguna capability habla de herramientas: `grep` de `pnpm|vite|dist|minific|docker` en
  `openspec/specs/` no devuelve nada relevante); semántica HTML (`accessibility` solo cubre idioma, nombres accesibles, diálogos, teclado y alt); regresiones en superficies compartidas; vínculos/recursos externos; pesos tipográficos como token (el requisito de
  tokens lista colores, familias, tamaños, breakpoints y alias, y hay 8 declaraciones `font-weight` literales fuera de `settings/`).
- **Repetido (se decide quién manda)**: "no duplicar al modificar" aparece en la nota y en `ui-construction`; "revisión obligatoria antes de cerrar una tarea de estilos" aparece en las dos reglas de estilo y no es un comportamiento del sistema; "secretos sin
  versionar" ya lo exige `code-quality`.

Ver `proposal.md` — Why para la motivación y el alcance "solo specs".

## Goals / Non-Goals

**Goals:**

- Que todo criterio de las notas que sea comportamiento verificable del frontend quede en un spec, con la ruta, la herramienta y los nombres propios de este proyecto (Vite, `pnpm`, `src/assets/sass/`, parciales Vue).
- Dejar una sola responsabilidad por criterio: los duplicados entre notas y specs se resuelven indicando cuál es el texto que manda, sin repetir el mismo requisito en dos capabilities.
- Documentar las brechas spec↔código detectadas para cambios posteriores de implementación.

**Non-Goals:**

- Modificar las notas de Obsidian: este change escribe specs; el vault queda como origen del criterio, no como fuente canónica.
- Criterios de otras notas o de otros repositorios: backend PHP/MVC/Composer, SMTP, `app/config.yml`, YAML como fuente de datos.
- SEO técnico (sitemap, robots, datos estructurados) y analítica/etiquetas de marketing: la aplicación es un panel autenticado sin páginas públicas indexables ni decisión de producto de medición.
- El proceso de trabajo y el checklist del vault, que son prácticas del área y no comportamiento del sistema; se quedan en Obsidian.
- Corregir en código las brechas detectadas (queda para cambios de implementación).

## Decisions

1. **Capability nueva `tooling` en lugar de repartir los criterios de build.** Agrupa lo que las notas llaman "Procesamiento y artefactos" + "Tooling y entornos": una frontera cohesiva sobre _cómo se construye y se desarrolla_ el proyecto. Alternativas
   descartadas: ampliar `code-quality` (su propósito es calidad del repositorio: lint, logs, dependencias sin uso, no el flujo de build) y ampliar `ui-construction` (sus requisitos son de estructura de componentes, no de empaquetado).
2. **`design-system` modificado con `MODIFIED`, no con un requisito nuevo.** Los pesos son parte del mismo contrato de "fuente única de tokens"; añadirlos al enunciado existente y reglar un escenario nuevo evita dos requirements que hablan del mismo origen de
   verdad. El bloque completo se copia íntegro, como exige el flujo `MODIFIED`.
3. **Semántica HTML dentro de `accessibility`.** Es una propiedad de percepción y estructura para tecnologías de apoyo, igual que el idioma o los nombres accesibles que ese spec ya rige; meterla en `ui-construction` la mezclaría con la ubicación de
   componentes.
4. **Regresiones en compartidos dentro de `code-quality`, sin repetir la regla de "no duplicar archivo".** Esa regla ya vive en el escenario de modificación de `ui-construction` (aquí reforzado); duplicarla en otro spec crearía dos textos que hay que mantener
   sincronizados. `code-quality` queda con lo único que le pertenece: que la corrección no rompa a los consumidores.
5. **Vínculos y recursos externos en `ui-construction`, no en una capability `security` nueva.** Con un solo requisito de política de apertura y orígenes, una capability `security` sería demasiado fina y duplicaría lo que `code-quality` ya cubre sobre
   secretos. Como la app hoy no tiene ningún `target="_blank"`, el requisito es preventivo; el caso observable real son los orígenes externos que sí carga (las dos cargas de Google Fonts: la hoja de Material Symbols en `index.html` y el `@import` de familias
   en `src/assets/sass/base/_base.sass`).
6. **Traducción de las notas al vocabulario del proyecto.** Donde la nota dice Webpack se especifica el bundler declarado (Vite); donde dice `src/sass/settings/_variables.sass` se respeta la ruta documentada por el proyecto (`src/assets/sass/`, ya anclada en
   `ui-construction`); donde dice Smarty se refiere a los parciales Vue. La propia nota permite esta adaptación ("salvo que el proyecto documente otra ubicación", "el framework definido por el proyecto").
7. **`ADDED` donde solo se agrega comportamiento y `MODIFIED` solo donde cambia un requisito existente.** Así los deltas son triviales de archivar y no pierden texto previo.

## Brechas spec↔código (entrada a cambios futuros)

- `tooling` ↔ código: el stack docker despliega el servidor de desarrollo (`docker/frontend/Dockerfile` ejecuta `pnpm exec vite` y `docker/nginx/default.conf` lo hace de upstream), así que hoy no existe un despliegue que sirva `dist/`; `dist/` está ignorado
  por git ✓ y `src/` no contiene artefactos ✓.
- `design-system` ↔ código: 8 declaraciones `font-weight` literales fuera de `settings/` (`base/_base.sass` ×4, `components/_results.sass`, `components/_sidebar.sass`, `components/_widgets.sass`, `objects/_forms.sass`) y sin token de peso en `_variables.sass`.
- Brechas ya anotadas por cambios anteriores que siguen abiertas: `.env` versionado (`mejoras-seguridad`), `lang="en"` y ausencia de `aria-*` (`mejoras-frontend`), `sass-loader` sin uso (`mejoras-frontend`).
- `ui-construction` ↔ código: ningún `target="_blank"` en `src/` (el requisito de enlaces es preventivo); las dos cargas de Google Fonts (`index.html` y `src/assets/sass/base/_base.sass`) son hoy los únicos orígenes externos y no están declarados en ningún
  documento.

## Risks / Trade-offs

- [Specs aspiracionales: hoy no se cumple todo lo nuevo] → Aceptado por el alcance "solo specs"; las brechas quedan arriba para que cada implementación sea su propio change con contraste de escenarios.
- [El requisito de publicar `dist/` choca con el stack docker actual] → El requisito describe el estado deseado de producción; el entorno docker se declara de desarrollo. Si el usuario confirma que ese stack _es_ la producción, el cambio de despliegue se
  plantea aparte (ver Open Questions).
- [Cinco deltas tocan cuatro capabilities con cambios de distinto tipo] → `MODIFIED` se limita a dos requisitos y se copian íntegros; `validate` del change pasa hoy, y el archivar los concatena sin conflicto (no hay otro change en vuelo).
- [Specs sin suite de tests] → Verificación por lectura de escenarios contra el código (`rg font-weight`, `rg pnpm`, inventario git) y `openspec validate --all`.

## Open Questions

- ¿Dónde se publica la versión de producción y qué sirve `dist/`? El repositorio solo documenta el stack de desarrollo; la respuesta no cambia el requisito de `tooling` (que exige que producción sirva el build), pero sí el diseño del change de implementación.
- ¿Debe `Programación.md` del vault apuntar a `openspec/specs/` como fuente canónica para que el criterio no se duplique en dos lugares? Es una decisión del vault, no del repositorio, y no afecta este change.
