# Spec Delta

## Purpose

Controla qué acciones de crear, editar y borrar puede ver cada usuario según los permisos que declara la API por sección, y cómo se comunica esa restricción en la interfaz.

## ADDED Requirements

### Requirement: Autorización por sección y acción

El sistema SHALL evaluar por sección, para cada una de las acciones crear, editar y borrar, si el rol de la sesión actual está autorizado según el conjunto de roles que declara el servidor para esa acción.

#### Scenario: Rol incluido en la acción

- **WHEN** el servidor declara una sección cuyo conjunto de roles de una acción incluye el rol de la sesión
- **THEN** esa acción se considera autorizada

#### Scenario: Rol fuera de la acción

- **WHEN** el servidor declara una sección cuyo conjunto de roles de una acción no incluye el rol de la sesión
- **THEN** esa acción se considera no autorizada

#### Scenario: Acción declarada sin roles

- **WHEN** el servidor declara una acción de una sección con el conjunto de roles vacío
- **THEN** esa acción se considera autorizada para cualquier rol con sesión activa

### Requirement: Permisos aún no declarados

El sistema SHALL tratar una sección sin permisos declarados —por ausencia de la sección o por ausencia de la acción dentro de su objeto— como si no tuviera ninguna restricción, hasta que el servidor la declare.

#### Scenario: Sección sin permisos

- **WHEN** una sección todavía no ha recibido permisos del servidor
- **THEN** todas sus acciones permanecen visibles y sin aviso de restricción

#### Scenario: Objeto de permisos incompleto

- **WHEN** el objeto de permisos de una sección trae solo algunas de las acciones
- **THEN** las acciones ausentes permanecen visibles y sin aviso de restricción

### Requirement: Ocultación de acciones no autorizadas

El sistema SHALL ocultar el control de cada acción no autorizada en todos los lugares donde ese control aparezca en la sección: alta contextual de la vista, botones de cabecera, menú de opciones de cada resultado, enlaces de alta de la navegación lateral y
botones de alta de las tarjetas.

#### Scenario: Crear no autorizado

- **WHEN** el rol de la sesión no está autorizado a crear en una sección
- **THEN** los controles de alta de esa sección no se muestran

#### Scenario: Editar o borrar no autorizado

- **WHEN** el rol de la sesión no está autorizado a editar o a borrar en una sección
- **THEN** las entradas de editar y de borrar del menú de opciones de esa sección no se muestran

#### Scenario: Acción autorizada

- **WHEN** el rol de la sesión está autorizado a una acción
- **THEN** su control se muestra igual que sin restricciones de permisos

### Requirement: Aviso de permisos bajo el título

El sistema SHALL mostrar bajo el título de cada sección restringida un texto que indica al usuario que solo tiene ciertos permisos, con el color de peligro de la paleta de colores, y SHALL omitirlo en las secciones sin restricción.

#### Scenario: Sección restringida

- **WHEN** el rol de la sesión no puede alguna acción de la sección que se está viendo
- **THEN** el aviso aparece debajo del título de esa sección renderizado con `--color-danger`

#### Scenario: Sección sin restricciones

- **WHEN** el rol de la sesión puede todas las acciones de la sección
- **THEN** no se muestra ningún aviso bajo su título

#### Scenario: Sección aún sin permisos

- **WHEN** la sección todavía no ha recibido permisos del servidor
- **THEN** no se muestra ningún aviso bajo su título

### Requirement: Vigencia de los permisos

El sistema SHALL conservar los permisos recibidos mientras la sesión siga activa —incluida una recarga de página— y SHALL descartarlos al cerrar la sesión, de modo que una sesión posterior no herede los de la anterior.

#### Scenario: Recarga de página

- **WHEN** el usuario recarga la página con la sesión activa
- **THEN** las secciones restringidas siguen restringidas sin esperar una respuesta nueva

#### Scenario: Cierre de sesión

- **WHEN** se cierra la sesión
- **THEN** los permisos guardados quedan vacíos

#### Scenario: Otro usuario en el mismo navegador

- **WHEN** un usuario distinto inicia sesión en el mismo navegador
- **THEN** las secciones se evalúan con los permisos de la nueva sesión, sin residuos de la anterior
