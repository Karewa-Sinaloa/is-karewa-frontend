<template>
	<template v-if="entries === null">
		<section class="section section--wide section--no-border">
			<div class="section__top">
				<h1 class="section__title">Parámetros de configuración</h1>
			</div>
			<div class="section__content">
				<span class="results__loading">Cargando parámetros de configuración....</span>
			</div>
		</section>
	</template>
	<template v-else-if="entries.length === 0">
		<section class="section section--wide section--no-border">
			<div class="section__top">
				<h1 class="section__title">Parámetros de configuración</h1>
				<span class="section__help-text">Consulta y edita los parámetros con los que opera el sistema.</span>
			</div>
			<div class="section__content">
				<div class="results">
					<p class="results__no-results">No se encontraron parámetros de configuración</p>
				</div>
			</div>
		</section>
	</template>
	<template v-else>
		<config-card
			v-for="entry in entries"
			:key="entry.id"
			:entry="entry"
			@changed="getConfigs"
		/>
	</template>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useAppStore } from '../../../store/index.js';
	import { apiRequest } from '../../../api/requests.js';
	import configCard from './config_card.vue';

	const store = useAppStore();
	const entries = ref(null);

	onMounted(() => {
		getConfigs();
	});

	function getConfigs() {
		entries.value = null;
		new apiRequest()
			.Get({
				module: 'config',
				params: '?page=1&limit=99&sort=+name',
			})
			.then(response => {
				entries.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
				entries.value = [];
			});
	}
</script>
