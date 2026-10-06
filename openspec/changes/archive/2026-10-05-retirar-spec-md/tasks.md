# Tasks

## 1. Contraste de los deltas con el código

- [x] 1.1 Verificar los escenarios de `providers` y `administrative-units` contra `src/components/views/proveedores/{list,view}.vue` y `src/components/views/admin_units/{list,view}.vue` (campos name/rfc/comments, popup de confirmación, navegación a la ficha
      tras el alta, módulos `proveedores`/`unidades-administrativas`) y corregir los deltas si algo no coincide; verificar con
      `rg -n "yup\.(string|object)|confirmation-popup|inserted_id|module:" src/components/views/proveedores/view.vue src/components/views/admin_units/view.vue` que cada escenario tiene respaldo
- [x] 1.2 Verificar los escenarios de `contracts` contra `src/components/views/contracts/contract_list.vue` y `src/components/views/contracts/contract_view.vue` (ruta paginada, `sort=-contract_date`, columnas de la tabla, catálogos cargados, popup de
      confirmación y borrado local tras aceptar) y corregir el delta si algo no coincide; verificar con
      `rg -n "sort=-contract_date|inserted_id|module: 'procedimientos'|filter\(contract" src/components/views/contracts/contract_list.vue src/components/views/contracts/contract_view.vue`
- [x] 1.3 Verificar los escenarios de `organization` y `home` contra `src/components/views/organization.vue` y `src/components/views/home.vue` (redirect a inicio sin datos, bloqueo de edición, esquema yup de 8 campos, help del error de direcciones, widget
      "Bienvenidos") y corregir los deltas si algo no coincide; verificar con `rg -n "homeView|organizationEditBlocked|min\(1000\)|direcciones asociadas|Bienvenidos" src/components/views/organization.vue src/components/views/home.vue`
- [x] 1.4 Verificar los escenarios de `performance` y `app-store` contra `src/components/views/contracts/contract_list.vue`, `src/components/partials/{pagination,search,notifications,add_new_element,popups,help.popup}.vue` y `src/store/index.js`
      (`page`/`limit`, control solo con más de una página, umbral de 3 caracteres, descarte a los 5 s, `new_elements`, tipos de popup `route`/`close`, ayuda) y corregir los deltas si algo no coincide; verificar con
      `rg -n "pages > 1|sString.length > 2|time \+ 5000|store.popup.type|push_help|new_elements\(\[\]\)" src/components/partials/*.vue`
- [x] 1.5 Verificar los escenarios nuevos de `authentication` contra `src/components/partials/{recovery,reset,registration,verification}.vue` (módulos `access/recovery`, `access/reset`, `users`, `access/user-validation`, captcha en recuperación y registro, min
      8 en reset, popup "Cuenta verificada", redirect a login sin parámetros) y corregir el delta si algo no coincide; verificar con
      `rg -n "module:|hcaptcha|min\(8\)|Cuenta verificada|accessViewLogin" src/components/partials/recovery.vue src/components/partials/reset.vue src/components/partials/registration.vue src/components/partials/verification.vue`
- [x] 1.6 Ejecutar `openspec validate "retirar-spec-md"` y verificar que informa válido sin errores

## 2. Retiro de SPEC.md y actualización de punteros

- [x] 2.1 Actualizar `AGENTS.md`: la línea de convención de componentes (§8) y la del store (§6) dejan de citar `SPEC.md` (el store apunta a la capability `app-store`), y el mapa de documentación (§51) sustituye la entrada de `SPEC.md` por `openspec/specs/`;
      verificar con `rg -n "SPEC\.md" AGENTS.md` sin resultados y con `rg -c "openspec/specs" AGENTS.md` ≥ 1
- [x] 2.2 Actualizar el bloque `context:` de `openspec/config.yaml`: la línea de documentación ya no nombra `SPEC.md` y declara `openspec/specs/` como fuente canónica de comportamiento; verificar con
      `python3 -c "import yaml; c=yaml.safe_load(open('openspec/config.yaml')); assert 'SPEC.md' not in c['context']"` y que el YAML sigue siendo válido
- [x] 2.3 Eliminar el archivo `SPEC.md`; verificar con `test ! -f SPEC.md` con código 0
- [x] 2.4 Registrar el retiro en `CHANGELOG.md` bajo `[Unreleased]` (sección de documentación) con una entrada que apunte a `openspec/specs/`; verificar con `rg -n "SPEC\.md" CHANGELOG.md` que la entrada existe y menciona el destino

## 3. Verificación integral

- [x] 3.1 Ejecutar `openspec validate --all` y verificar que todos los changes y specs pasan sin errores
- [x] 3.2 Ejecutar `openspec status --change "retirar-spec-md"` y verificar 4/4 artifacts completos
- [x] 3.3 Verificar que ningún documento vivo espera a `SPEC.md`: `rg -ln "SPEC\.md" --hidden -g '!node_modules' -g '!.git' .` debe devolver únicamente archivos bajo `openspec/changes/` (archivados e histórico de este cambio)
- [x] 3.4 Verificar que el cambio no tocó código de la aplicación: `git status --porcelain src` sin resultados
