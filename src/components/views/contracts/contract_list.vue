<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide section--no-border">
					<div class="section__top">
						<h1 class="section__title">Listado de contratos</h1>
						<span class="section__help-text">Aquí podrás ver el listado de todos los contratos registrados en el sistema.</span>
					</div>
					<div
						class="section__content"
						v-if="contracts && contracts.length > 0"
					>
						<div class="results">
							<div
								class="results__result result"
								v-for="contract in contracts"
								:key="contract.id"
							>
								<div class="result__data">
									<h3 class="result__title">{{ contract.contract_id }}</h3>
								</div>
								<result-options
									:optionList="{ go: { name: 'contractView', params: { id: contract.id } }, delete: true }"
									@deleteItem="deleteConfirmation(contract.id)"
								></result-options>
							</div>
						</div>
						<confirmation-popup
							:data="contractDeleteConfirmationData"
							@confirmed="contractDelete"
							@declined="((confirmDelete = false), (itemToDelete = null))"
							v-if="confirmDelete"
						></confirmation-popup>
						<pagination-container
							v-if="pagination"
							:data="pagination"
							module="contractList"
						></pagination-container>
					</div>
					<div
						class="section__content"
						v-else-if="contracts && contracts.length === 0"
					>
						<div class="results">
							<p class="results__no-results">No se encontraron contratos.</p>
							<button
								class="btn btn--small btn__default btn__default--primary"
								@click="router.push({ name: 'contractCreate' })"
							>
								<icon-set icon="add" />
								Crear nuevo contrato
							</button>
						</div>
					</div>
					<div
						class="section__content"
						v-else
					>
						<span class="results__loading">Cargando contratos...</span>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
	import sidebarComponent from '../../partials/sidebar.vue';
	import contentHeader from '../../partials/content_header.vue';
	import { onMounted, ref, watch, computed } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { useAppStore } from '../../../store/index.js';
	import { apiRequest } from '../../../api/requests.js';
	import confirmationPopup from '../../partials/confirmation_popup.vue';
	import resultOptions from '../../partials/result_options.vue';
	import paginationContainer from '../../partials/pagination.vue';

	const store = useAppStore();
	const router = useRouter();
	const route = useRoute();
	const contracts = ref(null);
	const confirmDelete = ref(false);
	const pagination = ref(null);
	const maxResults = ref(12);
	const itemToDelete = ref(null);
	const page = ref(
		computed(() => {
			return route.params.page ? parseInt(route.params.page) : 1;
		})
	);

	const contractDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar este contrato? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};

	onMounted(() => {
		store.new_elements([{ name: 'contractCreate', text: 'Nuevo contrato' }]);
		getContracts();
	});

	watch(
		() => route.path,
		() => {
			getContracts();
		}
	);

	function getContracts() {
		new apiRequest()
			.Get({
				module: 'contracts',
				params: `?page=${page.value}&limit=${maxResults.value}`,
			})
			.then(response => {
				contracts.value = response.data.data;
				pagination.value = response.data.pagination ? response.data.pagination : null;
			})
			.catch(error => {
				store.push_alert(error.data);
				if (error.data.http_code !== 404) {
					router.push({ name: 'homeView' });
				}
				contracts.value = [];
			});
	}

	const deleteConfirmation = id => {
		confirmDelete.value = true;
		itemToDelete.value = id;
	};

	function contractDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'contracts',
				},
				itemToDelete.value
			)
			.then(response => {
				confirmDelete.value = false;
				contracts.value = contracts.value.filter(contract => contract.id !== itemToDelete.value);
				store.push_alert(response.data);
			})
			.catch(error => {
				confirmDelete.value = false;
				store.push_alert(error.data);
			});
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_results.sass"
</style>
