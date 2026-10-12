# Spec Delta

## Purpose

Define el encabezado público compartido de Karewa para que las vistas abiertas al público tengan una franja superior consistente, reconocible y alineada con el resto de su contenido.

## ADDED Requirements

### Requirement: Encabezado público de ancho completo
El sistema SHALL mostrar el header público como una franja de ancho completo con fondo claro, usando un contenedor interno que preserve separación lateral constante respecto de ambos bordes de la ventana.

#### Scenario: Carga del header público
- **WHEN** una persona abre una vista que usa el shell público
- **THEN** el encabezado ocupa todo el ancho visible, muestra un fondo claro y mantiene su logo y navegación dentro de una zona interna separada de los bordes laterales

#### Scenario: Referencia horizontal compartida
- **WHEN** otras secciones del frontend público tomen como referencia el ancho útil del header
- **THEN** pueden alinear su contenido principal con la misma separación lateral definida por el encabezado

### Requirement: Distribución izquierda-derecha del contenido
El sistema SHALL ubicar el logo al lado izquierdo del contenedor interno del header y el menú de enlaces al lado derecho, manteniendo ambas zonas en extremos opuestos de la misma línea principal.

#### Scenario: Header con branding y navegación
- **WHEN** se renderiza el encabezado público
- **THEN** el logo queda alineado a la izquierda del contenedor interno y el menú de navegación queda alineado a la derecha sin intercambiar posiciones

#### Scenario: Logotipo compartido con el panel
- **WHEN** se renderiza el encabezado público sin recibir un logo explícito
- **THEN** usa el mismo archivo de logotipo que el panel administrativo (`src/assets/images/logo.png`) y su enlace apunta a la vista pública de inicio

### Requirement: Menú público minimalista
El sistema SHALL presentar la navegación del header como un menú minimalista de enlaces legibles, apoyado en la tipografía y colores del sistema, sin replicar la densidad visual ni la estructura del sidebar administrativo.

#### Scenario: Auditoría visual del menú
- **WHEN** se revisa el menú del header público
- **THEN** sus enlaces se perciben como navegación horizontal sobria sobre la superficie clara y no como una variante del menú lateral del panel
