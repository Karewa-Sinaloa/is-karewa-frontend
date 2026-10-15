<template>
	<div
		class="chart-panel__figure"
		role="img"
		:aria-label="chartLabel"
	>
		<v-chart
			class="chart-panel__chart"
			:option="chartOption"
			autoresize
		/>
	</div>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue';
	import { use } from 'echarts/core';
	import { BarChart } from 'echarts/charts';
	import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
	import { LabelLayout } from 'echarts/features';
	import { SVGRenderer } from 'echarts/renderers';
	import VChart from 'vue-echarts';
	import { formatCurrency, readChartPalette, readQuarterColors } from '../../helpers/contracts_chart_data.js';

	use([BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, LabelLayout, SVGRenderer]);

	const props = defineProps({
		data: { type: Array, default: () => [] },
	});

	// Etiquetas y orden de los cuatro trimestres dentro de cada año.
	const QUARTERS = [
		{ key: 'Q1', label: 'T1' },
		{ key: 'Q2', label: 'T2' },
		{ key: 'Q3', label: 'T3' },
		{ key: 'Q4', label: 'T4' },
	];

	// La paleta y los colores de trimestre se leen de :root al montar (D5): sin literales de color en el componente.
	const palette = ref({ colors: [] });
	const quarterColors = ref([]);
	onMounted(() => {
		palette.value = readChartPalette();
		quarterColors.value = readQuarterColors();
	});

	const chartLabel = computed(() => {
		const totals = props.data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
		const years = props.data.map(item => item.year);
		const span = years.length > 0 ? ` de ${Math.min(...years.map(Number))} a ${Math.max(...years.map(Number))}` : '';
		return `Contratos por año y trimestre${span}: suma del monto total con impuestos. ${props.data.length} años, monto total ${formatCurrency(totals)}.`;
	});

	const chartOption = computed(() => {
		return {
			aria: { description: chartLabel.value },
			// Leyenda al fondo para liberar la banda superior, reservada con grid.top al anclar el tooltip ahí (top:4) y así nunca pisar las barras.
			legend: { bottom: 0, type: 'scroll', textStyle: { color: palette.value.text } },
			// grid.top deja una banda superior del alto máximo del tooltip: el área de trazado empieza por debajo de él, por lo que la serie T4 jamás queda tapada al hacer hover.
			grid: { top: 108, right: 24, bottom: 34, left: 8, containLabel: true },
			// Tooltip fijo en la banda superior reservada, confinado al lienzo y centrado sobre el año bajo el cursor: al no seguir al cursor sobre las barras, ninguna serie se oculta.
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' },
				confine: true,
				extraCssText: 'font-size:12px; padding:4px 8px; max-height:96px; overflow:auto;',
				position: (point, params, dom, rect, size) => {
					const [contentWidth] = size.contentSize;
					const viewWidth = size.viewSize[0];
					const left = Math.min(Math.max(4, point[0] - contentWidth / 2), viewWidth - contentWidth - 4);
					return { top: 4, left };
				},
				valueFormatter: value => formatCurrency(value),
			},
			xAxis: {
				type: 'category',
				data: props.data.map(item => item.year),
				axisLine: { lineStyle: { color: palette.value.axis } },
				axisLabel: { color: palette.value.text, interval: 0 },
			},
			yAxis: {
				type: 'value',
				axisLabel: { color: palette.value.text, formatter: value => formatCurrency(value) },
				splitLine: { lineStyle: { color: palette.value.splitLine } },
			},
			series: QUARTERS.map((quarter, index) => ({
				name: quarter.label,
				type: 'bar',
				data: props.data.map(item => Number(item[quarter.key]) || 0),
				barMaxWidth: 40,
				itemStyle: { color: quarterColors.value[index] },
			})),
		};
	});
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_home_charts.sass"
</style>
