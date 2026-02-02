<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<div class="widget widget--default">
					<h2 class="widget__heading2">Bienvenidos</h2>
					<span class="widget__help">Karewa es un sistema de monitoreo de cuentas públicas que permite un mejor control del gasto público</span>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'

const store = useAppStore()

const companyCreated = computed(() => {
	return store.company != null ? true : false
})

</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_widgets.sass"
</style>
