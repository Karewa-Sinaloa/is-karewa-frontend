# Spec Delta

## ADDED Requirements

### Requirement: Rutas de nuevas secciones con CRUD

El sistema SHALL exponer para toda sección nueva con alta, consulta y edición tres rutas: listado en `/seccion`, alta en `/seccion/nuevo` y edición en `/seccion/:id`, con nombre de ruta camelCase derivado del módulo y con la misma protección `meta.login` que
el resto de la aplicación.

#### Scenario: Listado de la nueva sección

- **WHEN** se registra una sección nueva con módulo `/facturas`
- **THEN** `/facturas` muestra su listado y su ruta de nombre camelCase (`facturasList`) enlaza al listado

#### Scenario: Alta y edición

- **WHEN** la sección nueva admite dar de alta y editar
- **THEN** expone `/facturas/nuevo` con nombre `facturasCreate` y `/facturas/:id` con nombre `facturasView`

#### Scenario: Protección de sesión

- **WHEN** las tres rutas de la sección nueva quedan declaradas
- **THEN** cada una lleva `meta.login: true` y el guard las protege igual que a las secciones existentes

#### Scenario: Sección sin alta por ruta

- **WHEN** una sección nueva solo admite consulta desde un listado
- **THEN** no se declaran las rutas de alta ni de edición y el listado no ofrece esas acciones
