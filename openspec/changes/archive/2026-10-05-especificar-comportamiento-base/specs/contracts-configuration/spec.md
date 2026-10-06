# Spec Delta

## Purpose

Define el dashboard de configuración de contratos, sus seis submódulos y el uso de sus valores en el alta y edición de contratos.

## ADDED Requirements

### Requirement: Dashboard con seis submódulos

El sistema SHALL mostrar en la ruta de configuración de contratos los seis submódulos de configuración: procedimientos, materia, estatus, tipo, tipos de unidad y periodos.

#### Scenario: Acceso al dashboard

- **WHEN** un usuario con sesión navega a la configuración de contratos
- **THEN** ve los seis submódulos en la misma pantalla

#### Scenario: Acciones por submódulo

- **WHEN** se observa un submódulo
- **THEN** expone sus entradas con acciones de alta, edición y baja

### Requirement: Operación de los submódulos sin salir del dashboard

El sistema SHALL permitir crear, editar y eliminar entradas de cualquier submódulo sin salir del dashboard, incluyendo la edición inline de periodos de contratos.

#### Scenario: Alta de una entrada

- **WHEN** el usuario agrega una entrada en un submódulo
- **THEN** aparece en el listado de ese submódulo

#### Scenario: Baja de una entrada

- **WHEN** el usuario elimina una entrada
- **THEN** desaparece del listado de ese submódulo

#### Scenario: Edición de un periodo

- **WHEN** el usuario edita un periodo de contratos en su widget
- **THEN** los cambios quedan guardados y el periodo refleja el nuevo valor sin navegar a otra pantalla

### Requirement: Uso de la configuración en el formulario de contrato

El sistema SHALL usar las entradas configuradas como opciones del formulario de contrato para procedimientos, materia, estatus, tipo, tipos de unidad y periodos.

#### Scenario: Opciones disponibles

- **WHEN** el usuario crea o edita un contrato
- **THEN** los valores configurados aparecen como opciones seleccionables en el formulario

#### Scenario: Submódulo sin entradas

- **WHEN** un submódulo no tiene ninguna entrada configurada
- **THEN** el formulario de contrato no ofrece opciones para ese campo
