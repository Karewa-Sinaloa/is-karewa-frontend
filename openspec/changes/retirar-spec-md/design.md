# Design

## Context

`openspec/specs/` ya contiene 7 capabilities capturadas en cambios archivados (`capturar-sistema-diseno`, `especificar-comportamiento-base`): `design-system`, `routing`, `authentication`, `api-client`, `error-handling`, `form-validation` y
`contracts-configuration`. `SPEC.md` quedó intacto por decisión de esos cambios y hoy duplica ese comportamiento (a veces con prosa obsoleta: `npm` en un proyecto `pnpm`) mientras describe como reales cosas que el código no hace.

Hallazgos de la inspección de código que condicionan este diseño (ver `proposal.md` → What Changes para la lista completa):

- `router/index.js` importa todas las vistas estáticamente: no hay lazy loading por ruta.
- El listado de contratos solo aplica `sort=-contract_date` en el servidor; no existe UI de filtros ni de ordenamiento por columnas.
- Proveedores y unidades administrativas solo tienen nombre, RFC/comentarios en su formulario; Home solo tiene un widget de bienvenida.
- Las rutas `/proveedores` y `/unidades-administrativas` no llevan `:page`, aunque sus listados sí piden `page`/`limit` al servidor y renderizan el control de paginación.
- `partials/search.vue` implementa búsqueda con umbral y sanitización, pero ninguna vista lo monta actualmente.

## Goals / Non-Goals

**Goals:**

- Retirar `SPEC.md` sin perder comportamiento verificable: cada afirmación queda en una capability o se descarta documentadamente.
- Mantener `openspec/specs/` como única fuente canónica de comportamiento, sin duplicar requisitos entre capabilities.
- Dejar los punteros de `AGENTS.md` y `openspec/config.yaml` resolviendo a rutas que existen.

**Non-Goals:**

- Corregir código: ni el lazy loading, ni la paginación sin `:page` de proveedores/unidades, ni el montaje del buscador.
- Reubicar secciones descriptivas en otros documentos (`package.json`, `.env.example`, `README-docker.md` y el `context` de `config.yaml` ya son su fuente).
- Modificar requirements existentes de las capabilities base (su delta en este cambio solo agrega requisitos nuevos a `authentication`).

## Decisions

1. **Captura fiel al código, no aspiracional.** Los specs describen lo que hoy es observable; las promesas de `SPEC.md` sin respaldo se descartan en lugar de escribirse como requirements. Alternativa descartada: convertirlas en requirements nuevos — obligaría
   a cambios de código en un cambio documental y a mezclar comportamiento actual con deseado en el mismo contrato.
2. **Fronteras de capability.** `contracts` cubre el listado y el formulario del contrato; `contracts-configuration` conserva los catálogos. `performance` concentra la mecánica transversal de paginación y búsqueda para no triplicarla en `providers`,
   `administrative-units` y `contracts`. `app-store` cubre solo el ciclo de vida observable del estado global (descarte de notificaciones, acción de alta, popup, ayuda); la traducción de códigos queda en `error-handling` y la carga global en `api-client`, para
   no duplicar esas fronteras. `home` se separa de `organization`: son pantallas sin lógica compartida (alternativa descartada: una capability `dashboards` catch-all, que violaría el criterio de frontera cohesiva).
3. **Delta de `authentication` como ADDED.** Los requisitos existentes (login, token, roles, cierre, sesión terminada) no cambian; los flujos de recuperación, reset, registro y verificación son comportamiento nuevo en esa capability. Alternativa descartada:
   `MODIFIED` sobre el requisito de login — forzaría a reescribir texto intacto y arriesga perder escenarios al archivar.
4. **Descarte en vez de reubicación de lo descriptivo.** Mover stack/estructura/deploy a `README.md` recrearía el problema (documento maestro que se desincroniza). Se verá con `rg -n "SPEC\.md"` que solo quedan punteros históricos en cambios archivados (se
   conservan: son registro).
5. **Actualización de punteros dentro del mismo cambio.** `AGENTS.md` (§6, §8 y el mapa de documentación) y la línea de documentación del `context` en `openspec/config.yaml` se editan al borrar `SPEC.md`, para que no queden enlaces rotos. Alternativa
   descartada: dejarlo para un cambio posterior — la ventana con punteros muertos no aporta nada.

## Risks / Trade-offs

- [Comportamiento con bugs latentes queda especificado] → Las rutas de paginación sin `:page` y el buscador sin montar se capturan solo en lo que hoy es observable (pedido paginado, control condicional; umbral y sanitización del componente) y se listan como
  hallazgos en `tasks.md` para decidir aparte.
- [Specs nuevos sin suite de tests] → Verificación por lectura de escenarios contra el código y `openspec validate --all`, según la convención del proyecto.
- [Pérdida de contexto útil de `SPEC.md` (inventario de componentes, árbol de dependencias)] → Se descarta deliberadamente: el inventario vive en el árbol de archivos y las versiones en `package.json`; la validación final incluye un `rg` que confirma que
  ninguna parte del repositorio sigue esperando `SPEC.md` salvo archivos históricos.
- [`home` queda como capability de un solo requisito] → Aceptado: es la frontera honesta de la pantalla de bienvenida; si crece (estadísticas, accesos rápidos), el requisito nuevo ya tiene dónde vivir.

## Migration Plan

1. Aplicar los deltas y archivar el cambio para sincronizar las 7 capabilities nuevas y el delta de `authentication` a `openspec/specs/`.
2. En el mismo apply: borrar `SPEC.md` y actualizar `AGENTS.md` + `openspec/config.yaml`.
3. Verificación: `openspec validate --all` y `rg -n "SPEC\.md"` limitado a `openspec/changes/archive/` (histórico permitido).
4. Rollback: reversión de git del commit del apply; los specs archivados se regeneran volviendo a ejecutar el archive sobre el cambio.

## Open Questions

<!-- Ninguna: los puntos pendientes (corregir paginación de proveedores/unidades, montar el buscador, lazy loading) son cambios de código con alcance propio, fuera de este cambio documental. -->
