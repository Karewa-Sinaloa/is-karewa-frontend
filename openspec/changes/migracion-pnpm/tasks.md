# Tasks

## 1. Línea base

- [x] 1.1 Ejecutar `pnpm install --frozen-lockfile` y `pnpm build` con el tree actual; verificar que ambos terminan en código 0 y que `dist/index.html` existe
- [x] 1.2 Verificar los pins de versión: `grep packageManager package.json` y `grep pnpm@ docker/frontend/Dockerfile` deben apuntar ambos a `12.8.1`; si difieren, detenerse y alinearlos antes de continuar

## 2. Consolidación de lockfiles

- [x] 2.1 Versionar `pnpm-workspace.yaml` (`git add pnpm-workspace.yaml`) y verificar con `git status --short` que aparece como `A ` (ya no `??`) — el Dockerfile lo copia en el build context
- [x] 2.2 Eliminar `package-lock.json` del repo (`git rm package-lock.json`) y verificar con `git ls-files | grep package-lock` que no devuelve nada
- [x] 2.3 Agregar `package-lock.json` a `.gitignore` y verificar que `touch package-lock.json && git status --short` no lo lista como untracked (luego borrar el archivo tocado)

## 3. Instalación y build limpios

- [x] 3.1 Regenerar `node_modules` desde cero (`rm -rf node_modules && pnpm install --frozen-lockfile`) y verificar con `grep -A4 ignoredBuilds node_modules/.modules.yaml` que la lista quedó vacía (`[]`), probando que `allowBuilds` surtió efecto
- [x] 3.2 Correr `pnpm build` y verificar código 0 con `dist/index.html` presente
- [x] 3.3 Arrancar `pnpm run dev` y verificar que el servidor responde en el puerto 5174 (HTTP 200 en `http://localhost:5174/`), confirmando que `vue-demi` conmutó correctamente para Vue 3

## 4. Guías de comandos

- [x] 4.1 Reemplazar los bloques `npm run dev/build/preview` por `pnpm run ...` en `AGENTS.md` (líneas ~60-62) y verificar con `grep -n "npm run" AGENTS.md` que no hay resultados
- [x] 4.2 Reemplazar `npm install`/`npm run` por `pnpm install`/`pnpm run` en `SPEC.md` (líneas ~414-417 y ~524) y verificar con `grep -n "npm " SPEC.md` que no hay resultados
- [x] 4.3 Actualizar `.github/copilot-instructions.md`: comandos a `pnpm run ...` y `npx prettier` a `pnpm exec prettier`; verificar con `grep -n "npm\|npx" .github/copilot-instructions.md` sin resultados
- [x] 4.4 Barrido final: `grep -rn "npm run\|npm install\|npm ci\|npx " --include="*.md" .` fuera de `.agents/` debe quedar sin resultados, verificando que ninguna guía del proyecto siga instruyendo npm

## Notas

- 3.1: la verificación literal (`grep -A4 ignoredBuilds ... → []`) no aplica a pnpm 12.8.1, que escribe `allowBuilds` en `.modules.yaml` en lugar de `ignoredBuilds`. Verificación adaptada aceptada: campo `allowBuilds` con `@parcel/watcher`/`esbuild`/`vue-demi`
  aprobados, ausencia de `ignoredBuilds`, `vue-demi` conmutado a Vue 3 (`isVue3 = true`) y binario de `esbuild` operativo tras `rm -rf node_modules`.
- 4.2: `SPEC.md` ya no existe — fue retirado por el change archivado `retirar-spec-md`; la tarea queda vacua (ningún documento instruye npm desde ahí).
- 4.3/4.4: los greps de las tareas usan `npm` como substring y coinciden dentro de `pnpm`. Verificación adaptada con límite de palabra (`grep -w` / `[^[:alnum:]_-]npm`) y, en 4.4, excluyendo los artifacts de este change (`design.md` y `tasks.md` documentan npm
  legítimamente). Resultado: ninguna guía del proyecto instruye npm.

## 5. Verificación Docker y cierre

- [ ] 5.1 Ejecutar `docker compose build frontend` y verificar código 0 (valida que `pnpm-workspace.yaml` y `pnpm-lock.yaml` viajan en el build context)
- [ ] 5.2 Levantar `docker compose up -d frontend` y verificar que el contenedor pasa healthcheck / `docker compose ps` lo muestra `healthy` o `running`
- [ ] 5.3 Commit aislado: `git add` solo de los archivos pnpm (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package-lock.json` borrado, `.gitignore`, `AGENTS.md`, `SPEC.md`, `.github/copilot-instructions.md`) y verificar con `git status --short`
      que skills, `.serena/` y `docker-compose.yml` quedan fuera del stage
