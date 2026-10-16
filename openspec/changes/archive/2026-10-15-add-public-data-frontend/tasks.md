# Tasks

> Re-desglosado el 2026-10-15 tras la autorización explícita de implementación.
> La versión anterior era un backlog orientativo condicional y fue sustituida, tal como
> exigía su propia cabecera, revalidada contra el contexto vigente del repositorio.

## 1. Entrada pública y estructura base

- [x] 1.1 Confirmar en `src/router/index.js` que `/` resuelve la vista pública y `/admin` conserva el panel, y que ambos accesos conviven sin desviar el alcance.
- [x] 1.2 Confirmar que `/inicio` redirige a `/` y que ninguna vista del panel administrativo está declarada en la raíz `/`.
- [x] 1.3 Confirmar que la entrada pública no requiere sesión (sin `meta.login`) y que el guard no la desvía al flujo de acceso del panel.

## 2. Shell público compartido

- [x] 2.1 Crear el parcial `public_shell.vue` con regiones semánticas: header con navegación, `main` y footer, sin sidebar administrativo.
- [x] 2.2 Crear el parcial `public_footer.vue` como parte de la estructura compartida de la superficie pública.
- [x] 2.3 Migrar las seis vistas públicas (`home`, `contracts`, `providers`, `about`, `admin_units`, `contact`) para que se compongan dentro del shell y sólo aporten el contenido de `main`.
- [x] 2.4 Verificar que el menú público enlaza por nombre de ruta desde `src/helpers/public.nav.js`, sin URLs hardcodeadas ni dependencia del sidebar del panel.

## 3. Estilos públicos reutilizando el sistema visual

- [x] 3.1 Mantener las hojas Sass del frontend público en `src/assets/sass/components/` y conectarlas con `@use` (nuevas: `_public_shell.sass`, `_public_footer.sass`).
- [x] 3.2 Verificar que los estilos públicos no introducen colores literales fuera de `settings/` y que reutilizan la paleta, la tipografía y los objetos existentes.
- [x] 3.3 Declarar en la capa `settings/` y exponer como variable CSS cualquier token nuevo que el shell o el footer necesiten (sólo si hace falta).

## 4. Primera vista pública e integración incremental

- [x] 4.1 Verificar que la portada pública es de solo consulta, sin controles de alta, edición o borrado.
- [x] 4.2 Cerrar la ejecución con `pnpm build`, `openspec validate --all` y una verificación de convivencia entre `/` y `/admin`.
