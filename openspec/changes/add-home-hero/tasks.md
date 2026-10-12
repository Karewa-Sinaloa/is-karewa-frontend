# Tasks

## 1. Estilos del hero

- [x] 1.1 Crear `src/assets/sass/components/_home_hero.sass` con las reglas BEM del bloque `.home-hero` (contenedor fullwidth con `aspect-ratio: 3 / 1`, imagen a sangre con `object-fit: cover`, overlay oscuro basado en tokens y contenido superpuesto con tipografía desde tokens) y verificar que el hoja no declara literales de color fuera de `settings/` (grep de hex/`rgb()` en la hoja)

## 2. Vista pública de inicio

- [x] 2.1 Reemplazar el placeholder de `src/components/views/public/home.vue` por el hero: mantener `<public-header />` y agregar la sección `.home-hero` con `<picture>` (source `media="(min-width: 1024px)"` → `hero_home.webp`, `<img>` fallback → `hero_home_mobile.webp` con `alt=""`), el overlay y el contenido (`h1` "Somos Monitor Karewa" + párrafo descriptivo) e incluir la hoja de estilos con `@use`; verificar que el componente conserva `<script setup>`, template y bloque `<style lang="sass">` con `@use` de la nueva hoja

## 3. Verificación de integración

- [x] 3.1 Ejecutar `pnpm build` y verificar que el build termina sin errores y las imágenes `hero_home.webp` y `hero_home_mobile.webp` quedan incluidas como assets
- [x] 3.2 Contrastar los escenarios de `openspec/changes/add-home-hero/specs/public-home-hero/spec.md` y de `home` contra el código: proporción 3:1 fullwidth, selección de imagen ≥/< 1024px por `<picture>`, overlay oscuro con tokens, textos exactos e imagen decorativa (`alt=""`); verificar además `openspec validate --all`
