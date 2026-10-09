# Spec Delta

## ADDED Requirements

### Requirement: Permisos de autorización en las respuestas

El sistema SHALL extraer de cada respuesta autenticada que incluya `allowed_roles` los roles autorizados para crear, editar y borrar en el recurso de esa petición, y SHALL entregarlos al store sin alterar los permisos ya conocidos de otras secciones.

#### Scenario: Respuesta con permisos

- **WHEN** una respuesta autenticada incluye `allowed_roles`
- **THEN** sus conjuntos de roles por acción quedan registrados para la sección correspondiente al recurso consultado

#### Scenario: Respuesta sin permisos

- **WHEN** una respuesta autenticada no incluye `allowed_roles`
- **THEN** los permisos ya conocidos de esa sección quedan intactos y no se registra ninguna restricción nueva

#### Scenario: Respuesta de error

- **WHEN** una petición falla o devuelve un error
- **THEN** no se actualizan los permisos de ninguna sección
