<template>
	<div class="sidebar">
		<div class="sidebar__logo">
			<img class="sidebar__logo-image" src="../../assets/images/logo.png" alt="My company logo">
			<span class="sidebar__company-name">CFDI App</span>
		</div>
		<div class="nav">
			<router-link class="nav__element" :to="{name: 'homeView'}">
				<span class="material-symbols-outlined nav__element-icon">dashboard</span>
				<span class="nav__element-text">Dashboard</span>
			</router-link>

			<router-link class="nav__element" :to="{name: 'companyView'}">
				<span class="material-symbols-outlined nav__element-icon">store</span>
				<span class="nav__element-text">Empresa</span>
			</router-link>
			
			<router-link class="nav__element" :to="{name: 'customerListView'}">
				<span class="material-symbols-outlined nav__element-icon">hail</span>
				<span class="nav__element-text">Clientes</span>
			</router-link>
		</div>
	</div>
</template>

<script setup></script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_sidebar.sass"
</style>
