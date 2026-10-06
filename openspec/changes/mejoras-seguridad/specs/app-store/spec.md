# Spec Delta

## ADDED Requirements

### Requirement: Ayuda mostrada como texto

El sistema SHALL mostrar el contenido de ayuda —incluido el que llega asociado a las alertas del servidor— como texto literal, sin interpretarlo como marcado HTML, de modo que ninguna etiqueta incrustada se ejecute ni se renderice en la interfaz.

#### Scenario: Ayuda con marcado HTML

- **WHEN** el contenido de ayuda contiene etiquetas HTML (por ejemplo un enlace o un negrita provenientes del servidor)
- **THEN** se muestran como texto visible con las etiquetas literales, sin renderizarlas

#### Scenario: Ayuda sin marcado

- **WHEN** el contenido de ayuda es texto plano
- **THEN** se muestra idéntico al texto original

#### Scenario: Alerta con ayuda del servidor

- **WHEN** una respuesta del servidor incluye texto de ayuda junto al código de la alerta
- **THEN** ese texto se muestra como texto y no como HTML
