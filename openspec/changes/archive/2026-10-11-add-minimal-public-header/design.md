# Design

## Context

Ver `proposal.md` para la motivación. Antes de este change la aplicación solo renderizaba superficies administrativas visibles: `src/components/views/home.vue` compone `src/components/partials/sidebar.vue` y `src/components/partials/content_header.vue`, mientras `src/router/index.js` redirigía `/` hacia `/admin`. La guía existente en `openspec/changes/add-public-data-frontend/` ya perfila un shell público futuro con header y navegación propia, pero aún no existía un parcial específico ni una referencia horizontal reutilizable para alinear ese frontend. El sistema visual actual ya expone paleta, tipografías y breakpoints desde `src/assets/sass/settings/_variables.sass` y `src/assets/sass/base/_base.sass`, por lo que el header debe construirse reutilizando esos contratos.

## Goals / Non-Goals

**Goals:**
- Diseñar un header público compartido, separado del encabezado administrativo actual.
- Introducir una referencia de alineación horizontal reutilizable para el resto del frontend público.
- Mantener una estética minimalista basada en los tokens existentes, sin crear una línea visual paralela.
- Dejar el componente preparado para recibir enlaces desde un shell o vista consumidora sin acoplarlo a un árbol de rutas definitivo.

**Non-Goals:**
- Rediseñar `src/components/partials/content_header.vue` ni `src/components/partials/sidebar.vue`.
- Definir en este change la navegación pública completa ni sus etiquetas finales: sí se declaran rutas provisionales y una lista por defecto (`src/helpers/public.nav.js`) revisables cuando el shell público madure.
- Dar contenido a las vistas públicas: quedan en blanco hasta que se defina qué va en cada una.
- Introducir librerías de layout, menús o utilidades CSS externas.

## Decisions

### 1. Crear un parcial dedicado para el header público
- **Decisión:** el encabezado se implementará como un componente nuevo en `src/components/partials/`, separado de `src/components/partials/content_header.vue`.
- **Rationale:** el encabezado administrativo actual resuelve menú de usuario y acciones de sesión dentro del panel; mezclarlo con una navegación pública horizontal introduciría responsabilidades incompatibles.
- **Alternativas consideradas:**
  - Reutilizar `src/components/partials/content_header.vue`: conserva dependencias del panel y no responde al layout solicitado.
  - Extender `src/components/partials/sidebar.vue` para mostrarlo arriba: traslada patrones de navegación lateral a una superficie que debe ser horizontal y minimalista.

### 2. Extraer la alineación lateral como forma reutilizable
- **Decisión:** la separación lateral del header no quedará embebida solo en el parcial; se modelará como una forma reutilizable del sistema visual (por ejemplo en `src/assets/sass/objects/`) para que otras secciones públicas adopten la misma referencia horizontal.
- **Rationale:** el usuario pidió que ese espacio defina la alineación del resto del frontend, y la spec `ui-construction` ya indica que las formas reutilizables deben vivir fuera de estilos copiados entre componentes.
- **Alternativas consideradas:**
  - Declarar paddings directamente dentro del estilo del header: resolvería el componente aislado, pero no ofrecería una referencia compartida al resto de la superficie pública.
  - Introducir márgenes hardcodeados en cada futura vista pública: duplicaría reglas y favorecería divergencias visuales.

### 3. Resolver el menú como datos de entrada, no como enlaces hardcodeados
- **Decisión:** el parcial recibirá la información del logo y del menú como datos de entrada desde la vista o shell que lo consuma, en lugar de fijar dentro del componente una lista cerrada de enlaces.
- **Rationale:** hoy no existe un árbol público definitivo ni etiquetas finales de navegación; recibir enlaces como datos mantiene el componente reutilizable y evita reabrir el componente cada vez que cambie la navegación pública.
- **Alternativas consideradas:**
  - Hardcodear enlaces dentro del header: simplifica el primer montaje, pero acopla el componente a decisiones de navegación aún no cerradas.
  - Exigir store global para poblar el menú: agrega complejidad innecesaria para una navegación estática o semiestática.

### 4. Mantener una superficie visual mínima basada en tokens existentes
- **Decisión:** el header usará fondo claro, tipografía existente y un menú horizontal de enlaces sobrios; cualquier ajuste de separación, color o tipografía se resolverá con tokens y escalas ya disponibles antes de crear variantes nuevas.
- **Rationale:** el proyecto ya centraliza colores y tipografías en `settings/` y la petición del usuario describe un header limpio, no una cabecera promocional compleja.
- **Alternativas consideradas:**
  - Introducir una paleta exclusiva para el header público: rompería la continuidad del sistema de diseño.
  - Resolver el menú como botones pesados o tarjetas: contradice el objetivo de minimalismo visual.

### 5. Integración con rutas públicas provisionales
- **Decisión:** el change declara las seis rutas públicas (`/`, con `/inicio` redirigiendo a él, más `/contratos`, `/proveedores`, `/quienes-somos`, `/unidades-administrativas` y `/contacto`), monta el header en cada vista pública y convierte la raíz `/` en la entrada del frontend público. El panel sigue residiendo bajo `/admin` y la raíz `/` queda libre de vistas del panel.
- **Rationale:** para poder montar y verificar el header hace falta un destino donde mostrarlo; el usuario pidió expresamente que la raíz sirva el frontend público en lugar de redirigir al panel. Se mantienen provisionales (nombres de ruta y etiquetas) para poder mover la superficie pública sin rehacer el componente.
- **Alternativas consideradas:**
  - Dejar el cambio de rutas fuera de este alcance: impedía montar el header en ningún sitio y posponía la verificación visual.
  - Mover el panel fuera de `/admin`: es una reorganización mayor, innecesaria porque el panel ya vive bajo su prefijo.

## Risks / Trade-offs

- **[Riesgo]** La navegación pública definitiva puede requerir más enlaces o una adaptación responsive no descrita aquí. → **Mitigación:** modelar el menú como datos de entrada y dejar la adaptación móvil como cambio posterior si la spec lo demanda.
- **[Riesgo]** La referencia horizontal reutilizable podría terminar demasiado específica del header. → **Mitigación:** ubicarla como forma compartida y validarla contra el primer contenedor público que la consuma.
- **[Trade-off]** Separar el header del panel añade archivos nuevos, pero reduce el acoplamiento entre superficies administrativa y pública.
- **[Trade-off]** Declarar rutas provisionales acorta la distancia entre el header y su uso real, aunque obliga a un delta de `routing` y deja la navegación pública sujeta a revisión cuando madure el shell.

## Migration Plan

1. Crear la forma compartida de alineación horizontal y la hoja Sass del header reutilizando tokens existentes.
2. Crear el parcial del header público con logo y menú como datos de entrada, con la navegación por defecto en `src/helpers/public.nav.js` y el logotipo del panel administrativo.
3. Crear las seis vistas públicas en blanco en `src/components/views/public/` y montar el parcial en cada una.
4. Declarar las seis rutas públicas sin `meta.login`, convertir la raíz `/` en el frontend público, redirigir `/inicio` a `/` y documentar el delta de `routing`.
5. Validar consistencia de specs con `openspec validate --all` y revisión manual de la estructura y estilos definidos para el componente.
