# Spec Delta

> Este delta ajusta `routing` a la superficie pública creada en este change: la raíz `/` ya no redirige al panel y `/contratos` dejó de ser un ejemplo de URI no reconocida porque ahora es una ruta pública declarada.

## MODIFIED Requirements

### Requirement: Reserva de la raíz para el frontend público

El sistema SHALL servir la raíz `/` como punto de entrada del frontend público y SHALL mantener esa URI libre de vistas del panel administrativo.

#### Scenario: Redirección de la raíz

- **WHEN** se navega a `/`
- **THEN** la URL permanece en `/` y se muestra la vista pública de inicio con su header, sin redirigir a `/admin`

#### Scenario: Compatibilidad de `/inicio`

- **WHEN** se navega a `/inicio`
- **THEN** la URL resultante es `/` y se muestra la misma vista pública de inicio

#### Scenario: Sin vistas del panel en la raíz

- **WHEN** se revisa el árbol de rutas del panel
- **THEN** ninguna vista del panel está declarada en `/`

#### Scenario: Dashboard administrativo preservado

- **WHEN** se navega a `/admin`
- **THEN** se muestra la pantalla de inicio del panel administrativo con su navegación y encabezado actuales

### Requirement: URIs no reconocidas

El sistema SHALL resolver toda URI que no corresponda a una ruta declarada redirigiéndola a `/admin`, de modo que una forma antigua o un error de tipeo no muestre una pantalla en blanco.

#### Scenario: Forma antigua sin prefijo

- **WHEN** se navega a una ruta pública inexistente bajo la superficie abierta (por ejemplo `/facturas`)
- **THEN** no se muestra ninguna vista pública y la navegación termina en `/admin`

#### Scenario: Ruta desconocida bajo el prefijo

- **WHEN** se navega a `/admin/una-ruta-inexistente`
- **THEN** la navegación termina en `/admin` y no se muestra una pantalla en blanco
