# Spec Delta

## Purpose

Define el ciclo de vida de los proveedores en el Monitor Karewa: listado, alta, consulta, edición y baja, con los campos reales del formulario y la confirmación previa a la eliminación.

## ADDED Requirements

### Requirement: Listado de proveedores

El sistema SHALL listar los proveedores registrados en una vista paginada por el servidor, con una acción de alta y opciones por fila para ver y eliminar cada proveedor.

#### Scenario: Carga del listado

- **WHEN** un usuario con sesión navega al listado de proveedores
- **THEN** se solicitan los proveedores de la página actual y se muestran en una tabla con sus opciones por fila

#### Scenario: Altas nuevas disponibles

- **WHEN** el listado termina de cargarse
- **THEN** la vista ofrece el acceso de alta de un nuevo proveedor

#### Scenario: Error del servidor al listar

- **WHEN** la solicitud del listado falla con un error distinto de ausencia de resultados
- **THEN** se muestra la alerta del código devuelto

### Requirement: Alta y edición de proveedores

El sistema SHALL registrar y actualizar proveedores desde un mismo formulario con nombre obligatorio (máximo 150 caracteres), RFC obligatorio (máximo 13 caracteres) y comentarios opcionales, validados en el cliente antes de enviar.

#### Scenario: Alta exitosa

- **WHEN** el usuario envía el formulario válido en modo alta
- **THEN** se crea el proveedor, se muestra la alerta del código devuelto y la vista pasa a la ficha del proveedor recién creado

#### Scenario: Edición exitosa

- **WHEN** el usuario guarda cambios sobre un proveedor existente
- **THEN** se actualiza el proveedor y se muestra la alerta del código devuelto

#### Scenario: Campo inválido

- **WHEN** falta el nombre o el RFC supera su longitud máxima
- **THEN** se muestra el error del campo en español y no se emite la petición

#### Scenario: Registro sin identificador válido

- **WHEN** la ruta de ficha carece de identificador o indica el valor 0
- **THEN** la vista redirige al modo de alta

### Requirement: Baja de proveedores

El sistema SHALL eliminar un proveedor únicamente tras una confirmación explícita del usuario, y SHALL retirarlo del listado cuando el servidor acepta la baja.

#### Scenario: Confirmación pendiente

- **WHEN** el usuario elige eliminar un proveedor del listado o de su ficha
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** el proveedor desaparece del listado y se muestra la alerta del código devuelto

#### Scenario: Baja rechazada

- **WHEN** el servidor rechaza la eliminación
- **THEN** el proveedor permanece en el listado y se muestra la alerta del error
