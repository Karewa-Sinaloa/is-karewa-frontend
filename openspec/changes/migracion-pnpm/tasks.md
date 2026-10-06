# Tasks

## 1. Línea base

- [ ] 1.1 Ejecutar `pnpm install --frozen-lockfile` y `pnpm build` con el tree actual; verificar que ambos terminan en código 0 y que `dist/index.html` existe
- [ ] 1.2 Verificar los pins de versión: `grep packageManager package.json` y `grep pnpm@ docker/frontend/Dockerfile` deben apuntar ambos a `12.8.1`; si difieren, detenerse y alinearlos antes de continuar

## 2. Consolidación de lockfiles

- [ ] 2.1 Versionar `pnpm-workspace.yaml` (`git add pnpm-workspace.yaml`) y verificar con `git status --short` que aparece como `A ` (ya no `??`) — el Dockerfile lo copia en el build context
- [ ] 2.2 Eliminar `package-lock.json` del repo (`git rm package-lock.json`) y verificar con `git ls-files | grep package-lock` que no devuelve nada
- [ ] 2.3 Agregar `package-lock.json` a `.gitignore` y verificar que `touch package-lock.json && git status --short` no lo lista como untracked (luego borrar el archivo tocado)

## 3. Instalación y build limpios

- [ ] 3.1 Regenerar `node_modules` desde cero (`rm -rf node_modules && pnpm install --frozen-lockfile`) y verificar con `grep -A4 ignoredBuilds node_modules/.modules.yaml` que la lista quedó vacía (`[]`), probando que `allowBuilds` surtió efecto
- [ ] 3.2 Correr `pnpm build` y verificar código 0 con `dist/index.html` presente
- [ ] 3.3 Arrancar `pnpm run dev` y verificar que el servidor responde en el puerto 5174 (HTTP 200 en `http://localhost:5174/`), confirmando que `vue-demi` conmutó correctamente para Vue 3

## 4. Guías de comandos

- [ ] 4.1 Reemplazar los bloques `npm run dev/build/preview` por `pnpm run ...` en `AGENTS.md` (líneas ~60-62) y verificar con `grep -n "npm run" AGENTS.md` que no hay resultados
- [ ] 4.2 Reemplazar `npm install`/`npm run` por `pnpm install`/`pnpm run` en `SPEC.md` (líneas ~414-417 y ~524) y verificar con `grep -n "npm " SPEC.md` que no hay resultados
- [ ] 4.3 Actualizar `.github/copilot-instructions.md`: comandos a `pnpm run ...` y `npx prettier` a `pnpm exec prettier`; verificar con `grep -n "npm\|npx" .github/copilot-instructions.md` sin resultados
- [ ] 4.4 Barrido final: `grep -rn "npm run\|npm install\|npm ci\|npx " --include="*.md" .` fuera de `.agents/` debe quedar sin resultados, verificando que ninguna guía del proyecto siga instruyendo npm

## 5. Verificación Docker y cierre

- [ ] 5.1 Ejecutar `docker compose build frontend` y verificar código 0 (valida que `pnpm-workspace.yaml` y `pnpm-lock.yaml` viajan en el build context)
- [ ] 5.2 Levantar `docker compose up -d frontend` y verificar que el contenedor pasa healthcheck / `docker compose ps` lo muestra `healthy` o `running`
- [ ] 5.3 Commit aislado: `git add` solo de los archivos pnpm (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package-lock.json` borrado, `.gitignore`, `AGENTS.md`, `SPEC.md`, `.github/copilot-instructions.md`) y verificar con `git status --short`
      que skills, `.serena/` y `docker-compose.yml` quedan fuera del stage
