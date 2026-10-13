# Notas de CFD APP Frontend

Aquí encontrarás notas importantes sobre el avance, cambios, ajustes, ideas o bien donde fue el último punto donde quedo el avance de la programación para poder retomarla al regreso

## Dependencias nuevas

- `echarts` (npm) — Librería de gráficas; en este proyecto solo se registran `BarChart`, `PieChart`, `GridComponent`, `TooltipComponent`, `LegendComponent`, `TitleComponent` y `LabelLayout` desde `echarts/core` para limitar el peso del bundle. Uso: gráficas de barras y pastel de la portada pública de inicio.
- `vue-echarts` (npm) — Adaptador de ECharts para Vue 3; expone el componente `<v-chart>` usado por `contracts_period_bar_chart.vue` y `procedures_pie_chart.vue`.

