# Tasks

## 1. Contraste de los deltas contra el código (brechas confirmadas)

- [x] 1.1 Verificar el delta de `form-validation`: `rg -l "<Form" src -g '*.vue' | wc -l` con 14 formularios, `rg -n "isSubmitting|submitting|disabled" src/components/partials/login.vue` sin resultados (no hay guarda de envío), y
      `rg -n "file\.size|\.size|maxSize" src/components/partials/drag_drop_file.vue` sin resultados (no hay validación de tamaño); corregir el delta si algún escenario no corresponde
- [x] 1.2 Verificar el delta de `authentication`: `rg -n "autocomplete" src/components/partials/login.vue src/components/partials/reset.vue` sin resultados, confirmando la brecha de autocompletado; corregir el delta si algo no coincide
- [x] 1.3 Verificar el delta de `app-store`: `rg -n "v-html" src/components/partials/help.popup.vue` confirma el renderizado de HTML y `rg -n "notification.help|\.help" src/store/index.js` confirma que el texto de ayuda del servidor entra al store; corregir el
      delta si algo no coincide
- [x] 1.4 Verificar el delta de `code-quality`: `git ls-files | grep -x ".env"` confirma que está rastreado, `git check-ignore .env` sin resultados confirma que no está ignorado, y `rg -n "cp .env.example .env" DEV_ENV_MANUAL.md README-docker.md` confirma el
      flujo de plantilla; corregir el delta si algo no coincide
- [x] 1.5 Ejecutar `openspec validate "mejoras-seguridad"` y verificar que informa válido sin errores

## 2. Documentación

- [x] 2.1 Registrar el change en `CHANGELOG.md` bajo `[Unreleased]` (requisitos agregados de seguridad en `form-validation`, `authentication`, `app-store` y `code-quality`); verificar con `rg -n "doble|autocomplete|entorno|ayuda" CHANGELOG.md` con al menos una
      mención de este change
- [x] 2.2 Confirmar que `design.md` lista las brechas de los cinco frentes; verificar con `rg -n "Brechas spec↔código" openspec/changes/mejoras-seguridad/design.md` y
      `rg -c "Form|v-html|drag_drop|autocomplete|gitignore" openspec/changes/mejoras-seguridad/design.md` ≥ 5

## 3. Verificación integral

- [x] 3.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [x] 3.2 Ejecutar `openspec status --change "mejoras-seguridad"` y verificar 4/4 artifacts completos
- [x] 3.3 Verificar que el change no tocó código de la aplicación: `git status --porcelain src` sin resultados
- [x] 3.4 Confirmar el orden de archivo: antes de archivar este change, `openspec show app-store --type spec` y `openspec show code-quality --type spec` deben resolver; verificar con `openspec list --specs` que ambas capabilities aparecen en el inventario (se
      archivan `retirar-spec-md` y `mejoras-frontend` antes que este)
