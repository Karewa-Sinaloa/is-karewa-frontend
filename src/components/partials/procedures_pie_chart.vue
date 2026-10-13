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
	import { PieChart } from 'echarts/charts';
	import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
	import { LabelLayout } from 'echarts/features';
	import { SVGRenderer } from 'echarts/renderers';
	import VChart from 'vue-echarts';
	import { formatCurrency, readChartPalette } from '../../helpers/contracts_chart_data.js';

	use([PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, LabelLayout, SVGRenderer]);

	const props = defineProps({
		data: { type: Array, default: () => [] },
	});

	// La paleta se lee de :root al montar (D5): sin literales de color en el componente.
	const palette = ref({ colors: [] });
	onMounted(() => {
		palette.value = readChartPalette();
	});

	// Solo las porciones con monto mayor a cero: los procedimientos sin importes no se dibujan.
	const slices = computed(() => props.data.filter(item => Number(item.total) > 0));

	const chartLabel = computed(() => {
		const totals = slices.value.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
		return `Montos por tipo de procedimiento: suma del monto total con impuestos agrupada por procedimiento. ${slices.value.length} procedimientos, monto total ${formatCurrency(totals)}.`;
	});

	const chartOption = computed(() => {
		const colors = palette.value.colors || [];
		return {
			aria: { description: chartLabel.value },
			tooltip: { trigger: 'item', valueFormatter: value => formatCurrency(value) },
			legend: { type: 'scroll', bottom: 0, textStyle: { color: palette.value.text } },
			series: [
				{
					type: 'pie',
					name: 'Monto total',
					radius: ['40%', '70%'],
					center: ['50%', '45%'],
					data: slices.value.map((item, index) => ({
						name: item.procedureName,
						value: Number(item.total) || 0,
						itemStyle: { color: colors[index % Math.max(colors.length, 1)] },
					})),
					label: {
						show: true,
						formatter: params => `${params.name}: ${formatCurrency(params.value)}`,
						color: palette.value.text,
					},
					labelLine: { lineStyle: { color: palette.value.axis } },
					labelLayout: { hideOverlap: true },
				},
			],
		};
	});
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_home_charts.sass"
</style>
