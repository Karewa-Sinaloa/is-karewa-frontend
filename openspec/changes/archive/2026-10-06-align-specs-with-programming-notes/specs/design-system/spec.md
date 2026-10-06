# Spec Delta

## MODIFIED Requirements

### Requirement: Fuente única de tokens de diseño

El sistema SHALL definir los tokens de diseño (colores, familias tipográficas, pesos, tamaños de fuente, breakpoints y alias semánticos) en una única capa de configuración y exponerlos a la aplicación como propiedades CSS personalizadas.

#### Scenario: Agregar un token lo pone a disposición de toda la app

- **WHEN** se agrega un token de color o de tamaño a la configuración de diseño
- **THEN** la aplicación lo expone como variable CSS (`--color-*`, `--fs-*`, `--ff*`) utilizable desde cualquier vista o componente

#### Scenario: Vistas y componentes sin literales de color

- **WHEN** se revisa el código de vistas y componentes (`src/**/*.vue`, `src/**/*.js`)
- **THEN** no se encuentran literales de color hex ni `rgb()`; los estilos se referencian mediante `var(--...)`

#### Scenario: Colores de texto, fondo y borde en estilos de componentes

- **WHEN** se auditan las declaraciones de color de texto, fondo y borde en los estilos de componentes y objetos, excluyendo la capa de configuración de tokens
- **THEN** no hay valores hex o `rgb()` literales: se usan variables del sistema, salvo en elementos puramente decorativos (degradados y sombras), cuyas excepciones quedan registradas en el diseño del cambio

#### Scenario: Peso tipográfico consumido como token

- **WHEN** una vista, componente u hoja de estilos necesita un peso de fuente (por ejemplo el seminegrita de un encabezado o el peso de una etiqueta)
- **THEN** consume el token de peso declarado en la configuración de diseño y no escribe `font-weight` con un valor literal fuera de esa capa
