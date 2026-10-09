# Design

## Context

El enrutamiento vive entero en `src/router/index.js`: 19 `path` declarados —incluidos los dos redirects internos y el padre `/acceso/` con sus cinco hijos—, `createWebHistory()` sin `base`, un guard en `beforeEach` que decide con `to.meta.login` y `to.name`, y
ninguna vista con `meta` que dependa de la URI. Toda la navegación de la aplicación —sidebar, encabezado, paginación, popups y los `router.push` de las vistas— resuelve por **nombre** de ruta; no hay una sola cadena de path fuera del router.

Fuera del router solo dos puntos conocen URIs: `VITE_PASS_RESET_URL` y `VITE_USER_VERIFICATION_URL`, que consumen `recovery.vue`, `reset.vue` y `registration.vue` para armar los enlaces que llegan por correo. El servidor de desarrollo
(`docker/nginx/default.conf`) proxya `location /` al dev server de Vite, que responde el fallback de historia para cualquier path, y no declara ningún `location` específico.

## Goals / Non-Goals

**Goals:**

- Que todo path del panel quede bajo `/admin` sin tocar un solo nombre de ruta ni una sola llamada de navegación.
- Reservar `/` para el frontend público y evitar pantallas en blanco con las formas viejas.
- Que los enlaces de correo sigan llegando a las vistas correctas.

**Non-Goals:**

- Construir el frontend público o declarar sus rutas: solo se reserva la raíz.
- Renombrar rutas, cambiar `meta` ni modificar el guard.
- Servir el panel bajo un subdirectorio distinto de `/admin` o bajo otro dominio.
- Cambios en la API, en el contrato OpenAPI o en la capa de estilos.

## Decisions

1. **Prefijo declarado en cada `path`, no como `base` del historial** — `createWebHistory()` sigue sin `base` y cada ruta se escribe como `/admin/...`. Alternativa descartada: `createWebHistory('/admin/')`, que haría que Vue Router antepusiera el prefijo a
   todas las URLs pero dejaría `/` fuera del árbol, impediría que el futuro frontend público conviviera en el mismo origen y obligaría a rewrites distintos por origen.

2. **La raíz se resuelve con un redirect declarado y con una ruta comodín al final del arreglo** — `/` apunta a `/admin` y la última entrada captura cualquier path no reconocido con el mismo redirect. Alternativa descartada: una vista 404 propia, que no existe
   en la app y añadiría una superficie nueva sin que la pida el alcance.

3. **Sin redirects uno a uno de las formas viejas** — decidido con el usuario: `/contratos` no debe aterrizar en `/admin/contratos`, sino en el panel. La comodín absorbe esas URIs, así que ninguna queda en blanco y ninguna resuelve a su sección anterior.

4. **Los nombres de ruta se conservan tal cual** — `homeView`, `accessViewLogin`, `configuracionView` y el resto siguen siendo el contrato de navegación: los usa el sidebar, el guard, `pagination-container` (`module="configuracionView"`) y cada `router.push`.
   Renombrarlos no cambiaría ninguna URI visible y sí rompería comportamiento.

5. **El guard queda intacto** — se apoya en `to.meta.login` y en `to.name`, nunca en la URI, por lo que el prefijo no lo afecta. La ruta comodín no lleva `meta.login` y redirige antes de evaluar protección.

6. **Las URLs de correo se actualizan en el manifiesto de entorno, no en el código** — `.env.example` (versionado) queda con `/admin/acceso/cambiar-contrasena` y `/admin/acceso/verificacion-de-usuario`, y el `.env` real de cada despliegue debe acompañarlo.
   Alternativa descartada: derivarlas de `window.location.origin` en tiempo de ejecución, porque el enlace lo termina de componer el servidor al enviar el correo y perdería el origen correcto.

## Risks / Trade-offs

- [Marcadores y correos ya enviados con la forma vieja] → la comodín los lleva al panel en vez de a la sección concreta; si algún enlace merece conservar su destino, se agrega un redirect individual sin tocar las specs.
- [El `.env` real no está versionado] → si un despliegue no lo actualiza, los enlaces de recuperación y verificación quedan rotos; se mitiga actualizando `.env.example`, documentándolo en `.env` y verificándolo como tarea explícita.
- [La comodín puede enmascarar un error de ruteo] → se declara al final del arreglo, detrás de todas las rutas del panel, y solo redirige; no intercepta ninguna ruta declarada.
- [El servidor de producción podría no tener fallback de historia para `/admin/*`] → el stack actual proxya todo al dev server que sí lo tiene; si se sirve `dist/` con otro servidor hay que confirmar su fallback antes de desplegar.

## Migration Plan

Cambio atómico en un despliegue: router y `.env` se actualizan juntos, porque dejar el router con prefijo y el entorno sin él rompe los enlaces de correo en el mismo release. El rollback es revertir ambos —restaurar los 19 `path`, quitar la raíz y la comodín,
y volver a las URLs de entorno sin prefijo—; no hay datos ni API que migrar.

## Open Questions

Ninguna: el destino de las URIs viejas, el comportamiento de la raíz y la actualización de las URLs de correo quedaron definidos con el usuario en la fase de clarificación.
