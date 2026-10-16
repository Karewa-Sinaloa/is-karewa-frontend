# public-home-hero Specification

## Purpose

TBD — Update Purpose after archive.

## Requirements

### Requirement: Portada hero de la vista pública de inicio

El sistema SHALL mostrar en la vista pública de inicio, debajo del encabezado público, un hero de portada fullwidth con proporción 3:1 que presenta al Monitor Karewa con un título y un texto descriptivo sobre la imagen de fondo.

#### Scenario: Renderizado de la portada

- **WHEN** un visitante navega a la vista pública de inicio
- **THEN** se muestra el hero debajo del encabezado público, ocupa el ancho completo de la ventana y mantiene una proporción de 3:1 entre ancho y alto

#### Scenario: Contenido del hero

- **WHEN** se muestra el hero
- **THEN** presenta un título "Somos Monitor Karewa" y el párrafo que describe la plataforma como una iniciativa digital e independiente de vigilancia ciudadana del gasto y las contrataciones públicas

### Requirement: Imagen de fondo adaptativa por tamaño de pantalla

El sistema SHALL servir la imagen de fondo estática del hero mediante la etiqueta `<picture>`, seleccionando la imagen de escritorio para viewports de 1024px o más y la imagen móvil para viewports menores a 1024px.

#### Scenario: Viewport de 1024px o más

- **WHEN** el viewport tiene 1024px o más de ancho
- **THEN** el hero muestra la imagen de fondo de escritorio (`src/assets/images/hero_home.webp`)

#### Scenario: Viewport menor a 1024px

- **WHEN** el viewport tiene menos de 1024px de ancho
- **THEN** el hero muestra la imagen de fondo móvil (`src/assets/images/hero_home_mobile.webp`)

### Requirement: Overlay oscuro de contraste

El sistema SHALL aplicar un overlay oscuro sobre la imagen de fondo del hero para que el texto superpuesto mantenga contraste suficiente contra la imagen en cualquier tamaño de pantalla.

#### Scenario: Texto legible sobre la imagen

- **WHEN** el hero se renderiza con cualquier imagen de fondo
- **THEN** un overlay oscuro cubre la imagen y el título y el párrafo se muestran en color claro encima del overlay

### Requirement: Imagen de fondo decorativa

El sistema SHALL tratar la imagen de fondo del hero como decorativa para los lectores de pantalla, ya que su información la aporta el texto superpuesto.

#### Scenario: Anuncio por lector de pantalla

- **WHEN** un lector de pantalla recorre el hero
- **THEN** anuncia el título y el párrafo de presentación sin anunciar la imagen de fondo
