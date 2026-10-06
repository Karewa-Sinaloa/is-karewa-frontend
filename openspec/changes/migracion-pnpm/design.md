# Design

## Context

El working tree ya contiene la mayor parte de la migración sin commitear: `package.json` con `packageManager: pnpm@12.8.1`, `pnpm-lock.yaml` regenerado, `pnpm-workspace.yaml` nuevo (sin versionar), `docker/frontend/Dockerfile` usando
`pnpm install --frozen-lockfile` y `docker-compose.override.yml` ejecutando `pnpm exec vite`. `pnpm 12.8.1` y `corepack 0.36.0` están instalados localmente.

Restos sin resolver (ver proposal.md - Why): `package-lock.json` sigue tracked, tres guías documentan comandos `npm`, y `pnpm-workspace.yaml` es copiado por el Dockerfile pero no está en git. Además, el último `node_modules` (pruned 2026-10-03) reporta
`ignoredBuilds: [@parcel/watcher, esbuild, vue-demi]` — justo los paquetes que `allowBuilds` aprueba, es decir, la aprobación se agregó después de esa instalación y todavía no se materializó.

## Goals / Non-Goals

**Goals:**

- Un solo gestor de paquetes y un solo lockfile comprometido en git.
- Instalación reproducible en local y en Docker (`--frozen-lockfile`).
- Build de producción y dev server verificados bajo pnpm después de la limpieza.
- Guías de comandos (`AGENTS.md`, `SPEC.md`, `.github/copilot-instructions.md`) que ya no instruyan `npm`.

**Non-Goals:**

- Agregar CI ni cambiar la versión de Node/imagen base.
- Cambiar dependencias, scripts de `package.json` o configuración de Vite.
- Tocar `docker-compose.yml` (`restart: no`), `.agents/skills/` o `.serena/project.yml` — cambios ajenos que conviven en el working tree.
- Capturar capabilities/specs (tooling puro; el change declara `skip_specs: true`).

## Decisions

**1. Eliminar `package-lock.json` en vez de convivir con él.** Dos lockfiles significan que `npm install` y `pnpm install` pueden divergir silenciosamente y que el Dockerfile (`COPY package.json pnpm-lock.yaml ...`) ignora lo que npm resuelva. Alternativa
descartada: mantener ambos "por compatibilidad" — solo aplica si quedara un consumidor npm, y no lo hay.

**2. Ignorar `package-lock.json` en `.gitignore` además de borrarlo.** Borrar sin ignorar deja la puerta abierta a que cualquier `npm install` local lo regenere y reaparezca en un commit. Alternativa descartada: confiar solo en revisión de PRs — el proyecto no
tiene CI que lo bloquee.

**3. Versionar `pnpm-workspace.yaml` con `allowBuilds`.** Es la aprobación de scripts de build de pnpm 11+ (sintaxis válida en 12.8.1; `onlyBuiltDependencies` quedó deprecada). El Dockerfile lo incluye en el `COPY`, así que un clone limpio falla el build sin
él. Se conserva tal cual: `@parcel/watcher`, `esbuild`, `vue-demi` son exactamente los `ignoredBuilds` observados. Alternativa descartada: corepack/shims para gestionar la aprobación — pnpm la lee de este archivo.

**4. Verificar con una instalación sucia, no solo `pnpm install` incremental.** Como `ignoredBuilds` quedó de una instalación anterior, hace falta regenerar `node_modules` para comprobar que `allowBuilds` surte efecto. Riesgo real: `vue-demi` sin su script de
build no conmuta los archivos para Vue 3 y puede romper Pinia en runtime aunque `vite build` pase. Por eso la verificación incluye dev server respondiendo, no solo build.

**5. Dockerfile mantiene `npm install -g pnpm@12.8.1`, con el pin espejado a `packageManager`.** Funciona, es explícito y ya está probado en el tree. Corepack (`corepack enable`) sería la alternativa más elegante pero agrega una dependencia de descarga en
runtime del build y no mejora la reproducibilidad real. Se anota en las tareas que ambos pins deben moverse juntos.

**6. Commit aislado de lo no relacionado.** El working tree mezcla skills, `.serena/project.yml` y el cambio de `restart` en docker-compose. Se stagean solo los archivos pnpm para que el historial cuente una historia.

## Risks / Trade-offs

- [Colaborador con npm instalado regenera `package-lock.json`] → `.gitignore` + guías actualizadas; sin CI, es la mitigación disponible.
- [`vue-demi`/`esbuild` siguen en `ignoredBuilds` tras el install] → verificar `node_modules/.modules.yaml` y correr `pnpm build` + dev server; si persiste, revisar sintaxis de `allowBuilds` con `pnpm approve-builds`.
- [Pins de pnpm duplicados (package.json vs Dockerfile) se desincronizan] → misma tarea de verificación cubre ambos; documentar la regla en AGENTS.md.
- [Docs dispersos dejan de mencionar npm pero algún script externo lo usa] → grep de `npm run|npm install|npx` sobre el repo al final de las tareas como verificación.
- [Docker build local pasa pero un clone limpio no] → `pnpm-workspace.yaml` y `pnpm-lock.yaml` commiteados antes de dar por cerrado el cambio.

## Migration Plan

1. Línea base: `pnpm install --frozen-lockfile` + `pnpm build` con el tree actual.
2. Untracked → tracked: `git add pnpm-workspace.yaml`.
3. Limpieza: `git rm package-lock.json` y agregarlo a `.gitignore`.
4. Instalación limpia: regenerar `node_modules`, confirmar `ignoredBuilds: []`.
5. Verificación: `pnpm build`, dev server en 5174, `docker compose build frontend`.
6. Docs: reescribir los 9 referentes `npm`/`npx` en los tres archivos.
7. Commit solo con los archivos pnpm.
8. Rollback: revert del commit; `node_modules` se regenera con el lockfile anterior.

## Open Questions

- ¿Existe algún consumidor externo de `package-lock.json` (pipeline, proveedor) que no esté en este repo? Si no, la respuesta no cambia el plan.
- ¿El cambio `restart: unless-stopped → no` en `docker-compose.yml` es intencional y debe commitearse aparte? Fuera de alcance aquí; se decide fuera de este change.
