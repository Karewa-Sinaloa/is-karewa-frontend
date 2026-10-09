# Proposal

## Why

El Monitor corre hoy en la raíz del dominio, así que no hay espacio para el frontend público que se construirá después en `/`: mover el panel a `/admin` reserva la raíz y deja separado lo autenticado de lo público desde ya, antes de que existan enlaces y
marcadores del sitio público.

## What Changes

- **BREAKING** — todas las URIs del panel se sirven bajo `/admin`: `/admin/acceso/inicio-de-sesion`, `/admin/contratos`, `/admin/configuracion/p/1`, `/admin/proveedores/nuevo`, etc. El dashboard pasa de `/` a `/admin`.
- **BREAKING** — las URIs actuales sin prefijo dejan de resolver a su sección: `/contratos` ya no muestra el listado de contratos. No se declara un redirect uno a uno entre la forma vieja y la nueva.
- La raíz `/` redirige a `/admin` mientras el frontend público no exista, de modo que la raíz queda reservada y el panel sigue accesible desde la URL más corta.
- Toda URI no reconocida —dentro o fuera de `/admin`— termina en `/admin`, para que una forma vieja o un error de tipeo no deje una pantalla en blanco.
- Se actualizan `VITE_PASS_RESET_URL` y `VITE_USER_VERIFICATION_URL` a `/admin/acceso/cambiar-contrasena` y `/admin/acceso/verificacion-de-usuario`, porque construyen los enlaces de recuperación y verificación que llegan por correo; el `.env` real de cada
  despliegue debe acompañar al `.env.example`.
- No cambian los nombres de ruta: la navegación de la aplicación resuelve por nombre y queda intacta.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `routing`: todas las requirements que citan URIs literales pasan a citarlas bajo `/admin`, la sección de nuevas rutas exige el prefijo, y se agregan los requisitos del prefijo, de la raíz reservada y de las URIs no reconocidas.

## Impact

- `src/router/index.js`: los 19 `path` declarados —incluidos los dos redirects internos y el padre `/acceso/` con sus cinco hijos— reciben el prefijo; `/` deja de declarar `homeView` y pasa a redirigir; se agrega una ruta comodín.
- `.env.example` (versionado) y `.env` de cada despliegue: las dos URLs de enlaces por correo.
- `src/components/partials/recovery.vue`, `registration.vue` y `reset.vue`: consumen esas variables, sin cambio de código.
- Navegación lateral, encabezado y todas las vistas: sin cambios, enlazan por nombre de ruta.
- `docker/nginx/default.conf`: sin cambios, `location /` proxya al dev server que responde el fallback de historia para `/admin/*`.
- Sin cambios en la API, en el contrato OpenAPI ni en la capa de estilos.
