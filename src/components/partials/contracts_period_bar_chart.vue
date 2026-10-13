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
	import { formatCurrency, readChartPalette } from '../../helpers/contracts_chart_data.js';

	use([BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, LabelLayout, SVGRenderer]);

	const props = defineProps({
		data: { type: Array, default: () => [] },
	});

	// La paleta se lee de :root al montar (D5): sin literales de color en el componente.
	const palette = ref({ colors: [] });
	onMounted(() => {
		palette.value = readChartPalette();
	});

	const chartLabel = computed(() => {
		const totals = props.data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
		return `Contratos por periodo fiscal: suma del monto total con impuestos por periodo. ${props.data.length} periodos, monto total ${formatCurrency(totals)}.`;
	});

	const chartOption = computed(() => {
		const colors = palette.value.colors || [];
		return {
			aria: { description: chartLabel.value },
			grid: { top: 24, right: 24, bottom: 8, left: 8, containLabel: true },
			tooltip: { trigger: 'axis', valueFormatter: value => formatCurrency(value) },
			xAxis: {
				type: 'category',
				data: props.data.map(item => item.periodName),
				axisLine: { lineStyle: { color: palette.value.axis } },
				axisLabel: { color: palette.value.text, interval: 0, rotate: 30 },
			},
			yAxis: {
				type: 'value',
				axisLabel: { color: palette.value.text, formatter: value => formatCurrency(value) },
				splitLine: { lineStyle: { color: palette.value.splitLine } },
			},
			series: [
				{
					type: 'bar',
					name: 'Monto total',
					data: props.data.map(item => Number(item.total) || 0),
					barMaxWidth: 48,
					itemStyle: { color: colors[0] },
					label: { show: true, position: 'top', formatter: params => formatCurrency(params.value) },
				},
			],
		};
	});
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_home_charts.sass"
</style>
