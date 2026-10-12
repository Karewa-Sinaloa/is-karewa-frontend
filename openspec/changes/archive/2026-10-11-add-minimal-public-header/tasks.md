# Tasks

## 1. Base visual compartida

- [x] 1.1 Crear en `src/assets/sass/objects/` una forma reutilizable para la alineación horizontal pública y verificar que defina la separación lateral que el header y futuras secciones podrán compartir sin duplicar márgenes.
- [x] 1.2 Crear la hoja Sass del header público en `src/assets/sass/components/` y verificar que resuelva fondo claro, espaciado y tipografía usando tokens existentes del sistema en lugar de colores o tamaños literales fuera de `settings/`.

## 2. Parcial reutilizable del header público

- [x] 2.1 Crear un parcial nuevo en `src/components/partials/` para el header público y verificar que sea independiente de `src/components/partials/content_header.vue`, `sidebar.vue` y cualquier lógica de sesión del panel.
- [x] 2.2 Implementar en el parcial la estructura semántica del encabezado con logo a la izquierda y menú de enlaces a la derecha, y verificar por revisión del template que ambos extremos comparten la misma línea principal dentro de un contenedor interno.
- [x] 2.3 Resolver el menú como datos de entrada del componente (logo y enlaces configurables) y verificar que el markup permita reutilizar el mismo parcial en distintas vistas públicas sin hardcodear una lista cerrada de rutas.

## 3. Verificación del cambio

- [x] 3.1 Ejecutar `openspec validate --all` y verificar mediante revisión manual del componente y su Sass que el header definido conserva ancho completo, fondo claro, separación lateral reutilizable y una estética minimalista de enlaces.

## 4. Superficie pública mínima (alcance añadido)

- [x] 4.1 Crear las seis vistas públicas en blanco en `src/components/views/public/` (inicio, contratos, proveedores, quiénes somos, unidades administrativas y contacto) y montar el parcial de header público en cada una sin añadirles contenido.
- [x] 4.2 Declarar en `src/router/index.js` las seis rutas públicas sin `meta.login`, convertir la raíz `/` en la vista de inicio del frontend público (con `/inicio` redirigiendo a `/`) y comprobar que `/admin` sigue mostrando el panel.
- [x] 4.3 Publicar la navegación por defecto del header en `src/helpers/public.nav.js` con las seis entradas y verificar que el parcial la usa como valor por defecto de su prop de enlaces.
- [x] 4.4 Configurar el parcial para usar el mismo logotipo que el panel administrativo (`src/assets/images/logo.png`) y verificar que el enlace del logo lleva a la raíz pública.
- [x] 4.5 Ejecutar `openspec validate --all` y `pnpm build` tras el alcance añadido y verificar que ambos terminan sin errores.
