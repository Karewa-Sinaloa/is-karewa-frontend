# Spec Delta

## Purpose

Define el listado y el formulario de contratos del Monitor Karewa: presentación paginada y ordenada de los contratos, alta y edición con las entidades relacionadas y la baja con confirmación, sin incluir la configuración de catálogos que ya cubre
`contracts-configuration`.

## ADDED Requirements

### Requirement: Listado de contratos

El sistema SHALL presentar los contratos en una tabla paginada cuya ruta indica la página, ordenada por fecha de contrato descendente, con una columna de opciones que permite ver y eliminar cada contrato.

#### Scenario: Página con contratos

- **WHEN** un usuario con sesión navega a una página del listado de contratos
- **THEN** se muestran los contratos de esa página con sus datos de proveedor, unidades, materia, procedimiento, estado, fecha y tipo

#### Scenario: Orden por fecha

- **WHEN** se carga el listado
- **THEN** los contratos aparecen ordenados del más reciente al más antiguo por fecha de contrato

#### Scenario: Sin contratos

- **WHEN** el servidor no devuelve contratos en la página solicitada
- **THEN** la vista no muestra filas ni control de paginación

#### Scenario: Error del servidor al listar

- **WHEN** la solicitud del listado falla
- **THEN** se muestra la alerta del código devuelto y la vista queda vacía

### Requirement: Alta y edición de contratos

El sistema SHALL registrar y actualizar contratos desde un formulario cuyas opciones (procedimiento, materia, estatus, tipo, periodo, proveedor y unidades administrativas) provienen de los catálogos del sistema, validados en el cliente antes de enviar.

#### Scenario: Alta exitosa

- **WHEN** el usuario envía el formulario válido en modo alta
- **THEN** se crea el contrato, se muestra la alerta del código devuelto y la vista pasa a la ficha del contrato recién creado

#### Scenario: Edición exitosa

- **WHEN** el usuario guarda cambios sobre un contrato existente
- **THEN** se actualiza el contrato y se muestra la alerta del código devuelto

#### Scenario: Catálogo sin opciones

- **WHEN** un catálogo consultado no devuelve entradas
- **THEN** ese campo no ofrece opciones seleccionables y se muestra la alerta del error si la consulta falló

#### Scenario: Registro sin identificador válido

- **WHEN** la ruta de ficha carece de identificador o indica el valor 0
- **THEN** la vista redirige al modo de alta

### Requirement: Baja de contratos

El sistema SHALL eliminar un contrato únicamente tras una confirmación explícita del usuario, y SHALL retirarlo del listado cuando el servidor acepta la baja.

#### Scenario: Confirmación pendiente

- **WHEN** el usuario elige eliminar un contrato del listado
- **THEN** se muestra un popup de confirmación que advierte que la acción es definitiva

#### Scenario: Baja aceptada

- **WHEN** el usuario confirma y el servidor acepta la eliminación
- **THEN** el contrato desaparece de la tabla y se muestra la alerta del código devuelto

#### Scenario: Baja rechazada

- **WHEN** el servidor rechaza la eliminación
- **THEN** el contrato permanece en la tabla y se muestra la alerta del error
