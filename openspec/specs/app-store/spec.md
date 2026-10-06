# app-store Specification

## Purpose

Define el estado global que la aplicación comparte entre vistas: las notificaciones con su ciclo de vida, la acción de alta contextual, el popup global y la ayuda contextual, tal como los expone el store único de la aplicación.

## Requirements

### Requirement: Notificaciones con descarte automático

El sistema SHALL mostrar las alertas del store como notificaciones y SHALL retirarlas automáticamente unos segundos después de aparecer, o de inmediato cuando el usuario las cierra.

#### Scenario: Aviso que desaparece solo

- **WHEN** se agrega una alerta al store
- **THEN** la notificación permanece visible unos segundos y después desaparece sin intervención del usuario

#### Scenario: Cierre manual

- **WHEN** el usuario cierra una notificación antes de que expire
- **THEN** esa notificación desaparece del listado

#### Scenario: Varias operaciones consecutivas

- **WHEN** varias operaciones agregan alertas en ráfaga
- **THEN** cada notificación conserva su propio momento de aparición y se descuenta de forma independiente

### Requirement: Acción de alta contextual

El sistema SHALL ofrecer en la vista activa un acceso de alta del módulo cuando la vista lo registra, y SHALL ocultar y limpiar esos accesos al cambiar de ruta.

#### Scenario: Listado con alta disponible

- **WHEN** un listado registra su acción de alta al montarse
- **THEN** la aplicación muestra el acceso "Nuevo…" que navega al formulario de alta del módulo

#### Scenario: Cambio de ruta

- **WHEN** el usuario navega a otra ruta
- **THEN** el acceso de alta se cierra y la lista de acciones registradas queda vacía

### Requirement: Popup global

El sistema SHALL mostrar un popup global construido desde los datos del store, con dos comportamientos de botón: navegar a una ruta o cerrarse, y SHALL limpiar el popup al activarlo.

#### Scenario: Popup informativo

- **WHEN** el store recibe un popup de tipo cierre con título, texto e icono
- **THEN** se muestra el popup con su botón y, al pulsarlo, el popup desaparece

#### Scenario: Popup que navega

- **WHEN** el store recibe un popup de tipo ruta con una ruta de destino
- **THEN** al pulsar el botón la aplicación navega a esa ruta y el popup se cierra

### Requirement: Ayuda contextual

El sistema SHALL mostrar contenido de ayuda en un popup compartido cuando un icono de ayuda lo registra, y SHALL cerrarlo cuando el usuario lo descarta.

#### Scenario: Apertura de ayuda

- **WHEN** el usuario pulsa un icono de ayuda con texto asociado
- **THEN** se abre el popup de ayuda con ese contenido

#### Scenario: Cierre de ayuda

- **WHEN** el usuario cierra el popup de ayuda
- **THEN** el contenido de ayuda queda vacío y el popup no se muestra
