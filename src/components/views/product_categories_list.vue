<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide section--no-border">
					<div class="section__top">
						<h1 class="section__title">Lista de categorias</h1>
						<span class="section__help-text">Listado de las categoría disponibles para relacionar tu producto.</span>
					</div>
					<div class="section__content">
						<div class="results">
							<div class="results__result result" v-for="category in categories">
								<div class="result__data">
									<h3 class="result__title" v-text="category.name"></h3>
								</div>
								<result-options :optionList="{go: {name: 'categoryEdit', params: {id: category.id}}, delete: true}"></result-options>
							</div>
						</div>
						<pagination-container v-if="pagination" :data="pagination"></pagination-container>
					</div>	
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import { useRouter, useRoute } from 'vue-router'
import { apiRequest } from '../../api/requests.js'
import confirmationPopup from '../partials/confirmation_popup.vue'
import resultOptions from '../partials/result_options.vue'
import paginationContainer from '../partials/pagination.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const categories = ref([])
const pagination = ref(null)
const maxResults = ref(12)
const currentPage = ref(1)

onMounted(() => {
	store.new_elements([
		{
			name: 'categoryAdd',
			text: 'Agregar categoría'	
		}
	])
})

getCategories()

watch(() => route.path, () => {
	currentPage.value = route.params.page ? route.params.page : 1
	categories.value = []
	getCategories()
})

function getCategories() {
	new apiRequest().Get({
		module: 'products/categories',
		params: `?page=${currentPage.value}&limit=${maxResults.value}`
	}).then(r => {
		categories.value = r.data.data
		pagination.value = r.data.pagination ? r.data.pagination : null
	}).catch(e => {
		store.push_alert(e.data)
	})
}
</script>

<style lang="sass" scoped>
@import "../../assets/sass/components/_results.sass"
</style>
