# Tasks

> Este archivo funciona como backlog orientativo del estado objetivo. No debe usarse como instrucción de implementación automática. Si en el futuro se aprueba la ejecución, estas líneas deberán revisarse, revalidarse contra el contexto vigente y desglosarse nuevamente.

## 1. Entrada pública y estructura base

- [ ] 1.1 Cuando se autorice la implementación, evaluar el ajuste del router para que `/` pueda resolver una vista pública y `/admin` conserve el panel actual; la validación deberá confirmar que ambos accesos conviven sin desviar el alcance de la guía.
- [ ] 1.2 Si se decide construir la superficie pública, definir la estructura base del frontend público en `src/components/views/public/` y los parciales compartidos requeridos, verificando primero que el desglose siga siendo válido para el momento de ejecución.
- [ ] 1.3 En una implementación futura, asegurar que la entrada pública no dependa de sesión ni dispare redirecciones del panel, manteniendo este punto como criterio funcional de referencia.

## 2. Shell público compartido

- [ ] 2.1 Si el trabajo pasa a ejecución, implementar una vista contenedora del shell público con regiones semánticas para header, navegación, main y footer, verificando que la composición visible no incluya sidebar administrativo.
- [ ] 2.2 Si se aprueba construir el shell, contemplar un parcial de header público que conserve la identidad tipográfica existente.
- [ ] 2.3 Si se aprueba construir el shell, contemplar un parcial de menú público con enlaces por nombre de ruta, evitando URLs hardcodeadas y cualquier dependencia del sidebar del panel.
- [ ] 2.4 Si se aprueba construir el shell, contemplar un parcial de footer público como parte de la estructura compartida de la superficie pública.

## 3. Estilos públicos reutilizando el sistema visual

- [ ] 3.1 En una implementación futura, mantener las hojas Sass del frontend público dentro de `src/assets/sass/components/` y conectarlas con `@use`, sin mezclar reglas públicas en hojas exclusivas del panel.
- [ ] 3.2 En una implementación futura, aplicar al shell público la misma paleta, tipografías y objetos de botones existentes, manteniendo la restricción de no introducir colores literales fuera de `settings/`.
- [ ] 3.3 Sólo si la composición pública lo requiere durante una futura ejecución, extender tokens compartidos y exponer cualquier token nuevo como variable CSS desde la capa `settings/`.

## 4. Primera vista pública e integración incremental

- [ ] 4.1 Cuando exista una petición explícita de construcción, implementar una primera vista pública de portada o landing para visualización de datos dentro del shell compartido, manteniendo el criterio de solo consulta sin acciones de alta, edición o borrado.
- [ ] 4.2 Mantener como objetivo que el shell quede preparado para que futuras vistas o componentes públicos se agreguen como tareas independientes, con header, menú y footer desacoplados del contenido principal.
- [ ] 4.3 Si este change se lleva a implementación, cerrar la ejecución con `pnpm build`, `openspec validate --all` y una verificación manual de convivencia entre `/` y `/admin`.
