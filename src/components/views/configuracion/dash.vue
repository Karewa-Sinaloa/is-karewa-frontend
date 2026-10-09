<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<div class="main__dash-grid">
					<users-card />
					<roles-card />
					<config-cards />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
	import sidebarComponent from '../../partials/sidebar.vue';
	import contentHeader from '../../partials/content_header.vue';
	import UsersCard from './usuarios.vue';
	import RolesCard from './roles.vue';
	import ConfigCards from './config.vue';
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
	@use "../../../assets/sass/components/_results.sass"
	@use "../../../assets/sass/components/_widgets.sass"
</style>
