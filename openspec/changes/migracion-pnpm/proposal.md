# Proposal

## Why

La migración a pnpm quedó a medias en el working tree: ya existen `packageManager: pnpm@12.8.1`, `pnpm-lock.yaml` actualizado, `pnpm-workspace.yaml` y un Dockerfile que instala con pnpm, pero sigue versionado `package-lock.json` (dos lockfiles compitiendo),
tres documentos de guía siguen instruyendo `npm`, y `pnpm-workspace.yaml` no está en git aunque el `Dockerfile` lo copia como parte del build context. Terminar la migración elimina builds no reproducibles y la ambigüedad sobre qué gestor de paquetes manda.

## What Changes

- **BREAKING** para flujos locales/CI: se elimina `package-lock.json`; los comandos diarios pasan a `pnpm install`, `pnpm run dev`, `pnpm run build`, `pnpm run preview`.
- Se versiona `pnpm-workspace.yaml` (contiene `allowBuilds` y es copiado por `docker/frontend/Dockerfile`; un clone limpio fallaría sin él).
- Se actualizan las guías de comandos para usar pnpm: `AGENTS.md`, `.github/copilot-instructions.md`, `SPEC.md`.
- Se verifica el flujo completo: `pnpm install --frozen-lockfile`, `pnpm build` y build de la imagen Docker.
- Fuera de alcance (cambios no relacionados presentes en el working tree): `restart: no` en `docker-compose.yml`, actualización de skills de `.agents/skills/` y `.serena/project.yml`.

## Capabilities

### New Capabilities

<!-- Ninguna: la migración es tooling puro; el comportamiento en runtime de la aplicación no cambia. -->

### Modified Capabilities

<!-- Ninguna. Este change declara `skip_specs: true` en su `.openspec.yaml`. -->

Sin cambios a nivel de especificación: specs describe comportamiento observable del sistema y este cambio solo altera cómo se instalan dependencias y se documentan los comandos. No se inventa un requisito solo para satisfacer la validación.

## Impact

- **Archivos**: `package-lock.json` (eliminado), `pnpm-workspace.yaml` (nuevo en git), `package.json`, `pnpm-lock.yaml`, `docker/frontend/Dockerfile` (verificación), docs (`AGENTS.md`, `.github/copilot-instructions.md`, `SPEC.md`).
- **Dependencias**: ninguna nueva; se consolida el instalador en pnpm 12.8.1 fijado por `packageManager`.
- **Sistemas**: build Docker (`pnpm install --frozen-lockfile`), desarrollo local (puerto 5174, `pnpm exec vite`), cualquier CI futuro.
- **Sin impacto** en comportamiento de la aplicación, API ni datos.
