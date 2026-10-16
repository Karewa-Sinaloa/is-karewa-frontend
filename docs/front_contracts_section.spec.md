# Seccion de contratos de la vista publica

Este es un documento de especificaciones del desarrollador de como debe estar estructurada y diseñada la vista de contratos en la vista pública de la aplicación. A continuación se detallan los elementos y funcionalidades que deben estar presentes en esta
sección.

## Seccion de encabezado

Es la seccion donde estará el titulo, descripcion, botones y seccion de filtros.

### Caracteristicas

- Fondo blanco y bordes redondeados como ya se utilizan en la aplicación.
- No debe estar pegado a los border laterales ni a las secciones superiores o inferiores
- Titulo: `Contratos`
- Texto: `Aquí podrás encontrar la lista de todos los contratos que han sido firmados, Si quieres consultar los detalles de un contraro haz clic en “Ver más”, utiliza los filtros para poder ver información mas especifica.` (Mejora la redaccion de este texto
  para que se vea profesional y claro)
- Alineado al titulo pero justificado a la derecha deja una seccion para botones, como por ejemplo: `Descargar informacio` (Solo deja el boton, luego se le dara funcionalidad)
- Debajo de todo esto ira una seccion de fitros identica a la de el home publico, reutiliza esa misma, adicionalmente agrega un campo de busqueda libre como la que ya se implemento en la seccion privada del cms en los contratos, este campo debe estar alineado
  a la derecha y debe tener un placeholder que diga: `Buscar contrato por nombre, unidad o estado...`

#### Filtros

Al igual que en la vista de home publico, deben tener los mismos campos de filtros, obtendran los mismos datos de contratos solo que en lugar de mostrar graficas aqui solo se mostrará un listado de contratos, adicionalmente se debe agregar un campo de busqueda
libre como la que ya se implemento en la seccion privada del cms en los contratos, este campo debe estar alineado a la derecha y debe tener un placeholder que diga: `Buscar contrato por nombre, unidad o estado...`

## Seccion de datos generales

Esta seccion mostrara tarjetas de informacion general de los contratos las cuales serán:

- Monto total: Monto total de todos los contratos firmados que fueron devueltos en la consulta.
- Monto total de contratos por Licitación pública
- Monto total de contratos por Invitación
- Monto total de contratos por Adjudicación Directa

Esta seccion no tiene color de fondo pero cada tarjeta si lo tendrá, las tarjetas deben estar alineadas horizontalmente y tener un tamaño uniforme, con un icono representativo de cada tipo de monto. Cada tarjeta debe mostrar el monto en un formato claro y
legible, así como una breve descripción del tipo de contrato que representa.

Estos montos deben ser obtenidos desde el backend y deben actualizarse cada vez que se realice una nueva consulta o se apliquen filtros o busquedas.

## Seccion de listado de contratos

Esta seccion mostrara un listado de todos los contratos firmados que fueron devueltos en la consulta, seran mostrados en formato de tabla com paginacion de 12 elementos por pagina, con la posibilidad de cambiar el numero de elementos a mostrar por pagina a 24,
48 y 96. La tabla debe tener las mismas columnas que la tabla de contratos en la seccion privada del cms, pero sin la columna de acciones, ya que no se podra realizar ninguna accion sobre los contratos desde esta vista publica. Adicionalmente, cada fila de la
tabla debe tener un boton de `Ver más` que redirija a una vista detallada del contrato seleccionado. unicamente que este boton estará en la columna inicial de la tabla y no en la columna final como en la vista privada del cms. La tabla debe ser responsiva y
adaptarse a diferentes tamaños de pantalla, manteniendo la legibilidad y accesibilidad de los datos. La fila de los nombres de las columnas debe estar fija al hacer scroll vertical, para que siempre se pueda identificar a que corresponde cada columna. Tambien
se debe poder hacer scroll horizontal en caso de que la tabla tenga muchas columnas y no quepa en la pantalla, para que se pueda ver toda la informacion sin perder la legibilidad.

### Paginacion y numero de elementos por pagina

Bajo la tabla se debe mostrar un componente de paginacion que permita navegar entre las diferentes paginas de resultados, asi como un selector para cambiar el numero de elementos a mostrar por pagina a 12, 24, 48 y 96. El componente de paginacion debe ser
claro y facil de usar, con botones para ir a la primera, anterior, siguiente y ultima pagina, asi como un indicador del numero de pagina actual y el total de paginas disponibles. se debe utilizar estos valores de numero de resultados ya que multiplos de 12
permiten una mejor visualizacion de los datos y no se veran filas incompletas en la tabla.

### Numero total de resultados

Debajo de la tabla y del componente de paginacion, se debe mostrar un texto que indique el numero total de resultados encontrados en la consulta, para que el usuario tenga una idea clara de cuantos contratos se han encontrado y pueda ajustar sus filtros o
busquedas en caso de ser necesario. Este valor vendra desde el backend y debe actualizarse cada vez que se realice una nueva consulta o se apliquen filtros o busquedas.

## Estilo grafico y visual

- Cada seccion debe estar separada de la otra de forma vertical de forma que se note la diferencia entre ellas, pero sin que se vea un espacio demasiado grande entre ellas.
- Los cada tipo de adjudicacion tendrá un color asignado en cual deberá ser utilizado en bordes o fondos dependiendo de la necesidad.
- Colores: (Ver en la paleta de colores de la aplicacion)
  - Adjudicación Directa: `Rojo`
  - Invitación: `Amarillo`
  - Licitación Pública: `Verde`
  - Totales: `Azul`
- Utilizar formatos numericos y de moneda utilizando pesos mexicanos como base
- Continuar el estilo visual y grafico que ya se utiliza en la aplicacion, como tipografias, tamaños de texto, colores, bordes, sombras, etc. para mantener una coherencia visual en toda la aplicacion.
