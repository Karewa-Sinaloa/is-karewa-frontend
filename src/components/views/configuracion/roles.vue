<template>
	<section class="section section--wide section--no-border">
		<div class="section__top">
			<h1 class="section__title">Roles del sistema</h1>
			<span class="section__help-text">Agrega, elimina o edita los roles que se asignan a los usuarios en esta sección.</span>
			<button
				class="btn btn--small btn__default btn__default--primary"
				type="button"
				@click="choosenId = 'new'"
			>
				<icon-set icon="add" />
				Crear nuevo rol
			</button>
		</div>
		<div
			class="section__content"
			v-if="roles && roles.length > 0"
		>
			<div class="results">
				<div
					class="results__result result"
					v-for="role in roles"
					:key="role.id"
				>
					<div class="result__data">
						<h3 class="result__title">{{ role.name }}</h3>
					</div>
					<result-options
						:optionList="{ pop: true, delete: true }"
						@showPopup="choosenId = role.id"
						@deleteItem="deleteConfirmation(role.id)"
					></result-options>
				</div>
			</div>
			<confirmation-popup
				:data="roleDeleteConfirmationData"
				@confirmed="roleDelete"
				@declined="((confirmDelete = false), (itemToDelete = null))"
				v-if="confirmDelete"
			></confirmation-popup>
		</div>
		<div
			class="section__content"
			v-else-if="roles && roles.length === 0"
		>
			<div class="results">
				<p class="results__no-results">No se encontraron roles</p>
			</div>
		</div>
		<div
			class="section__content"
			v-else
		>
			<span class="results__loading">Cargando lista de roles....</span>
		</div>
		<section-popup-slot
			v-if="choosenId"
			@close="choosenId = null"
		>
			<roles-view
				:id="choosenId"
				@close="choosenId = null"
				@changed="(getRoles(), (choosenId = null))"
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
	import sectionPopupSlot from '../../partials/section_popup_slot.vue';
	import rolesView from './roles_view.vue';

	const store = useAppStore();
	const roles = ref(null);
	const confirmDelete = ref(false);
	const itemToDelete = ref(null);
	const choosenId = ref(null);

	const roleDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar este rol? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};

	onMounted(() => {
		getRoles();
	});

	function getRoles() {
		roles.value = null;
		new apiRequest()
			.Get({
				module: 'roles',
				params: '?page=1&limit=99',
			})
			.then(response => {
				roles.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
				roles.value = [];
			});
	}

	const deleteConfirmation = id => {
		confirmDelete.value = true;
		itemToDelete.value = id;
	};

	function roleDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'roles',
				},
				itemToDelete.value
			)
			.then(response => {
				confirmDelete.value = false;
				roles.value = roles.value.filter(role => role.id !== itemToDelete.value);
				itemToDelete.value = null;
				store.push_alert(response.data);
			})
			.catch(error => {
				confirmDelete.value = false;
				itemToDelete.value = null;
				store.push_alert(error.data);
			});
	}
</script>
