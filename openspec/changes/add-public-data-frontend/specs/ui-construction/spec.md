# Spec Delta

> Este delta documenta reglas de construcción de UI como guía para una futura superficie pública. No debe interpretarse como instrucción inmediata de crear parciales, vistas o estilos.

## MODIFIED Requirements

### Requirement: Reutilización de los parciales compartidos
El sistema SHALL componer las secciones con los parciales compartidos ya existentes de su superficie correspondiente: el panel administrativo reutiliza navegación lateral, encabezado de contenido, notificaciones, popups, popup de confirmación, indicador de carga, paginación, opciones de resultado y ayuda; el frontend público reutiliza su propio header, menú y footer compartidos antes de crear equivalentes nuevos.

#### Scenario: Sección nueva compuesta
- **WHEN** se crea una sección nueva del panel administrativo
- **THEN** reutiliza la navegación lateral y el encabezado de contenido compartidos en lugar de recrearlos

#### Scenario: Sección pública compuesta
- **WHEN** se crea una sección nueva del frontend público
- **THEN** reutiliza el header, el menú y el footer públicos compartidos en lugar de implementar variantes duplicadas

#### Scenario: Diálogo o confirmación
- **WHEN** una vista necesita confirmar una acción o mostrar un diálogo
- **THEN** usa los parciales de popup/confirmación existentes en lugar de implementar un modal propio

### Requirement: Registro de secciones nuevas en la navegación
El sistema SHALL registrar cada sección nueva en la navegación compartida de la superficie a la que pertenece: el panel administrativo la expone en la navegación lateral con enlaces por nombre de ruta a su listado y a su alta, y el frontend público la expone en su menú público sin depender de sidebar.

#### Scenario: Sección registrada
- **WHEN** una sección nueva del panel queda declarada en el router
- **THEN** la navegación lateral muestra sus enlaces de listado y de alta

#### Scenario: Sección pública registrada
- **WHEN** una sección nueva del frontend público queda declarada en el router
- **THEN** el menú público incorpora el enlace correspondiente a esa vista sin usar la navegación lateral administrativa

#### Scenario: Enlace por nombre de ruta
- **WHEN** una navegación compartida enlaza una sección
- **THEN** lo hace por el nombre de la ruta declarada, no por la URL en texto

## ADDED Requirements

### Requirement: Hojas de estilo separadas para la superficie pública
El sistema SHALL mantener los estilos del frontend público en archivos Sass separados de los del panel administrativo, reutilizando los mismos tokens y objetos compartidos sin mezclar reglas específicas de ambas superficies en una sola hoja.

#### Scenario: Estilo específico del frontend público
- **WHEN** una vista o parcial público necesita estilos propios
- **THEN** sus reglas viven en archivos Sass específicos de la superficie pública y consumen los tokens y objetos compartidos mediante `@use`

#### Scenario: Estilo del panel sin contaminación pública
- **WHEN** se revisan las hojas del panel administrativo
- **THEN** no contienen reglas exclusivas del header, menú o footer del frontend público
