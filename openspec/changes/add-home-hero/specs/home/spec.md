# Spec Delta

## MODIFIED Requirements

### Requirement: Pantalla de bienvenida

El sistema SHALL mostrar en la vista de inicio la presentación del Monitor Karewa: en la ruta pública de inicio (`/`), un hero de portada fullwidth con proporción 3:1, imagen de fondo adaptativa por `<picture>` (imagen de escritorio para viewports de 1024px o más e imagen móvil para menores), overlay oscuro de contraste y el título "Somos Monitor Karewa" con su texto descriptivo; en la ruta de inicio autenticada (`/admin`), el widget de bienvenida con el título "Bienvenidos" y el texto descriptivo del sistema, junto a la navegación lateral y el encabezado de contenido.

#### Scenario: Acceso con sesión

- **WHEN** un usuario con sesión navega al inicio
- **THEN** ve la navegación lateral, el encabezado y el widget de bienvenida

#### Scenario: Contenido del widget

- **WHEN** se muestra la vista de inicio autenticada
- **THEN** el widget presenta el título "Bienvenidos" y la descripción de Karewa como sistema de monitoreo de cuentas públicas

#### Scenario: Portada pública

- **WHEN** un visitante sin sesión navega a la vista pública de inicio
- **THEN** ve el encabezado público y, debajo, el hero fullwidth con el título "Somos Monitor Karewa" y su texto descriptivo sobre la imagen de fondo con overlay oscuro

#### Scenario: Imagen de fondo según tamaño de pantalla

- **WHEN** se muestra el hero de la portada pública
- **THEN** la etiqueta `<picture>` sirve la imagen de escritorio (`src/assets/images/hero_home.webp`) en viewports de 1024px o más y la imagen móvil (`src/assets/images/hero_home_mobile.webp`) en viewports menores a 1024px
