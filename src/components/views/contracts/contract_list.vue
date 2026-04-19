<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--full section--no-border">
					<div class="section__top">
						<h1 class="section__title">Listado de contratos</h1>
						<span class="section__help-text">Aquí podrás ver el listado de todos los contratos registrados en el sistema.</span>
					</div>
					<div
						class="section__content"
						v-if="contracts && contracts.length > 0"
					>
						<div class="section__scrollable">
							<table class="r-table">
								<thead class="r-table__head">
									<tr>
										<th>ID del contrato</th>
										<th>Nombre del proveedor</th>
										<th>Nombre unidad convocante</th>
										<th>Nombre unidad solicitante</th>
										<th>Materia</th>
										<th>Tipo de procedimiento</th>
										<th>Administración</th>
										<th>Estado</th>
										<th>Descripción de la obra</th>
										<th>Fecha</th>
										<th>Tipo</th>
										<th>Opciones</th>
									</tr>
								</thead>
								<tbody class="r-table__body">
									<tr
										v-for="contract in contracts"
										:key="contract.id"
									>
										<td>{{ contract.contract_id }}</td>
										<td>{{ contract.provider_name }}</td>
										<td>{{ contract.organizer_admin_unit_name }}</td>
										<td>{{ contract.applicant_admin_unit_name }}</td>
										<td class="r-table__center-align">{{ contract.subject_name }}</td>
										<td class="r-table__center-align">{{ contract.procedure_name }}</td>
										<td class="r-table__center-align">{{ contract.admin_period_start }}-{{ contract.admin_period_end }}</td>
										<td class="r-table__center-align">{{ contract.status_name }}</td>
										<td>{{ contract.work_description.substring(0, 100) }}...</td>
										<td class="r-table__center-align">{{ dateFormat(contract.contract_date) }}</td>
										<td class="r-table__center-align">{{ contract.contract_type_name }}</td>
										<td>
											<result-options
												:optionList="{ go: { name: 'contractView', params: { id: contract.id } }, delete: true }"
												@deleteItem="deleteConfirmation(contract.id)"
											></result-options>
										</td>
									</tr>
								</tbody>
							</table>
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
	import { useDateFormat } from '@vueuse/core';

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
				params: `?page=${page.value}&limit=${maxResults.value}&embed=pagination&sort=-contract_date`,
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

	function dateFormat(date) {
		return useDateFormat(date, 'DD/MM/YYYY', { locale: 'es-MX' });
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_results.sass"
</style>
