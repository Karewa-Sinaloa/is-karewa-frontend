# Design

## Context

Ver proposal.md - Why. Hechos verificados en el código antes de escribir los deltas:

- **Rutas** (`src/router/index.js`): guard con `meta.login`; login/recovery/reset redirigen a inicio si ya hay sesión (crear-cuenta y verificación no); `/contratos` → `/contratos/p/1`; `/acceso/` → login; `scrollBehavior` al inicio.
- **Sesión** (`helpers/set.session.js`): token en `localStorage` con prefijo `VITE_LOCALSTORAGE_SUFFIX`, decodificado con `jwt-decode`; exp `now > exp` expira; `role_id` ausente o `> 5` rechaza la sesión; logout llama a `access/logout` y borra todo.
- **HTTP** (`api/requests.js` + `api/axios.js`): métodos Get/Post/Put/Delete/Upload; `Authorization` con el token tal cual; `loading(true/false)` alrededor de cada petición; 401 → popup solo con `ACCESS003`/`ACCESS006` y cierre de sesión siempre; Delete sin id
  rechaza localmente (406, `API_NO_ENTRY_ID_PROVIDED`).
- **Errores** (`resources/errors.js`): `serverMessages(code)` mapea a `{type, title, text}`; código desconocido → `SERVER-ERROR`.
- **Validación**: vee-validate + yup por formulario, mensajes en español en `helpers/yup.locale.js`; un 400 con `errors` por campo se inyecta al formulario (`setFieldMessages`).
- **Contratos**: el dashboard renderiza 6 widgets (procedimientos, materia, estatus, tipo, unit_types, periodos); `contract_view.vue` consume `procedimientos`, `materias`, `estatus-contrato`, `tipo-contrato`, `unit-types`, `periodos-contratos`, entre otros.
- **Inventario previo**: `openspec/specs/` solo contiene `design-system` (archivado de `capturar-sistema-diseno`); `AGENTS.md` documenta estas seis áreas como prosa y duplica casi todo `SPEC.md`.

## Goals / Non-Goals

**Goals:**

- Capturar el comportamiento base en 6 capabilities con escenarios contrastables contra el código.
- Reducir `AGENTS.md` a un índice operativo que apunte a las specs y a la documentación existente.
- Sembrar `openspec/config.yaml → context:` con el conocimiento que AGENTS.md deja de cargar.

**Non-Goals:**

- Modificar código de la aplicación o `SPEC.md` (este último queda para el trabajo futuro que ya se decidió).
- Especificar el store, el inventario de componentes ni el stack: son descripción de implementación y ya viven en `SPEC.md` §6, §3/§8 y §2 respectivamente.
- Escribir tests automatizados: la verificación es la lectura cruzada escenario ↔ código.

## Decisions

**1. Seis capabilities planas, una por frontera de comportamiento.** `routing`, `authentication`, `api-client`, `error-handling`, `form-validation`, `contracts-configuration`: mismos nombres que usan la documentación y el código (módulos), layout plano como
`design-system`. Alternativa descartada: agrupar `routing` + `authentication` en un `session-flow` — mezclaría navegación con vida del token y empeoraría la localización de un cambio.

**2. Se especifica el comportamiento observado, no el deseado.** Cualquier asimetría actual (por ejemplo, que `/acceso/crear-cuenta` siga accesible con sesión) se captura tal cual: este cambio es una captura retrospectiva y no introduce decisiones de producto.
Si el comportamiento debe cambiar, se hace vía delta en un cambio posterior.

**3. Frontera entre `api-client` y `error-handling`.** `api-client` entrega errores ya normalizados (`{status, data}`) y ejecuta el cierre de sesión en 401; `error-handling` traduce `data.code` a mensaje mostrable. El popup de sesión finalizada pertenece a
`authentication` (es UX de sesión, no del transporte). Alternativa descartada: una sola capability `http-errors` — acoplaría transporte y presentación.

**4. `AGENTS.md` como índice, no como resumen.** La sección nueva "Especificaciones (OpenSpec)" lista capabilities con una línea, cambios activos y el flujo con comandos; todo lo demás se reemplaza por punteros a `openspec/specs/`, `SPEC.md` (con mapa de
secciones) y los docs operativos. Alternativa descartada: resumir cada spec en 3 líneas dentro de AGENTS.md — recrearía la desincronización que motiva el cambio.

**5. `openspec/config.yaml → context:` absorbe lo retirado.** Stack, convenciones Prettier/SASS, mapa de módulos y la convención de redactar specs en español: así todo `openspec new change` futuro hereda el contexto sin que AGENTS.md lo cargue. Verificación
con `openspec context`.

**6. Verificación por contraste, no por suite.** Cada escenario se contrasta con el archivo de código que lo implementa (tasks §1.2); la validación estructural la da `openspec validate`. Sin suite de tests en el proyecto, esta es la verificación más barata
posible.

## Risks / Trade-offs

- [Los specs capturan bugs o asimetrías como si fueran requisitos] → decisión 2: es intencional; la corrección es un delta posterior, no una edición silenciosa de este spec.
- [Adelgazar AGENTS.md le quita contexto a los agentes] → se conservan comandos, convenciones y el mapa de docs; el contenido de comportamiento queda a un salto de distancia (índice → spec).
- [Los 6 deltas pueden desviarse del código al no haber tests] → task de contraste escenario ↔ código y `openspec validate --all` antes del archive.
- [Duplicación con `SPEC.md`] → asumido: `SPEC.md` no se toca y los specs no copian su prosa; cuando se retome `SPEC.md` podrá aligerarse apuntando a `openspec/specs/`.

## Migration Plan

Sin despliegue: apply reescribe `AGENTS.md` y `openspec/config.yaml` (documentación y configuración de tooling); archive sincroniza los 6 deltas a `openspec/specs/`. Rollback: revert de los archivos tocados; ningún cambio de datos ni dependencias.

## Open Questions

- ¿Hasta dónde absorber `SPEC.md` (§4, §5, §7, §11) en los specs cuando se retome ese archivo? No bloquea este change: los requirements ya viven en `openspec/specs/` y el trabajo futuro sobre `SPEC.md` podrá apuntar a ellos.
