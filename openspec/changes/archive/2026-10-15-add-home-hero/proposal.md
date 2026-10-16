# Proposal

## Why

La vista pública de inicio (`/`, `src/components/views/public/home.vue`) está en blanco: solo muestra el encabezado público y un comentario de "vista pública en blanco: pendiente de definición". Sin una sección de entrada, la landing no presenta la identidad del Monitor Karewa ni explica qué es la plataforma a los visitantes no autenticados.

## What Changes

- Se agrega un hero fullwidth a la vista pública de inicio con proporción 3:1 (`aspect-ratio: 3 / 1`) que ocupa todo el ancho de la ventana.
- El hero usa la etiqueta `<picture>` con una imagen estática de fondo: `src/assets/images/hero_home.webp` para viewports ≥ 1024px y `src/assets/images/hero_home_mobile.webp` para viewports < 1024px (siguiendo el precedente de `src/components/views/access.vue`).
- El hero aplica un overlay oscuro sobre la imagen de fondo para garantizar contraste suficiente con el texto superpuesto.
- El contenido del hero es un encabezado `h1` con el texto "Somos Monitor Karewa" y un párrafo descriptivo: "Monitor Karewa es una plataforma digital e independiente de vigilancia ciudadana que mide y hace pública la información sobre el gasto y las contrataciones públicas de los gobiernos (como compras, rentas, servicios y obras públicas)".
- Nuevos estilos SASS BEM para el hero en la capa `components/`, consumiendo tokens de `settings/` sin literales de color fuera de esa capa.

## Capabilities

### New Capabilities

- `public-home-hero`: Portada hero de la vista pública de inicio: composición fullwidth 3:1, imagen de fondo adaptativa por `<picture>`, overlay oscuro de contraste y contenido de presentación del Monitor Karewa.

### Modified Capabilities

- `home`: Se precisa que la capability cubre la vista pública de inicio además de la pantalla de bienvenida autenticada, y se añade el requirement del hero de portada (fullwidth 3:1, `<picture>` por breakpoint, overlay oscuro y texto de presentación).

## Impact

- Código: `src/components/views/public/home.vue` (se reemplaza el placeholder por el hero), nuevo `src/assets/sass/components/_home_hero.sass` (o equivalente) incluido con `@use` desde el componente.
- Assets: se consumen `src/assets/images/hero_home.webp` y `src/assets/images/hero_home_mobile.webp` (ya existentes en el repositorio).
- Sin cambios de router, API, store ni dependencias.
