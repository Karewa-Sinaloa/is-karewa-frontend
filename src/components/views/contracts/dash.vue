<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
        <contracts-procedures/>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '../../../store/index.js'
import sidebarComponent from '../../partials/sidebar.vue'
import contentHeader from '../../partials/content_header.vue'
import ContractsProcedures from './procedimientos.vue'

const store = useAppStore()

const companyCreated = computed(() => {
	return store.company != null ? true : false
})

</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_widgets.sass"
</style>
