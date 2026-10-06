# design-system Specification

## Purpose

Mantiene una identidad visual única en toda la superficie del Monitor Karewa: define los tokens de color, tipografía, espaciado e iconografía de los que se derivan todas las vistas, y obliga a que cualquier superficie nueva —incluida la futura área de acceso
público— reutilice el mismo sistema.

## Requirements

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

### Requirement: Escalas de color derivadas

El sistema SHALL generar las escalas de color —rampa de grises y rampas por color semántico— derivándolas de los colores base de la paleta, sin declarar los tonos intermedios uno por uno.

#### Scenario: Tono intermedio de una escala

- **WHEN** una interfaz requiere un tono derivado (por ejemplo el 800 de la paleta primaria)
- **THEN** su valor proviene de la escala generada a partir del matiz del color base, no de un valor hex escrito a mano

### Requirement: Tipografía por rol

El sistema SHALL asignar la familia tipográfica por rol: encabezados en Oswald con peso 600; etiquetas, botones y leyendas en Lato con peso 500; texto corrido (párrafos, listas, texto inline) en Poppins con peso 400.

#### Scenario: Encabezado renderizado

- **WHEN** se muestra un título (h1–h6)
- **THEN** usa Oswald con peso 600

#### Scenario: Control renderizado

- **WHEN** se muestra un botón o una etiqueta de formulario
- **THEN** usa Lato con peso 500

### Requirement: Escala de tamaños de texto

El sistema SHALL servir los tamaños de texto desde la escala de tokens, con interlineado y espaciado de letras derivados del tamaño, sin fijar tamaños sueltos dentro de las vistas.

#### Scenario: Tamaño de texto nuevo en una vista

- **WHEN** una vista necesita un tamaño de texto
- **THEN** consume un valor de la escala de tokens y su interlineado se deriva del mismo token

### Requirement: Estados semánticos de color

El sistema SHALL exponer colores semánticos de estado (primary, secondary, success, warning, danger, info) para estados de interfaz y retroalimentación, de modo que alertas, notificaciones y resultados compartan el mismo código de color.

#### Scenario: Notificación de éxito

- **WHEN** se muestra una notificación o estado de éxito
- **THEN** usa el color semántico de éxito definido por el sistema

### Requirement: Iconografía consistente

El sistema SHALL usar exclusivamente el set Material Symbols (Outlined) con la configuración de variante declarada por el sistema; no se incorporan fuentes de iconos alternativas.

#### Scenario: Icono en un componente

- **WHEN** se dibuja un icono en la interfaz
- **THEN** pertenece a Material Symbols Outlined y respeta la configuración de variante (relleno 0, peso 400)

### Requirement: Nomenclatura de componentes

El sistema SHALL nombrar los estilos de componentes con la convención bloque `__` elemento `--` modificador, de modo que cada variante visual se exprese como modificador de un bloque existente y no como reglas sueltas nuevas.

#### Scenario: Nueva variante de un componente

- **WHEN** un componente existente necesita una variante visual
- **THEN** se expone como modificador de su bloque y no como una regla de estilo independiente

### Requirement: Superficies nuevas reutilizan el sistema

El sistema SHALL exigir que cualquier superficie nueva —incluida la futura área de acceso público— reutilice los tokens, la tipografía y la iconografía existentes; los tokens que no existan se agregan primero a la configuración de diseño antes de usarse.

#### Scenario: La superficie pública necesita un color inexistente

- **WHEN** el área de acceso público requiere un color o tamaño aún no definido en el sistema
- **THEN** el token se agrega a la capa de configuración y queda expuesto como variable CSS antes de usarse en la interfaz

#### Scenario: Intento de salirse de la línea visual

- **WHEN** un cambio de interfaz intenta usar una paleta, tipografía o fuente de iconos distinta a la del sistema
- **THEN** el cambio no cumple el contrato y debe resolverse extendiendo los tokens del sistema, no añadiendo estilos ajenos
