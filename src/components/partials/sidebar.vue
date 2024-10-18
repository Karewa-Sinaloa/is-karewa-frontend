<template>
	<div class="sidebar">
		<div class="sidebar__logo">
			<img class="sidebar__logo-image" src="../../assets/images/logo.png" alt="My company logo">
			<span class="sidebar__company-name">CFDI App</span>
		</div>
		<div class="nav">
			<router-link class="nav__element" :to="{name: 'homeView'}">
				<icon-set icon="dashboard" />
				<span class="nav__element-text">Dashboard</span>
			</router-link>

			<router-link class="nav__element" :to="{name: 'cfdiView'}">
				<icon-set icon="invoice" />
				<span class="nav__element-text">Factura</span>
			</router-link>

			<router-link class="nav__element" :to="{name: 'companyView'}">
				<icon-set icon="company" />
				<span class="nav__element-text">Empresa</span>
			</router-link>
			
			<router-link class="nav__element" :to="{name: 'customerListView'}">
				<icon-set icon="customers" />
				<span class="nav__element-text">Clientes</span>
			</router-link>

			<span class="nav__element-container">
				<router-link class="nav__element" :to="{name: 'newProductView'}">
					<icon-set icon="products" />
					<span class="nav__element-text">Productos</span>
				</router-link>
				<div class="nav__sub-container">
					<router-link class="nav__element" :to="{name: 'categoryView'}">
						<icon-set icon="categories" />
						<span class="nav__element-text">Categorías</span>
					</router-link>
				</div>
			</span>
		</div>
	</div>
</template>

<script setup></script>

<style lang="sass">
	@import "../../assets/sass/components/_sidebar.sass"
</style>
