# Tasks

## 1. Contraste de los deltas contra el código

- [ ] 1.1 Verificar el delta de `accessibility` contra el estado actual (todas son brechas esperadas): `rg -c "aria-" src -g '*.vue'` con resultado 0, `rg -n "lang=" index.html` que muestra el idioma actual, y `rg -n ":focus" src/assets/sass` limitado a
      `objects/_forms.sass`; corregir el delta si alguna condición descrita no corresponde a la realidad del código
- [ ] 1.2 Verificar el delta de `code-quality`: `rg -c "console\.log" src` con el conteo de logs actual, ausencia de configuración de ESLint (`ls .eslintrc* eslint.config.* 2>/dev/null` sin resultados), `rg -rln "site.config" src` sin referencias y
      `rg -rln "sass-loader" src vite.config.js` sin referencias; corregir el delta si algo no coincide
- [ ] 1.3 Verificar el delta de `performance`: `rg -n "^import .*views" src/router/index.js` confirma los imports estáticos, `rg -n "//registerServiceWorker" src/App.vue` confirma el service worker dormido y `ls dist/assets/*.js` con un solo bundle JavaScript;
      corregir el delta si algo no coincide
- [ ] 1.4 Verificar el delta de `routing`: `rg -n "path: '/proveedores|path: '/unidades-administrativas|path: '/contratos/p" src/router/index.js` confirma que solo contratos declara segmento de página; corregir el delta si algo no coincide
- [ ] 1.5 Ejecutar `openspec validate "mejoras-frontend"` y verificar que informa válido sin errores

## 2. Documentación

- [ ] 2.1 Actualizar `AGENTS.md`: agregar `accessibility` y `code-quality` a la tabla de capabilities; verificar con `rg -c "accessibility|code-quality" AGENTS.md` ≥ 2. Si los changes `retirar-spec-md` o `patrones-construccion-ui` ya fueron aplicados, rebasar
      sobre su versión del archivo
- [ ] 2.2 Registrar el cambio en `CHANGELOG.md` bajo `[Unreleased]` (capabilities nuevas y requisitos agregados a `performance`/`routing`); verificar con `rg -n "accessibility|code-quality" CHANGELOG.md`
- [ ] 2.3 Confirmar que `design.md` lista las brechas spec↔código de los cuatro ejes; verificar con `rg -n "Brechas spec↔código" openspec/changes/mejoras-frontend/design.md` y
      `rg -c "set_alert|lang=\"en\"|:page|console" openspec/changes/mejoras-frontend/design.md` ≥ 4

## 3. Verificación integral

- [ ] 3.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [ ] 3.2 Ejecutar `openspec status --change "mejoras-frontend"` y verificar 4/4 artifacts completos
- [ ] 3.3 Verificar que el cambio no tocó código de la aplicación: `git status --porcelain src` sin resultados
- [ ] 3.4 Confirmar el orden de archivo: antes de archivar este change, `openspec show performance --type spec` debe resolver (se archiva `retirar-spec-md` primero); verificar con `openspec list --specs` que `performance` aparece en el inventario antes de
      ejecutar el archive de este change
