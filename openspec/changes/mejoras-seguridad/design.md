# Design

## Context

Hallazgos verificados que motivan cada requisito (ver `proposal.md` — Why):

- **Doble envío**: 14 componentes usan `<Form>` (`login`, `recovery`, `reset`, `registration`, `organization`, formularios de proveedores, unidades y los 8 view de configuración de contratos). Ninguno declara bandera de envío ni desactiva el control de envío;
  los botones de acceso son `type="submit"` con `@click.prevent="validate()…"` y una segunda pulsación emite otra petición.
- **Ayuda con `v-html`**: `src/components/partials/help.popup.vue` renderiza `v-html="helpText"`; el texto llega de `store.help` y las alertas del servidor aportan `help` vía `push_alert` (`src/resources/errors.js` copia `notification.help`).
- **`.env` versionado**: `git ls-files` incluye `.env` desde el primer commit y no está en `.gitignore`; los documentos (`DEV_ENV_MANUAL.md`, `README-docker.md`) instruyen `cp .env.example .env` y `docker-compose.yml` lo usa como `env_file`, es decir, el flujo
  ya asume un archivo local.
- **Subidas sin validar**: `drag_drop_file.vue` recibe `accept` como prop pero no valida tipo ni tamaño antes de `Upload(...)`; hoy ningún vista lo monta.
- **Sin autocomplete**: `login.vue` y `reset.vue` no declaran atributos `autocomplete` en correo/contraseña.
- Seguridad ya cubierta por specs existentes (no se toca): token Bearer y cierre en 401 (`api-client`), captcha y vigencia/roles del token (`authentication`), validación de campos (`form-validation`), redirecciones con sesión (`routing`).

## Goals / Non-Goals

**Goals:**

- Especificar como contrato los cinco frentes seleccionados: envío único, validación de subidas, autocomplete seguro, ayuda renderizada como texto y entorno no versionado.
- Dejar las brechas spec↔código listadas para los cambios de implementación posteriores.

**Non-Goals:**

- Implementar código en este change —decisión explícita del usuario: el anti-doble-envío y el resto quedan en specs.
- Rotar secretos ni reescribir historial de git por el `.env` pasado (decisión de operaciones, fuera del frontend).
- Cabeceras de seguridad del servidor (CSP, HSTS, rate limiting), que pertenecen al despliegue del API.
- El manejo de PII en la query de reset/verificación, que define el flujo del servidor.

## Decisions

1. **`form-validation` como hogar del envío único.** Su propósito ya cubre el comportamiento del formulario "antes de enviar"; el envío no duplicado es la continuación natural de esa misma frontera. Alternativa descartada: capability nueva `form-submission` —
   un solo requisito no justifica una capability.
2. **Validación de archivos en `form-validation`, no en `api-client`.** El rechazo ocurre antes de la petición y se muestra como error de campo; `api-client` conserva el contrato de la operación de subida en sí. El requisito es aplicable aunque hoy el
   componente de subida no esté montado: rige toda futura subida.
3. **Autocomplete en `authentication`.** El autocompletado de credenciales es comportamiento de los flujos de acceso, no de cualquier formulario; `form-validation` queda genérico para el resto.
4. **Ayuda como texto en `app-store`.** El popup de ayuda y el campo `help` de las alertas viven en el ciclo de vida del estado global; el requisito de seguridad se expresa donde se renderiza. Requiere archivar `retirar-spec-md` antes que este (crea
   `app-store`).
5. **Entorno no versionado en `code-quality`.** Es una condición verificable del repositorio, la misma frontera que lint y dependencias sin uso. Requiere archivar `mejoras-frontend` antes que este (crea `code-quality`).
6. **Orden de archivo encadenado**: `retirar-spec-md` → `mejoras-frontend` → `mejoras-seguridad`. Los tres deltas de este change apuntan a capabilities que (en parte) todavía no existen como spec principal; archivar fuera de orden crearía specs sin sus
   requirements base.

## Brechas spec↔código (entrada a cambios futuros)

- `form-validation` ↔ código: ningún `<Form>` declara bandera de envío ni desactiva el control (los 14 componentes listados en Context); `drag_drop_file.vue` no valida tipo/tamaño.
- `authentication` ↔ código: `login.vue` y `reset.vue` sin atributos `autocomplete`.
- `app-store` ↔ código: `help.popup.vue` usa `v-html` para `store.help` y para el `help` de las alertas del servidor.
- `code-quality` ↔ código: `.env` rastreado por git y ausente de `.gitignore`.
- El anti-doble-envío, pedido inicialmente para implementarse, queda como brecha número 1 por elección de alcance "solo specs".

## Risks / Trade-offs

- [Specs aspiracionales: los escenarios no se cumplen hoy] → Aceptado por el alcance; cada brecha es entrada de un change de implementación con sus tareas de contraste.
- [Archivar fuera del orden encadenado] → La tarea 3.4 de este change verifica la existencia de `app-store` y `code-quality` antes del archive; los dos cambios predecesores también lo declaran.
- [Dejar de versionar `.env` sorprende a flujos que lo asumen] → `docker-compose.yml` y los docs ya tratan `.env` como archivo local; solo cambia su estatus en git.
- [Ayuda como texto rompe ayuda que sí usaba marcado] → Ningún contenido actual incrusta HTML intencionalmente; el escenario "ayuda sin marcado" garantiza equivalencia visual.
- [Specs sin suite de tests] → Verificación por lectura de escenarios y comandos (`rg`, `git ls-files`) + `openspec validate --all`.

## Migration Plan

1. Archivar en orden: `retirar-spec-md`, luego `mejoras-frontend`, luego `mejoras-seguridad`; cada archive sincroniza sus `ADDED` a `openspec/specs/`.
2. En el mismo apply: `CHANGELOG.md` (y `AGENTS.md` si su tabla cambió en applies previos).
3. Cambios futuros de implementación consumiendo las brechas: anti-doble-envío (prioridad 1, pedido por el usuario), `v-html`, `.env` fuera de git, subidas, autocomplete.
4. Rollback: revertir el commit del apply; no hay cambios de código.

## Open Questions

<!-- Ninguna: la inclusión de las cinco mejoras y el alcance "solo specs" quedaron decididos con el usuario en la fase de propuesta. -->
