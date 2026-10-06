# Karewa Frontend - Guía para Agentes

## Qué es

SPA de gestión de contratos, proveedores y unidades administrativas, parte del sistema integral Karewa. Vue 3 (Composition API) + Vite 7 + Pinia 3 + Vue Router 4 + Axios + Vee-Validate/Yup + Sass; build con `pnpm`. No hay backend ni base de datos locales:
consume la API indicada en `VITE_API_ENDPOINT` (ver `.env.example` y `DEV_ENV_MANUAL.md`).

## Comandos esenciales

```bash
pnpm dev      # Servidor de desarrollo (puerto 5174)
pnpm build    # Build de producción
pnpm preview  # Previsualizar build
```

Formato de código: Prettier con la configuración de `.prettierrc.json` (tabs, `printWidth` 260, comillas simples, `proseWrap: always`).

## Especificaciones (OpenSpec)

**Fuente canónica de comportamiento: `openspec/specs/`** — ante cualquier duda de qué debe hacer el sistema, se consulta el spec, no el código.

| Capability                | Cubre                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design-system`           | Tokens de color/tipografía/espaciado, escalas derivadas, iconografía, BEM y adhesión de superficies nuevas                                                |
| `ui-construction`         | Patrones de construcción de UI: ubicación `views/` vs `partials/`, anatomía del componente, parciales compartidos, capas SASS y registro en la navegación |
| `routing`                 | Rutas, protección por sesión (`meta.login`), redirecciones y scroll al inicio                                                                             |
| `authentication`          | Login con captcha, persistencia y vigencia del token, roles, logout, sesión terminada por servidor                                                        |
| `api-client`              | Operaciones HTTP, autorización automática, carga global, errores normalizados y cierre en 401                                                             |
| `error-handling`          | Códigos del servidor → mensajes mostrables, fallback genérico, alertas                                                                                    |
| `form-validation`         | Validación en cliente antes del envío, mensajes en español, errores por campo                                                                             |
| `contracts-configuration` | Dashboard de configuración (6 submódulos CRUD) y su uso en el formulario de contrato                                                                      |

Cambios activos en `openspec/changes/` (ver con `openspec list`). Flujo: `openspec new change "<kebab-en>"` → proposal/specs/design/tasks → apply → archive (sincroniza los deltas a `openspec/specs/`).

```bash
openspec list --specs                 # Inventario de capabilities
openspec status --change <nombre>     # Estado de los artifacts de un change
openspec validate --all               # Validar changes y specs
openspec show <id>                    # Ver un change o spec
```

## Convenciones

- **SASS**: `settings/` es la única fuente de tokens (se exportan como `var(--...)` en `:root`); `base/`, `objects/` y `components/` solo los consumen. Nomenclatura BEM. Reglas completas en la spec `design-system`.
- **Componentes**: `views/` = rutas de la aplicación; `partials/` = reutilizables. Reglas completas en la spec `ui-construction`.
- **Estado**: store único `useAppStore` (ver la spec `app-store`).
- **Sin suite de tests**: la verificación es contrastar escenarios/lógica contra el código + `openspec validate --all`.
- **Specs**: se redactan en español, requirements con SHALL y escenarios WHEN/THEN; capabilities en kebab-case inglés.

## Documentación relacionada

- `openspec/specs/` - Especificaciones de comportamiento canónicas por capability (requirements con SHALL y escenarios WHEN/THEN).
- `.env.example` - Variables de entorno requeridas (copiar a `.env`).
- `CHANGELOG.md` - Historial de cambios del proyecto.
- `NOTES.md` - Notas de avance de desarrollo.
- `DEV_ENV_MANUAL.md` / `README-docker.md` - Entorno de desarrollo Docker y tunnel.
