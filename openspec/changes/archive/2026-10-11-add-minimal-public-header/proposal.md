# Proposal

## Why

La guía del frontend público ya prevé un shell con header y navegación propia, pero todavía no existe un contrato específico para el encabezado visible. Hace falta definir ese componente para fijar una identidad pública consistente: logo a la izquierda, enlaces a la derecha y una franja horizontal que además marque la alineación base del resto de la interfaz.

## What Changes

- Definir una capacidad nueva para el header público minimalista, incluyendo su composición visual, su alineación interna y el comportamiento básico del menú de enlaces.
- Establecer que el header ocupe todo el ancho de la ventana con fondo claro, pero que su contenido interno se alinee dentro de un contenedor con separación lateral reutilizable por el resto del frontend público.
- Especificar que el logo quede alineado al extremo izquierdo del contenedor interno y el menú de navegación al extremo derecho, sin pegar ninguno de los dos a los bordes de la ventana.
- Ajustar las reglas de construcción de UI para permitir un parcial de header público reutilizable dentro del shell público, separado del `content_header.vue` administrativo.
- Ajustar el sistema de diseño para que el header público mantenga una estética minimalista reutilizando tokens de color, tipografía y espaciado del sistema existente.
- Registrar una superficie pública mínima: seis vistas públicas todavía en blanco (`inicio`, `contratos`, `proveedores`, `quienes-somos`, `unidades-administrativas` y `contacto`) con sus rutas declaradas sin `meta.login`, para que el header pueda montarse en ellas.
- Convertir la raíz `/` en la entrada al frontend público (con `/inicio` redirigiendo a `/`) en lugar de redirigir al panel, manteniendo `/admin` como punto de entrada del panel administrativo.
- Publicar la navegación por defecto del header como datos externos (`src/helpers/public.nav.js`) y montar el parcial en cada vista pública, usando el mismo logotipo que el panel administrativo.

## Capabilities

### New Capabilities
- `public-header`: cubre el encabezado público compartido, su estructura con logo y navegación, la alineación horizontal del contenido y su carácter minimalista.

### Modified Capabilities
- `ui-construction`: incorpora el header público como parcial reutilizable distinto de los parciales del panel administrativo.
- `design-system`: agrega reglas visuales para que el header público use fondo claro, separación lateral consistente y estilos minimalistas basados en tokens existentes.
- `routing`: la raíz `/` pasa a servir el frontend público en lugar de redirigir a `/admin`, y las URIs no reconocidas dejan de usar `/contratos` como ejemplo de redirección porque ya es una ruta pública declarada.

## Impact

- Impacto en `src/components/partials/` con un parcial de header público independiente del panel administrativo.
- Impacto en `src/assets/sass/components/` y `src/assets/sass/objects/` con estilos del header público y la forma de alineación horizontal reutilizable.
- Impacto en `src/components/views/public/` (seis vistas en blanco) y en `src/router/index.js` (seis rutas públicas sin `meta.login`, raíz `/` como frontend público y `/inicio` redirigiendo a `/`).
- Impacto en `src/helpers/public.nav.js` con la navegación por defecto del header.
- Dependencia conceptual de la guía existente en `openspec/changes/add-public-data-frontend/`, porque el header forma parte del shell público previsto allí.
- No introduce dependencias externas nuevas.
