<template>
	<div class="sidebar">
		<div class="sidebar__logo">
			<img class="sidebar__logo-image" src="../../assets/images/logo.png" alt="My company logo">
			<span class="sidebar__company-name">Monitor Karewa</span>
		</div>
		<div class="nav">
			<router-link class="nav__element" :to="{name: 'homeView'}">
				<icon-set icon="dashboard" />
				<span class="nav__element-text">Panel de control</span>
			</router-link>
		</div>
	</div>
</template>

<script setup></script>

<style lang="sass">
	@use "../../assets/sass/components/_sidebar.sass"
</style>
