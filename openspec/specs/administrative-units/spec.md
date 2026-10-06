# administrative-units Specification

## Purpose

Define el ciclo de vida de las unidades administrativas en el Monitor Karewa: listado, alta, consulta, edición y baja, con sus campos reales del formulario y la confirmación previa a la eliminación.

## Requirements

### Requirement: Listado de unidades administrativas

El sistema SHALL listar las unidades administrativas registradas en una vista paginada por el servidor, con una acción de alta y opciones por fila para ver y eliminar cada unidad.

#### Scenario: Carga del listado

- **WHEN** un usuario con sesión navega al listado de unidades administrativas
- **THEN** se solicitan las unidades de la página actual y se muestran en una tabla con sus opciones por fila

#### Scenario: Altas nuevas disponibles

- **WHEN** el listado termina de cargarse
- **THEN** la vista ofrece el acceso de alta de una nueva unidad administrativa

#### Scenario: Error del servidor al listar

- **WHEN** la solicitud del listado falla con un error distinto de ausencia de resultados
- **THEN** se muestra la alerta del código devuelto

### Requirement: Alta y edición de unidades administrativas

El sistema SHALL registrar y actualizar unidades administrativas desde un mismo formulario con nombre obligatorio (máximo 150 caracteres) y comentarios opcionales, validados en el cliente antes de enviar.

#### Scenario: Alta exitosa

- **WHEN** el usuario envía el formulario válido en modo alta
- **THEN** se crea la unidad, se muestra la alerta del código devuelto y la vista pasa a la ficha de la unidad recién creada

#### Scenario: Edición exitosa

- **WHEN** el usuario guarda cambios sobre una unidad existente
- **THEN** se actualiza la unidad y se muestra la alerta del código devuelto

#### Scenario: Campo inválido

- **WHEN** falta el nombre o supera su longitud máxima
- **THEN** se muestra el error del campo en español y no se emite la petición

#### Scenario: Registro sin identificador válido

- **WHEN** la ruta de ficha carece de identificador o indica el valor 0
- **THEN** la vista redirige al modo de alta

### Requirement: Baja de unidades administrativas

El sistema SHALL eliminar una unidad administrativa únicamente tras una confirmación explícita del usuario, y SHALL retirarla del listado cuando el servidor acepta la baja.

#### Scenario: Confirmación pendiente

- **WHEN** el usuario elige eliminar una unidad del listado o de su ficha
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** la unidad desaparece del listado y se muestra la alerta del código devuelto

#### Scenario: Baja rechazada

- **WHEN** el servidor rechaza la eliminación
- **THEN** la unidad permanece en el listado y se muestra la alerta del error
