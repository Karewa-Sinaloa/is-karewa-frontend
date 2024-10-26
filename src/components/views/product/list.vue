<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide section--no-border">
					<div class="section__top">
						<h1 class="section__title">Lista de productos</h1>
						<span class="section__help-text">Visualiza el listado de tus productos disponibles.</span>
					</div>
					<div class="section__content">
						<div class="results">
							<div class="results__result result" v-for="product in products">
								<div class="result__data">
									<h3 class="result__title" v-text="product.name"></h3>
									<span class="result__description" v-text="product.description"></span>
									<span class="result__info" v-text="product.product_category"></span>
								</div>
								<result-options :optionList="{go: {name: 'productEdit', params: {id: product.id}}, delete: true}" @deleteItem="confirmDelete = true, productId = product.id"></result-options>
							</div>
						</div>
						<pagination-container v-if="pagination" :data="pagination" module="productList"></pagination-container>
					</div>	
				</section>
			</main>
		</div>
		<confirmation-popup :data="categoryDeleteConfirmationData" @confirmed="productDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useAppStore } from '../../../store/index.js'
import sidebarComponent from '../../partials/sidebar.vue'
import contentHeader from '../../partials/content_header.vue'
import { useRouter, useRoute } from 'vue-router'
import { apiRequest } from '../../../api/requests.js'
import confirmationPopup from '../../partials/confirmation_popup.vue'
import resultOptions from '../../partials/result_options.vue'
import paginationContainer from '../../partials/pagination.vue'

const categoryDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar esta categoría? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const productId = ref(null)
const products = ref([])
const pagination = ref(null)
const maxResults = ref(12)
const currentPage = ref(1)
const confirmDelete = ref(false)

onMounted(() => {
	store.new_elements([
		{
			name: 'productAdd',
			text: 'Agregar Producto'	
		}
	])
})

getProducts()

watch(() => route.path, () => {
	currentPage.value = route.params.page ? route.params.page : 1
	products.value = []
	getProducts()
})

function getProducts() {
	new apiRequest().Get({
		module: 'products/products',
		params: `?page=${currentPage.value}&limit=${maxResults.value}`
	}).then(r => {
		products.value = r.data.data
		pagination.value = r.data.pagination ? r.data.pagination : null
	}).catch(e => {
		store.push_alert(e.data)
	})
}

function productDelete() {
	new apiRequest().Delete({
		module: 'products/products'
	}, productId.value).then(
		response => {
			productId.value = null
			store.push_alert(response.data)
			router.push({
				name: 'productList'
			})
		}
	).catch(error => {
		productId.value = null
		store.push_alert(error.data)
	})
}
</script>

<style lang="sass" scoped>
@use "../../../assets/sass/components/_results.sass"
</style>
