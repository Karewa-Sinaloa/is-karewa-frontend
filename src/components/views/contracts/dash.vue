<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<div class="main__dash-grid">
					<contracts-procedures />
					<contracts-materia />
					<contracts-estatus />
					<contract-type />
					<unit-types />
					<contract-periods />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { useAppStore } from '../../../store/index.js';
	import sidebarComponent from '../../partials/sidebar.vue';
	import contentHeader from '../../partials/content_header.vue';
	import ContractsProcedures from './procedimientos.vue';
	import ContractsMateria from './materia.vue';
	import ContractsEstatus from './estatus.vue';
	import ContractType from './tipo.vue';
	import UnitTypes from './unit_types.vue';
	import ContractPeriods from './periodos.vue';
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_widgets.sass"
</style>
