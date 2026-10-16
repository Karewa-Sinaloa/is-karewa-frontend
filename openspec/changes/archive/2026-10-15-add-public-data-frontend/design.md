# Design

## Context

Ver `proposal.md` para la motivación. Hoy el router reserva `/` para un frontend público en la spec, pero la implementación real redirige esa URI a `/admin`. La aplicación carga una sola capa base de Sass desde `App.vue`, usa tokens globales en `src/assets/sass/settings/_variables.sass`, objetos compartidos como `src/assets/sass/objects/_buttons.sass` y compone el panel con `sidebar.vue` + `content_header.vue`. Este documento fija criterios de referencia para una futura superficie pública paralela: comparte identidad visual y utilidades globales, pero no la misma estructura de navegación ni las mismas hojas de estilo específicas. No debe interpretarse como mandato de implementación inmediata.

## Goals / Non-Goals

**Goals:**
- Describir cómo debería introducirse una entrada pública en `/` sin afectar el panel existente en `/admin`, cuando se decida implementarla.
- Definir el shell público objetivo con header, menú, main y footer, sin sidebar.
- Reutilizar tokens, tipografías y objetos visuales existentes, especialmente botones y colores.
- Separar conceptualmente los estilos específicos del frontend público para evitar contaminación entre superficies.
- Dejar identificado un desglose orientativo para una futura ejecución por vistas y componentes públicos.

**Non-Goals:**
- Rediseñar el panel administrativo actual.
- Cambiar la paleta, tipografías o variantes base de botones existentes.
- Definir en este cambio todas las visualizaciones de datos concretas o su integración con APIs todavía no especificadas.
- Sustituir las utilidades globales compartidas ya montadas en `App.vue` salvo que una tarea posterior lo requiera.

## Decisions

> Nota: las decisiones de esta sección describen el estado objetivo y la dirección de diseño para trabajo futuro. No instruyen crear archivos o componentes mientras no exista una petición explícita de implementación.


### 1. Árbol de rutas público separado del panel
- **Decisión:** la raíz `/` deberá poder pasar a una vista pública propia y `/admin` deberá conservar el dashboard administrativo actual cuando este change se convierta en trabajo de implementación.
- **Rationale:** la spec ya reserva `/` para el frontend público y el router actual mantiene aislado el panel bajo `/admin`; este documento sólo formaliza esa dirección objetivo.
- **Alternativas consideradas:**
  - Mantener `/` como redirección y servir el frontend público en otra ruta: contradice la spec existente y diluye el punto de entrada público.
  - Mezclar vistas públicas y administrativas bajo un mismo layout: incrementa acoplamiento entre navegación pública y privada.

### 2. Shell público compartido con componentes dedicados
- **Decisión:** si se implementa la superficie pública, convendrá crear una vista contenedora pública en `src/components/views/public/` y parciales propios en `src/components/partials/` para header, menú y footer públicos.
- **Rationale:** la convención del proyecto separa vistas de parciales; además, el shell público necesita piezas reutilizables distintas de `sidebar.vue` y `content_header.vue`.
- **Alternativas consideradas:**
  - Reutilizar `sidebar.vue` ocultándolo con CSS: conserva dependencias estructurales incorrectas y no cumple el requisito de no tener sidebar.
  - Construir cada vista pública completa sin shell compartido: duplica markup y complica mantener header/footer consistentes.

### 3. Estilos públicos aislados dentro de la capa `components/`
- **Decisión:** si se implementa la superficie pública, sus estilos específicos deberían alojarse en archivos Sass separados dentro de `src/assets/sass/components/`, preferentemente en un subespacio dedicado como `components/public/`, y cargarse desde cada componente con `@use`.
- **Rationale:** respeta la arquitectura por capas vigente, mantiene tokens y objetos compartidos donde ya están, y hace explícita la frontera entre estilos del panel y de la superficie pública.
- **Alternativas consideradas:**
  - Crear una segunda base global completa: duplicaría reglas globales ya cubiertas por `base/_base.sass`.
  - Mezclar reglas públicas en `_sidebar.sass`, `_content_header.sass` o archivos existentes: haría más difícil evolucionar ambas superficies sin regresiones.

### 4. Reutilización estricta de tokens y objetos visuales
- **Decisión:** el frontend público deberá reutilizar `settings/_variables.sass`, la base tipográfica ya cargada y los objetos compartidos como `_buttons.sass`; cualquier necesidad nueva deberá resolverse extendiendo tokens u objetos en lugar de crear variantes aisladas del frontend público.
- **Rationale:** el usuario pidió conservar colores, tipografías y estilos de botones del "backend", y en este repositorio esos contratos viven ya en tokens y objetos del panel.
- **Alternativas consideradas:**
  - Clonar los estilos de botones en una hoja pública: generaría divergencia visual con el tiempo.
  - Permitir colores locales en los componentes públicos: rompería la spec del sistema de diseño.

### 5. Implementación incremental por piezas visibles
- **Decisión:** cuando se apruebe la ejecución, convendrá dividir el trabajo en tareas separadas para ruta pública, shell, header, menú, footer, base de estilos públicos y primeras vistas/contenedores, dejando cada vista o componente de visualización como una unidad de trabajo independiente.
- **Rationale:** permite usar este change como guía general ahora y como base de desglose más adelante, sin asumir trabajo inmediato.
- **Alternativas consideradas:**
  - Implementar toda la superficie pública en una sola tarea: dificultaría revisión, validación y ajustes de alcance.

## Risks / Trade-offs

- **[Riesgo]** La referencia a "backend" puede implicar una fuente visual externa a este repositorio. → **Mitigación:** tomar como contrato inicial los tokens y objetos ya presentes en este frontend administrativo y validar cualquier diferencia visual detectada contra la referencia real durante la implementación.
- **[Riesgo]** Mantener una sola base global de Sass puede arrastrar estilos demasiado orientados al panel. → **Mitigación:** limitar el CSS público a hojas propias y revisar qué reglas globales siguen siendo neutrales antes de extenderlas.
- **[Riesgo]** El wildcard actual redirige cualquier ruta desconocida a `/admin`, lo que puede ser insuficiente cuando crezca el árbol público. → **Mitigación:** en la implementación de rutas públicas revisar el orden y alcance de redirects para no expulsar navegación pública futura al panel.
- **[Trade-off]** Crear parciales públicos nuevos aumenta el número de archivos, pero reduce acoplamiento y hace posible evolucionar el frontend público sin tocar el layout administrativo.

## Migration Plan

1. Mantener las specs y este diseño como guía del estado objetivo.
2. Cuando exista una decisión explícita de implementación, revisar si `/` debe pasar a una entrada pública y `/admin` conservarse sin cambios funcionales.
3. En esa futura ejecución, desglosar shell público, parciales compartidos y hojas Sass separadas como trabajo independiente.
4. Validar cualquier implementación futura con `openspec validate --all` y revisión manual de navegación pública/administrativa.

## Open Questions

- ¿Cuáles serán las primeras vistas públicas concretas de visualización de datos además de la portada/shell inicial?
- ¿Cuándo debería pasar este change de guía de diseño a trabajo autorizado de implementación?
