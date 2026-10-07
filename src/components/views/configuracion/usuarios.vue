<template>
	<section class="section section--wide section--no-border">
		<div class="section__top">
			<h1 class="section__title">Usuarios del sistema</h1>
			<span class="section__help-text">Agrega, elimina o edita los usuarios registrados en el sistema desde esta sección.</span>
			<button
				class="btn btn--small btn__default btn__default--primary"
				type="button"
				@click="router.push({ name: 'configuracionUsuariosCreate' })"
			>
				<icon-set icon="add" />
				Agregar usuario
			</button>
		</div>
		<div
			class="section__content"
			v-if="users && users.length > 0"
		>
			<div class="results">
				<div
					class="results__result result"
					v-for="user in users"
					:key="user.id"
				>
					<div class="result__data">
						<h3 class="result__title">{{ fullName(user) }}</h3>
						<span class="result__description">{{ user.email }}</span>
					</div>
					<result-options
						:optionList="{ go: { name: 'configuracionUsuariosView', params: { id: user.id } }, delete: true }"
						@deleteItem="deleteConfirmation(user.id)"
					></result-options>
				</div>
			</div>
			<confirmation-popup
				:data="userDeleteConfirmationData"
				@confirmed="userDelete"
				@declined="((confirmDelete = false), (itemToDelete = null))"
				v-if="confirmDelete"
			></confirmation-popup>
			<pagination-container
				v-if="pagination"
				:data="pagination"
				module="configuracionView"
			></pagination-container>
		</div>
		<div
			class="section__content"
			v-else-if="users && users.length === 0"
		>
			<div class="results">
				<p class="results__no-results">No se encontraron usuarios</p>
			</div>
		</div>
		<div
			class="section__content"
			v-else
		>
			<span class="results__loading">Cargando lista de usuarios....</span>
		</div>
	</section>
</template>

<script setup>
	import { computed, onMounted, ref, watch } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { useAppStore } from '../../../store/index.js';
	import { apiRequest } from '../../../api/requests.js';
	import confirmationPopup from '../../partials/confirmation_popup.vue';
	import resultOptions from '../../partials/result_options.vue';
	import paginationContainer from '../../partials/pagination.vue';

	const store = useAppStore();
	const router = useRouter();
	const route = useRoute();
	const users = ref(null);
	const confirmDelete = ref(false);
	const pagination = ref(null);
	const itemToDelete = ref(null);
	const maxResults = 10;
	const page = computed(() => {
		return route.params.page ? parseInt(route.params.page) : 1;
	});

	const userDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar este usuario? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};

	onMounted(() => {
		getUsers();
	});

	watch(
		() => route.path,
		() => {
			getUsers();
		}
	);

	function fullName(user) {
		return [user.first_name, user.middle_name, user.last_name, user.second_last_name].filter(part => part).join(' ');
	}

	function getUsers() {
		users.value = null;
		new apiRequest()
			.Get({
				module: 'users',
				params: `?page=${page.value}&limit=${maxResults}&embed=pagination&sort=first_name,last_name`,
			})
			.then(response => {
				users.value = response.data.data;
				pagination.value = response.data.pagination ? response.data.pagination : null;
			})
			.catch(error => {
				store.push_alert(error.data);
				users.value = [];
				pagination.value = null;
			});
	}

	const deleteConfirmation = id => {
		confirmDelete.value = true;
		itemToDelete.value = id;
	};

	function userDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'users',
				},
				itemToDelete.value
			)
			.then(response => {
				confirmDelete.value = false;
				users.value = users.value.filter(user => user.id !== itemToDelete.value);
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
