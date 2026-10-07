<template>
	<div class="content-top">
		<div
			class="content-top__element user-menu"
			@mouseover="showMenu = true"
			@mouseleave="showMenu = false"
			@click.stop
			@keydown.esc="showMenu = false"
		>
			<button
				class="user-menu__trigger"
				type="button"
				title="Menú de usuario"
				aria-label="Menú de usuario"
				:aria-expanded="showMenu"
				@click="showMenu = true"
			>
				<icon-set icon="user" />
			</button>
			<div
				class="user-menu__dropdown"
				:class="{ 'user-menu__dropdown--active': showMenu }"
			>
				<button
					class="user-menu__option"
					type="button"
					:disabled="!currentUserId"
					@click="goToProfile"
				>
					<icon-set icon="view" />
					<span class="user-menu__option-text">Ver perfil</span>
				</button>
				<button
					class="user-menu__option"
					type="button"
					@click="logOut"
				>
					<icon-set icon="logout" />
					<span class="user-menu__option-text">Cerrar sesión</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
	import { userSession } from '../../helpers/set.session.js';
	import { useAppStore } from '../../store/index.js';
	import { useRouter } from 'vue-router';

	const store = useAppStore();
	const router = useRouter();
	const showMenu = ref(false);

	const currentUserId = computed(() => (store.userData && store.userData.data ? store.userData.data.id : null));

	function goToProfile() {
		if (!currentUserId.value) return;
		showMenu.value = false;
		router.push({ name: 'configuracionUsuariosView', params: { id: currentUserId.value } });
	}

	function logOut() {
		showMenu.value = false;
		new userSession().unSet().then(response => {
			if (response) {
				router.push({ name: 'accessViewLogin' });
			}
		});
	}

	function closeMenu() {
		showMenu.value = false;
	}

	onMounted(() => document.addEventListener('click', closeMenu));
	onBeforeUnmount(() => document.removeEventListener('click', closeMenu));
</script>

<style lang="sass">
	@use  "../../assets/sass/components/_content_header.sass"
</style>
