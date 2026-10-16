# Solicitud de cambios del desarrollador

Este documento no es una especificacion ni debe utilizarse como tal o como una guia de desarrollo. Este archivo es una lista de peticiones de cambios con explicacion y checklist que será utilizado para generar especificaciones a partir de este con openspec.
las nuevas especificaciones solo deben tomar en cuenta los elementos no marcados en el checklist. Al crear la especificacion con openspec se debe marcar los elementos en el checklist que ya fueron transformados en especificaciones para que no se generen
nuevamente. Cada elemento del checklist puede estar conectado por medio de un anchor a una seccion de este documento que explique el cambio solicitado.

## Checklist

1. [x] [Totales de contratos](#totales-de-contratos)

### Totales de contratos

Cambiar la forma en que se generan los totales de los contratos y se muestran en las gŕaficas, actualmente el frontend realiza el calculo de los totales que se muestran en las graficas, este cambio propone no realizar estos calculos en el frontend y tomarlos
desde la consulta del api donde vendran, esto tambien estara especificado en openspec

#### Detalle

- Dejar de calcular los totales en el frontend y tomarlos desde la consulta del api.
- Borrar cualquier referencia al calculo local de los totales en el frontend.
- Utilizar los totales que vienen en la respuesta del api para mostrarlos en las graficas.
