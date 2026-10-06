# Tasks

## 1. Contraste de los deltas contra el código

- [ ] 1.1 Verificar el delta de `ui-construction` (ubicación por rol y anatomía) contra la estructura real: `find src/components/views -name "*.vue" | wc -l` y `find src/components/partials -name "*.vue" | wc -l` con ambos mayores que 0, y
      `rg -c "<script setup>" src/components/views src/components/partials` que confirma la anatomía; corregir el delta si algún escenario no tiene respaldo
- [ ] 1.2 Verificar el requisito de reutilización de parciales: `rg -ln "sidebar-component|content-header" src/components/views` con varias secciones que los componen y `rg -ln "confirmation-popup" src/components/views` para el uso del popup de confirmación;
      corregir el delta si algún parcial compartido listado no existe en `src/components/partials/`
- [ ] 1.3 Verificar el requisito de capas SASS: `ls src/assets/sass/settings src/assets/sass/objects src/assets/sass/components src/assets/sass/base` contiene las cuatro capas, `rg -n ":root" src/assets/sass/base/_base.sass` confirma la emisión de variables y
      `rg -n "@use \"../objects/" src/assets/sass/components` confirma el consumo de objetos con `@use`; corregir el delta si algo no coincide
- [ ] 1.4 Verificar el registro de secciones y nombres de ruta: `rg -n "router-link" src/components/partials/sidebar.vue` muestra enlaces por nombre de ruta agrupados por sección y `rg -o "name: '[a-zA-Z]+'" src/router/index.js | sort -u` confirma el patrón
      camelCase `<módulo><Acción>`; corregir el delta si algún escenario no tiene respaldo
- [ ] 1.5 Verificar el delta de `routing` contra `src/router/index.js`: `rg -n "path: '/[^']+/nuevo'|path: '/[^']+/:id'|meta" src/router/index.js` confirma los patrones `/nuevo`, `/:id` y `meta.login`; corregir el delta si algo no coincide
- [ ] 1.6 Ejecutar `openspec validate "patrones-construccion-ui"` y verificar que informa válido sin errores; si el contraste encontró componentes que violan los patrones capturados, anotarlos como hallazgo en la sección de Notas de este archivo sin tocar
      código

## 2. Documentación

- [ ] 2.1 Actualizar `AGENTS.md`: agregar `ui-construction` a la tabla de capabilities y hacer que la convención de componentes (`views/` vs `partials/`) apunte a esa capability; verificar con `rg -c "ui-construction" AGENTS.md` ≥ 2 (tabla + convención). Si el
      change `retirar-spec-md` ya fue aplicado, rebasar sobre su versión del archivo
- [ ] 2.2 Registrar el cambio en `CHANGELOG.md` bajo `[Unreleased]` (capability `ui-construction` y requisito nuevo de `routing`); verificar con `rg -n "ui-construction|patrones" CHANGELOG.md`

## 3. Verificación integral

- [ ] 3.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [ ] 3.2 Ejecutar `openspec status --change "patrones-construccion-ui"` y verificar 4/4 artifacts completos
- [ ] 3.3 Verificar que el cambio no tocó código de la aplicación: `git status --porcelain src` sin resultados
- [ ] 3.4 Releer los dos deltas archivados en `openspec/specs/ui-construction/spec.md` y `openspec/specs/routing/spec.md` y confirmar que contienen los requirements agregados y que `routing` conserva intactos sus seis requirements previos
      (`rg -c "^### Requirement:" openspec/specs/routing/spec.md` con resultado 7)

## Notas

- Hallazgos del contraste (componentes que violan los patrones capturados, si los hay) se anotan aquí durante el apply, sin tocar código.
