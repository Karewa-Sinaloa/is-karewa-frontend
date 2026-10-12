# Spec Delta

## Purpose

Define el frontend público dedicado a la visualización de datos de Karewa como estado objetivo del producto: una superficie abierta al público, de solo consulta y con una estructura visual distinta al panel administrativo. Este delta describe el comportamiento deseado para una implementación futura; no ordena crear de inmediato sus componentes o vistas.

## ADDED Requirements

> Estas requirements operan como especificación guía del comportamiento objetivo. Su ejecución queda sujeta a una decisión posterior de implementación.


### Requirement: Acceso público de solo visualización
El sistema SHALL servir el frontend público sin requerir sesión y SHALL limitar esa superficie a consulta y visualización de datos, sin exponer acciones de alta, edición o administración.

#### Scenario: Acceso sin autenticación
- **WHEN** una persona navega a una ruta del frontend público sin contar con una sesión activa
- **THEN** la vista pública se muestra y no redirige al flujo de acceso del panel administrativo

#### Scenario: Superficie pública sin acciones de gestión
- **WHEN** una persona revisa la interfaz pública de visualización
- **THEN** encuentra contenido de consulta y navegación pública, pero no controles para crear, editar o eliminar registros del sistema

### Requirement: Shell público compartido
El frontend público SHALL componer sus vistas dentro de un shell común con header, menú de navegación, cuerpo principal y footer, y SHALL omitir la navegación lateral del panel administrativo.

#### Scenario: Carga de la portada pública
- **WHEN** una persona abre la entrada del frontend público
- **THEN** la interfaz muestra header, menú, contenido principal y footer dentro del mismo marco visual compartido

#### Scenario: Ausencia de sidebar administrativo
- **WHEN** se presenta una vista del frontend público
- **THEN** la navegación lateral del panel administrativo no forma parte de la composición visible

### Requirement: Consistencia entre vistas públicas
El frontend público SHALL mantener el mismo shell y la misma navegación compartida entre sus vistas de visualización, de modo que cada sección pública cambie el contenido principal sin rehacer la estructura global.

#### Scenario: Cambio entre vistas públicas
- **WHEN** una persona navega entre secciones del frontend público
- **THEN** header, menú y footer se conservan como estructura compartida y solo cambia el contenido principal de la vista seleccionada
