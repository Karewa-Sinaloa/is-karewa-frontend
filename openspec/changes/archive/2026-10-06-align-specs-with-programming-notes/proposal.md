# Proposal

## Why

La nota de área `Programación` del vault de Obsidian —junto con sus dos reglas de estilo— documenta criterios que este repositorio asume como obligatorios, pero al compararlas con `openspec/specs/` aparecen criterios que ningún spec exige (el bundler y el
administrador de paquetes, la separación entre fuentes de desarrollo y artefactos de producción, la semántica HTML, la política de vínculos y recursos externos, la verificación de regresiones en superficies compartidas, los pesos tipográficos como token) y
otros que están repetidos con un enunciado menos preciso que el spec. Dejarlos fuera hace que la fuente canónica de comportamiento no cubra el criterio documentado, y dejarlos duplicados sin contrastar impide saber cuál de los dos textos es el que manda.

## What Changes

- **Alcance: solo specs.** Este change no modifica código: compara las tres notas del área con los specs, agrega lo que falta y refina lo que está repetido. Las brechas spec↔código detectadas durante la comparación quedan anotadas en `design.md` para cambios
  posteriores de implementación.
- Capability nueva `tooling`: cómo se construye y se desarrolla el proyecto — procesamiento con el bundler declarado (Vite), `pnpm` como administrador único, separación entre `src/` (solo desarrollo) y los artefactos de producción en `dist/`, minificación
  únicamente en el build de producción y entorno de desarrollo reproducible cuyos archivos y variables se editan desde el directorio de trabajo, sin entrar al contenedor.
- `design-system` recibe los **pesos tipográficos** como parte de la fuente única de tokens: hoy el requisito lista colores, familias, tamaños, breakpoints y alias, mientras las notas exigen también los pesos y el código declara `font-weight` literales fuera
  de la capa de configuración.
- `accessibility` recibe el requisito de **semántica HTML**: elementos nativos (`nav`, `main`, `section`, `form`, tablas, listas, jerarquía de encabezados) y ARIA solo cuando el elemento nativo no cubre la función; el spec actual cubre idioma, nombres
  accesibles, diálogos, teclado y texto alternativo, pero no la estructura semántica.
- `code-quality` recibe el requisito de **sin regresiones en superficies compartidas**: una corrección sobre un parcial, objeto o hoja compartida conserva el comportamiento de las rutas y componentes que lo consumen, y no introduce una segunda implementación
  de la misma pieza.
- `ui-construction` recibe dos cambios: el escenario de **modificación en sitio** se refuerza para exigir conservar el comportamiento correcto existente y cambiar solo lo necesario (no solo "no duplicar el archivo"), y un requisito nuevo de **vínculos y
  recursos externos** (`rel="noopener"` en enlaces que abren fuera de la aplicación; orígenes externos limitados a los declarados por el proyecto).
- Duplicados contrastados que **no** cambian, porque el spec ya cubre el criterio mejor redactado: reutilización de parciales antes de crear equivalentes, centralización de colores/tamaños y alta de tokens antes de usarlos, BEM e ITCSS por capas, captcha en
  formularios públicos, estados de carga/éxito/error, variables de entorno no versionadas.
- Fuera de alcance: el backend (PHP/MVC/Composer/SMTP/config YAML), el SEO técnico (sitemap, robots, datos estructurados) y la analítica, porque son criterios de otras notas o de sitios indexables y esta aplicación es un panel autenticado; el proceso de
  trabajo y el checklist del vault, que viven en Obsidian; y las referencias genéricas a Webpack y Smarty, porque este proyecto usa Vite y Vue.

## Capabilities

### New Capabilities

- `tooling`: herramientas y entornos con los que se construye y se desarrolla el frontend: bundler, administrador de paquetes, separación de fuentes y artefactos, compresión por ambiente y entorno de desarrollo reproducible y editable fuera del contenedor.

### Modified Capabilities

- `design-system`: los pesos tipográficos entran en la fuente única de tokens, con escenario de uso del token en lugar del valor literal.
- `accessibility`: se agrega el requisito de semántica HTML con ARIA mínimo; los requisitos existentes se conservan intactos.
- `code-quality`: se agrega el requisito de no introducir regresiones ni duplicados al corregir superficies compartidas; los requisitos existentes se conservan intactos.
- `ui-construction`: se refuerza el escenario de modificación de una sección existente (conservar el comportamiento correcto y cambiar solo lo necesario) y se agrega el requisito de vínculos y recursos externos.

## Impact

- **Specs**: 1 delta nuevo (`tooling`) + 4 deltas modificados (`design-system` `MODIFIED`, `accessibility`/`code-quality`/`ui-construction` con secciones `ADDED` y `MODIFIED`), sincronizados a `openspec/specs/` al archivar.
- **Documentación**: `AGENTS.md` (la tabla de capabilities debe incluir `tooling` y su convención de procesamiento), `CHANGELOG.md`.
- **Código**: sin cambios en este change. Las brechas detectadas quedan en `design.md`: `font-weight` literales fuera de `settings/`, `.env` versionado, `sass-loader` sin uso y `lang="en"` (estas cuatro ya anotadas por cambios anteriores).
- **Sistemas afectados**: todo pedido futuro de estilos, accesibilidad, corrección sobre código existente o de build/despliegue se evaluará contra estas capabilities en el flujo apply; las notas de Obsidian quedan referenciadas como criterio de origen, no como
  fuente canónica.
