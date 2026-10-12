# Spec Delta

> Este delta documenta criterios visuales del estado objetivo para la superficie pública. Su existencia no obliga a implementar de inmediato componentes o estilos.

## MODIFIED Requirements

### Requirement: Superficies nuevas reutilizan el sistema
El sistema SHALL exigir que cualquier superficie nueva —incluido el frontend público— reutilice los tokens, la tipografía, la iconografía y los estilos de botones existentes; los tokens que no existan se agregan primero a la configuración de diseño antes de usarse.

#### Scenario: La superficie pública necesita un color inexistente
- **WHEN** el área pública requiere un color o tamaño aún no definido en el sistema
- **THEN** el token se agrega a la capa de configuración y queda expuesto como variable CSS antes de usarse en la interfaz

#### Scenario: Botón público alineado con el panel
- **WHEN** el frontend público muestra una acción con botón
- **THEN** ese botón reutiliza las mismas variantes visuales base del sistema en lugar de introducir un estilo de botón ajeno al panel administrativo

#### Scenario: Intento de salirse de la línea visual
- **WHEN** un cambio de interfaz intenta usar una paleta, tipografía, fuente de iconos o estilo de botón distinto a los del sistema
- **THEN** el cambio no cumple el contrato y debe resolverse extendiendo los tokens u objetos compartidos, no añadiendo estilos ajenos
