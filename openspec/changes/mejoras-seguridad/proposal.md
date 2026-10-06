# Proposal

## Why

Las revisas de seguridad del frontend muestran cinco carencias que ningún spec exige hoy: los 14 formularios con `<Form>` carecen de protección contra envíos duplicados (un doble clic en "Iniciar sesión" emite dos peticiones), la ayuda contextual se renderiza
con `v-html` a partir de contenido que también llega del servidor, el archivo `.env` con valores reales está versionado en git, el componente de subida no valida tipo ni tamaño antes de enviar, y los formularios de acceso no declaran autocompletado. El
comportamiento de seguridad ya cubierto (token Bearer, cierre en 401, captcha, vigencia del token) no se toca; lo que falta se especifica aquí para que su implementación futura tenga contrato.

## What Changes

- **Alcance: solo specs** (decisión explícita del usuario al definir la profundidad: ninguna mejora, incluido el anti-doble-envío, se implementa en código en este change; queda para cambios posteriores).
- `form-validation` recibe dos requisitos nuevos: envío único (mientras una petición del formulario está en vuelo no se emite un segundo envío y el control de envío queda inactivo) y validación de archivos antes de subir (tipo aceptado y tamaño máximo, con
  rechazo antes de la petición).
- `authentication` recibe el requisito de autocompletado seguro: correo como nombre de usuario y contraseña como contraseña vigente en el inicio de sesión, y contraseña nueva en el cambio de contraseña.
- `app-store` recibe el requisito de que el contenido de ayuda (incluido el que llega con las alertas del servidor) se muestre como texto, sin interpretarlo como marcado HTML.
- `code-quality` recibe el requisito de que los archivos de entorno con valores reales no estén versionados: solo se versiona la plantilla y el archivo real queda ignorado por git.
- Brechas spec↔código documentadas en `design.md` para los cambios de implementación futuros (incluido el anti-doble-envío que el usuario pidió implementar y dejó en specs).

## Capabilities

### New Capabilities

<!-- Ninguna: todas las mejoras se agregan a capabilities existentes. -->

### Modified Capabilities

- `form-validation`: se agregan los requisitos de envío único y de validación de archivos antes de subir; los requisitos existentes de validación y mensajes en español se conservan.
- `authentication`: se agrega el requisito de autocompletado seguro en los formularios de acceso; los requisitos existentes se conservan.
- `app-store`: se agrega el requisito de mostrar la ayuda como texto (seguridad de renderizado); requiere que `retirar-spec-md` esté archivado antes que este, porque crea esa capability.
- `code-quality`: se agrega el requisito de entorno no versionado; requiere que `mejoras-frontend` esté archivado antes que este, porque crea esa capability.

## Impact

- **Specs**: 4 deltas modificados (todos `ADDED`), sincronizados a `openspec/specs/` al archivar en el orden: `retirar-spec-md` → `mejoras-frontend` → este.
- **Documentación**: `CHANGELOG.md`; `AGENTS.md` solo si un apply previo cambió su tabla (rebase).
- **Código**: sin cambios en este change. Las brechas quedan en `design.md`: guardas de envío en los 14 formularios, `v-html` en `help.popup.vue`, `.env` versionado, validación de subidas en `drag_drop_file.vue`, `autocomplete` en `login.vue`/`reset.vue`.
- **Sistemas afectados**: la validación actual de `docker-compose.yml` (`env_file: .env`) y los docs (`cp .env.example .env`) siguen siendo compatibles con un `.env` local no versionado; la rotación de secretos por el histórico de git queda anotada como
  decisión fuera del frontend.
