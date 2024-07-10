<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide section--no-border">
					<div class="section__top">
						<h1 class="section__title">Lista de clientes</h1>
						<span class="section__help-text">Solicita a tu cliente la constancia de situación fiscal para agregar de forma correcrta su información. Selecciona si es una persona física o una persona moral para iniciar el registro.</span>
					</div>
					<div class="section__content">
						<div class="results">
							<div class="results__result result" v-for="customer in customers">
								<div class="result__data">
									<h3 class="result__title" v-text="customer.razon_social"></h3>
									<span class="result__description" v-text="customer.rfc"></span>
									<span class="result__info" v-text="customer.alias"></span>
								</div>
								<button class="btn btn__icon btn__icon--regular btn__icon--rounded">
									<svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="12" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="12" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
									<div class="result-actions">
										<span class="result-actions__triangle"></span>
										<router-link :to="{name: 'customerView', params: {id: customer.id}}" class="result-actions__option">
											<svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z" stroke="currentColor" stroke-width="1.5"/><path d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z" stroke="currentColor" stroke-width="1.5"/><path d="M15 16.9585L22 16.9585" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 6.9585L2 6.9585" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 16.9585L4 16.9585" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 6.9585L20 6.9585" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
											<span>Editar</span>
										</router-link>

										<button class="result-actions__option">
											<svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" stroke-width="1.5"/></svg>
											<span>Eliminar</span>
										</button>
									</div>
								</button>
								<!--	
								-->
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
import paginationContainer from '../partials/pagination.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const customers = ref([])
const pagination = ref(null)
const maxResults = ref(12)

getCustomers()

watch(() => route.path, () => {
	customers.value = []
	getCustomers()
})

function getCustomers() {
	new apiRequest().Get({
		module: 'customers',
		params: `?page=${route.params.page}&limit=${maxResults.value}`
	}).then(r => {
		customers.value = r.data.data
		pagination.value = r.data.pagination ? r.data.pagination : null
	}).catch(e => {
		store.push_alert(e.data)
	})
}
</script>

<style lang="sass" scoped>
@import "../../assets/sass/components/_results.sass"
</style>
