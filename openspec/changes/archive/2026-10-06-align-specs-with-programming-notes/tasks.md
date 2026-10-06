# Tasks

## 1. Contraste de los deltas contra el código (brechas confirmadas)

- [x] 1.1 Verificar el delta de `tooling`: `rg -n '"packageManager"|"scripts"' package.json` confirma `pnpm` y los scripts `dev`/`build`/`preview`, `git check-ignore dist` devuelve `dist`, `rg --files src | rg "\.(css|min\.js|js\.map)$"` sin resultados
      confirma que `src/` no tiene artefactos compilados, y `rg -n "\.:/app" docker-compose.yml` confirma que el código se edita desde el directorio de trabajo; corregir el delta si algún escenario no corresponde
- [x] 1.2 Verificar el delta de `design-system`: `rg -n "font-weight" src | wc -l` y `rg -n "font-weight" src/assets/sass/settings/_variables.sass` sin resultados confirman que los pesos siguen literales fuera de la capa de tokens; corregir el escenario si la
      ubicación real difiere
- [x] 1.3 Verificar el delta de `accessibility`: `rg -n "<nav|<main|aria-" src -g '*.vue'` confirma que `<main>` ya se usa en las vistas y que `<nav>` y los `aria-*` no existen aún, que es el estado frente al requisito nuevo; corregir el delta si algún
      escenario no corresponde a la estructura real de la app
- [x] 1.4 Verificar el delta de `ui-construction`: `rg -n 'target="_blank"|noopener' src index.html` sin resultados confirma que el requisito de enlaces es preventivo, y `rg -n "https://" index.html src` identifica los orígenes externos que la app carga hoy
      (las dos cargas de Google Fonts: `index.html` y el `@import` de `src/assets/sass/base/_base.sass`); corregir el delta si hay otro origen
- [x] 1.5 Verificar el delta de `code-quality`: `rg -l "content_header|sidebar|pagination" src/components/views | wc -l` con 2 o más vistas confirma que los parciales compartidos son realmente compartidos y que el requisito de no regresión aplica
- [x] 1.6 Ejecutar `openspec validate "align-specs-with-programming-notes"` y verificar que informa válido sin errores

## 2. Documentación

- [x] 2.1 Registrar el change en `CHANGELOG.md` bajo `[Unreleased]` (capability nueva `tooling` y requisitos agregados en `design-system`, `accessibility`, `code-quality` y `ui-construction`); verificar con
      `rg -n "tooling|semántica|regresiones|vínculos" CHANGELOG.md` con al menos una mención de este change
- [x] 2.2 Actualizar la tabla de capabilities de `AGENTS.md` con `tooling` y su convención de procesamiento; verificar con `rg -n "tooling" AGENTS.md`
- [x] 2.3 Confirmar que `design.md` lista las brechas detectadas; verificar con `rg -n "Brechas spec↔código" openspec/changes/align-specs-with-programming-notes/design.md` y
      `rg -c "font-weight|dist/|noopener|\.env" openspec/changes/align-specs-with-programming-notes/design.md` ≥ 3

## 3. Verificación integral

- [x] 3.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [x] 3.2 Ejecutar `openspec status --change "align-specs-with-programming-notes"` y verificar 4/4 artifacts completos
- [x] 3.3 Verificar que el change no tocó código de la aplicación: `git status --porcelain src` sin resultados
- [x] 3.4 Confirmar el orden de archivo: `openspec list --specs` no muestra `tooling` (se crea al archivar) y no hay otro change en vuelo que edite las mismas capabilities (`openspec list` con un único change activo)
