# Proposal

## Why

El frontend presenta mejoras de funcionamiento pendientes en los cuatro ejes definidos con el usuario —rendimiento y caché, bugs y limpieza, calidad/DX y accesibilidad—, pero hoy ningún spec las exige: el router importa las vistas estáticamente (bundle único
de ~588 KB), el service worker está comentado con una estrategia de caché rota, no hay ESLint, el documento declara `lang="en"` en una interfaz en español, no existe un solo atributo `aria-*` y hay código/dependencias sin uso. Especificar el estado deseado
permite que cada mejora se implemente después como un cambio con contrato verificable, en lugar de quedar como lista informal.

## What Changes

- **Alcance: solo specs** (decisión explícita del usuario). Este change no modifica código: captura el estado deseado y deja las brechas spec↔código documentadas para cambios posteriores de implementación.
- Capability nueva `accessibility`: estado deseado de accesibilidad — idioma del documento, nombres accesibles en botones solo-icono, diálogos (popups, confirmación, ayuda) anunciados a lectores de pantalla, foco visible y navegable por teclado, texto
  alternativo en imágenes.
- Capability nueva `code-quality`: contrato de calidad del repositorio — lint configurado y ejecutable junto a Prettier, sin `console.log` de depuración en el build de producción, y ausencia de dependencias y archivos de código sin uso.
- `routing` recibe el requisito de que todo listado paginado exponga la página en su ruta (patrón `/modulo/p/:page` o equivalente), lo que hoy solo cumple contratos.
- `performance` recibe dos requisitos: carga por ruta con code-splitting (la primera carga descarga solo el código de la ruta inicial) y artefactos actualizados tras un despliegue (la caché, exista o no service worker, no sirve versiones anteriores).
- Brechas conocidas que este change documenta en `design.md` para futuros cambios de implementación: vistas estáticas en el router, paginación de proveedores/unidades sin `:page`, `store.set_alert` inexistente en `verification.vue` (su comportamiento deseado
  ya está capturado en el delta de `authentication` del change `retirar-spec-md`), `console.log` de depuración, `lang="en"`, ausencia total de ARIA, `helpers/site.config.vue` sin uso, `sass-loader` sin uso y `sw.js` dormido.

## Capabilities

### New Capabilities

- `accessibility`: condiciones de accesibilidad de la interfaz: idioma del documento, nombres accesibles, semántica de diálogos, teclado y foco, texto alternativo.
- `code-quality`: condiciones de calidad verificables del repositorio: lint ejecutable, ausencia de logs de depuración en producción, ausencia de dependencias y archivos sin uso.

### Modified Capabilities

- `performance`: se agregan la carga por ruta (code-splitting) y la invalidación de artefactos tras despliegue; los requisitos existentes de paginación y búsqueda se conservan.
- `routing`: se agrega el requisito de exponer la página en la ruta de todo listado paginado; los requisitos existentes se conservan intactos.

## Impact

- **Specs**: 2 deltas nuevos + 2 deltas modificados (`ADDED`), sincronizados a `openspec/specs/` al archivar. `performance` requiere que el change `retirar-spec-md` esté archivado antes que este, porque crea esa capability.
- **Documentación**: `AGENTS.md` (tabla de capabilities: `accessibility` y `code-quality`), `CHANGELOG.md`.
- **Código**: sin cambios en este change; las brechas spec↔código quedan listadas en `design.md` como entrada a cambios futuros de implementación.
- **Sistemas afectados**: los cambios futuros de rendimiento, a11y y calidad se evaluarán contra estas capabilities; `patrones-construccion-ui` y `retirar-spec-md` también editan `AGENTS.md` (rebase en el apply que se ejecute segundo).
