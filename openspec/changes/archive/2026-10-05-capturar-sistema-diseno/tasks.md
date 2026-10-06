# Tasks

## 1. Auditoría base de adhesión

- [x] 1.1 Ejecutar `grep -rnE '#[0-9a-fA-F]*[a-fA-F][0-9a-fA-F]*\b|rgba?\(' src --include='*.vue' --include='*.js'` y verificar que no hay resultados (los actuales `&#10094;` de paginación no cuentan: la expresión exige al menos una letra hex)
- [x] 1.2 Ejecutar `grep -rnE '(^|[^-a-z])(color|background(-color)?):[[:space:]]*[^;]*(#[0-9a-fA-F]*[a-fA-F][0-9a-fA-F]*|rgba?\()' src/assets/sass --include='*.sass' | grep -v settings/` y verificar que el único resultado es `color: #0B0306` en
      `components/_access.sass` (base esperada antes de corregir)
- [x] 1.3 Ejecutar `grep -rn -- '--color2' src` y verificar que el único resultado es `components/_access.sass:32`, confirmando el uso de una variable CSS inexistente

## 2. Correcciones de tokens

- [x] 2.1 Reemplazar `var(--color2)` por `var(--color-primary)` en `src/assets/sass/components/_access.sass` y verificar con `grep -rn -- '--color2' src` que no hay resultados; además comprobar en `/acceso/inicio-de-sesion` que el enlace "¡Olvide mi
      contraseña!" tiene color computado `rgb(84, 132, 116)` (primary `#548474`)
- [x] 2.2 Agregar el alias `--access-panel-bg: #0B0306` en la capa de configuración (`base/_base.sass`, junto a los demás alias) y usar `var(--access-panel-bg)` en `components/_access.sass`; verificar con el grep del task 1.2 que ahora no hay resultados, y con
      `grep -rn -- '--access-panel-bg' src` que el token está declarado y usado

## 3. Documentación canónica

- [x] 3.1 Agregar en `AGENTS.md`, dentro de la sección de convenciones o notas de desarrollo, la referencia a la capability `design-system` (spec canónico en `openspec/specs/design-system/spec.md` una vez archivado el cambio) como fuente de la línea visual;
      verificar con `grep -n "design-system" AGENTS.md` con al menos un resultado

## 4. Verificación integral

- [x] 4.1 Volver a correr los greps de los tasks 1.1 y 1.2 y verificar que ambos quedan sin resultados (adhesión completa tras las correcciones)
- [x] 4.2 Ejecutar `pnpm build` y verificar código 0 con `dist/index.html` presente, confirmando que los cambios de SASS compilan
- [x] 4.3 Revisar visualmente `/acceso/` (login, recuperación, registro) y verificar que el panel de acceso conserva su fondo y los enlaces ahora muestran el color primario
