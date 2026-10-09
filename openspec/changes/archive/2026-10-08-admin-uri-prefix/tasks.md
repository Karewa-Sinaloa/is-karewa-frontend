# Tasks

## 1. Árbol de rutas bajo `/admin`

- [x] 1.1 Prefijar con `/admin` las rutas del panel en `src/router/index.js` —los 18 `path` restantes, incluidos los dos redirects internos de sección, el padre `/acceso/` y sus cinco hijos— conservando cada `name` y `meta` sin cambios. Verificación:
      recorriendo el arreglo ningún `path` declarado empieza sin `/admin` y la lista de `name` y `meta` es idéntica a la actual.
- [x] 1.2 Mover `homeView` de `/` a `/admin` y declarar un redirect de `/` a `/admin`. Verificación: navegando a `/` la URL resultante es `/admin` y se muestra la pantalla de inicio (escenario "Redirección de la raíz") y ninguna vista del panel queda declarada
      en `/`.
- [x] 1.3 Agregar al final del arreglo la ruta comodín que redirige cualquier path no reconocido a `/admin`. Verificación: `/contratos` y `/admin/ruta-inexistente` terminan en `/admin` sin pantalla en blanco (escenarios de "URIs no reconocidas") y ninguna ruta
      declarada queda interceptada.
- [x] 1.4 Registrar en `CHANGELOG.md`, bajo `[Unreleased]` → `Modificado`, que las URIs del panel pasan a `/admin`, que la raíz redirige al dashboard y que las formas antiguas dejan de resolver a su sección. Verificación: la entrada existe y cubre los tres
      puntos.

## 2. Enlaces de entorno por correo

- [x] 2.1 Actualizar `VITE_PASS_RESET_URL` y `VITE_USER_VERIFICATION_URL` en `.env.example` a las formas `/admin/acceso/cambiar-contrasena` y `/admin/acceso/verificacion-de-usuario`. Verificación: `grep -n "admin/acceso" .env.example` devuelve las dos líneas y
      ninguna conserva la forma sin prefijo.
- [x] 2.2 Dejar constancia en `.env.example` de que las dos URLs construyen los enlaces de recuperación y verificación que envía el servidor y que el `.env` real de cada despliegue debe acompañarlas, por no estar versionado. Verificación: la nota aparece junto
      a las dos variables.
- [x] 2.3 Actualizar las mismas dos variables en el `.env` local. Verificación: el `.env` local apunta a `/admin/acceso/cambiar-contrasena` y `/admin/acceso/verificacion-de-usuario`.
- [x] 2.4 Registrar en `CHANGELOG.md`, bajo `[Unreleased]` → `Modificado`, la actualización de las dos URLs de entorno. Verificación: la entrada menciona las dos variables y que alimentan los enlaces por correo.

## 3. Verificación integral

- [x] 3.1 Ejecutar `pnpm build` y confirmar que termina sin errores. Verificación: salida del build en 0.
- [x] 3.2 Ejecutar `openspec validate --all` y confirmar que los specs y el change pasan. Verificación: totals con 0 fallas.
- [x] 3.3 Ejecutar `npx prettier --check` sobre `src/router/index.js`, `.env.example` y `CHANGELOG.md`. Verificación: "All matched files use Prettier code style!".
- [x] 3.4 Contrastar cada scenario de `openspec/specs/routing/spec.md` contra el código tras el cambio —prefijo, landing de acceso, raíz, comodín y navegación por nombre en sidebar, guard y paginación—. Verificación: todos los requisitos de `routing` quedan
      respaldados por `src/router/index.js` y ninguna llamada de navegación resuelve por path.
