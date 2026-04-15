<template>
	<section class="section section--wide section--no-border">
		<div class="section__top">
			<h1 class="section__title">Periodos de contratos</h1>
			<span class="section__help-text">Agrega, edita o elimina periodos de contratos, estos aparecerán a la hora de crear nuevos contratos o editarlos.</span>
			<button
				class="btn btn--small btn__default btn__default--primary"
				@click="choosenId = 'new'"
				v-if="periodos && periodos.length > 0"
			>
				<icon-set icon="add" />
				Crear nuevo periodo
			</button>
		</div>
		<div
			class="section__content"
			v-if="periodos && periodos.length > 0"
		>
			<div class="results">
				<div
					class="results__result result"
					v-for="periodo in periodos"
					:key="periodo.id"
				>
					<div class="result__data">
						<h3 class="result__title">{{ periodo.name }}</h3>
					</div>
					<result-options
						:optionList="{ pop: true, delete: true }"
						@showPopup="choosenId = periodo.id"
						@deleteItem="deleteConfirmation(periodo.id)"
					></result-options>
				</div>
			</div>
			<confirmation-popup
				:data="periodoDeleteConfirmationData"
				@confirmed="periodoDelete"
				@declined="((confirmDelete = false), (itemToDelete = null))"
				v-if="confirmDelete"
			></confirmation-popup>
			<pagination-container
				v-if="pagination"
				:data="pagination"
				module="periodoList"
			></pagination-container>
		</div>
		<div
			class="section__content"
			v-else-if="periodos && periodos.length === 0"
		>
			<div class="results">
				<p class="results__no-results">No se encontraron periodos</p>
				<button
					class="btn btn--small btn__default btn__default--primary"
					@click="choosenId = 'new'"
					v-if="periodos && periodos.length === 0"
				>
					<icon-set icon="add" />
					Crear nuevo periodo
				</button>
			</div>
		</div>
		<div
			class="section__content"
			v-else
		>
			<span class="results__loading">Cargando lista de periodos....</span>
		</div>
		<section-popup-slot
			v-if="choosenId"
			@close="choosenId = null"
		>
			<periodo-view
				:id="choosenId"
				@close="choosenId = null"
				@changed="(getPeriodos(), (choosenId = null))"
			/>
		</section-popup-slot>
	</section>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useAppStore } from '../../../store/index.js';
	import { apiRequest } from '../../../api/requests.js';
	import confirmationPopup from '../../partials/confirmation_popup.vue';
	import resultOptions from '../../partials/result_options.vue';
	import paginationContainer from '../../partials/pagination.vue';
	import SectionPopupSlot from '../../partials/section_popup_slot.vue';
	import periodoView from './periodos_view.vue';

	const periodos = ref(null);
	const store = useAppStore();
	const confirmDelete = ref(false);
	const pagination = ref(null);
	const maxResults = ref(99);
	const itemToDelete = ref(null);
	const page = ref(1);
	const choosenId = ref(null);

	onMounted(() => {
		// Aquí puedes hacer la solicitud a la API para obtener los periodo
		// y asignarlos a la variable 'periodos'
		getPeriodos();
	});
	const periodoDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar este periodo? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};

	function getPeriodos() {
		periodos.value = [];
		new apiRequest()
			.Get({
				module: 'periodos-contratos',
				params: `?page=${page.value}&limit=${maxResults.value}`,
			})
			.then(response => {
				periodos.value = response.data.data;
				pagination.value = response.data.pagination ? response.data.pagination : null;
			})
			.catch(error => {
				store.push_alert(error.data);
			});
	}

	const deleteConfirmation = id => {
		confirmDelete.value = true;
		itemToDelete.value = id;
	};

	function periodoDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'periodos-contratos',
				},
				itemToDelete.value
			)
			.then(response => {
				confirmDelete.value = false;
				periodos.value = periodos.value.filter(periodo => periodo.id !== itemToDelete.value);
				store.push_alert(response.data);
			})
			.catch(error => {
				confirmDelete.value = false;
				store.push_alert(error.data);
			});
	}
</script>
