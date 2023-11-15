<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide">
					<h1 class="section__title">Lista de clientes</h1>
					<span class="section__help-text">Solicita a tu cliente la constancia de situación fiscal para agregar de forma correcrta su información. Selecciona si es una persona física o una persona moral para iniciar el registro.</span>	
					<div class="results">
						<div class="results__result result" v-for="customer in customers">
							<div class="result__data">
								<h3 class="result__title" v-text="customer.razon_social"></h3>
								<span class="result__description" v-text="customer.rfc"></span>
								<span class="result__info" v-text="customer.alias"></span>
							</div>
							<div class="result__actions">
								<router-link :to="{name: 'customerView', params: {id: customer.id}}" class="btn btn__transparent btn--small">
									<span class="material-symbols-outlined">page_info</span>
								</router-link>

								<button class="btn btn__transparent btn--small">
									<span class="material-symbols-outlined">delete</span>
								</button>
							</div>
						</div>
					</div>
					<pagination-container v-if="pagination" :data="pagination"></pagination-container>
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
import paginationContainer from '../partials/pagination.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const customers = ref([])
const pagination = ref(null)

getCustomers()

function getCustomers() {
	new apiRequest().Get({
		module: 'customers',
		params: '?page=1&limit=12'
	}).then(r => {
		customers.value = r.data.data
		pagination.value = r.data.pagination ? r.data.pagination : null
	}).catch(e => {
		store.push_alert(e.data)
	})
}
</script>

<style lang="sass" scoped>
</style>
