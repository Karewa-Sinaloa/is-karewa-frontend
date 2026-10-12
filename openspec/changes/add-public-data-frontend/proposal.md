# Proposal

## Why

El repositorio ya reserva la raíz `/` para un frontend público, pero hoy la navegación envía esa URI al panel administrativo. Este change documenta el contrato funcional y visual deseado para una futura superficie pública enfocada en visualización de datos, alineada con la identidad visual existente pero con una composición propia sin sidebar. No constituye por sí mismo una instrucción para crear componentes, rutas o estilos de inmediato.

## What Changes

- Definir una capacidad nueva para el frontend público de visualización de datos, incluyendo su carácter público, su shell visual base y la separación entre header, menús, cuerpo y footer.
- Establecer como dirección objetivo del producto que `/` deje de redirigir al dashboard administrativo y pase a ser el punto de entrada del frontend público, manteniendo el panel bajo `/admin` cuando se autorice su implementación.
- Ajustar las reglas de construcción de UI para permitir vistas públicas sin sidebar, con parciales propios y hojas de estilo separadas del panel administrativo como criterio guía para trabajo futuro.
- Ajustar el sistema de diseño para exigir que el frontend público reutilice la misma paleta, tipografías y estilos de botones del panel actual antes de introducir variantes nuevas.
- Mantener un backlog orientativo de posibles frentes de implementación, a desglosarse sólo cuando exista una petición explícita de ejecución.

## Capabilities

### New Capabilities
- `public-data-frontend`: cubre el comportamiento base del frontend público de visualización de datos, su shell compartido, su navegación pública y la separación visual respecto al panel administrativo.

### Modified Capabilities
- `routing`: la raíz `/` deja de redirigir a `/admin` y pasa a resolver el frontend público, preservando el panel administrativo bajo el prefijo `/admin`.
- `ui-construction`: las superficies públicas podrán componerse con header/footer/menús propios, sin sidebar, y con hojas de estilo separadas del panel.
- `design-system`: el frontend público deberá reutilizar la misma paleta, tipografías y estilos de botones ya vigentes en el panel administrativo.

## Impact

- Sirve como guía de producto y arquitectura para futuras decisiones sobre rutas públicas frente a administrativas.
- Anticipa posibles vistas y parciales en `src/components/views/` y `src/components/partials/` para un shell público, sin ordenar su creación inmediata.
- Establece criterios para una futura organización de estilos Sass en `src/assets/sass/` con archivos diferenciados para la superficie pública.
- Define cómo deberían reutilizarse y, si fuera necesario, extenderse los tokens y objetos visuales existentes para mantener colores, tipografías y botones alineados con la interfaz actual.
