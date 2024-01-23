<template>
	<div class="col-2 bg-primary" style="height: 100vh">
		<div class="container py-3">
			<img class="d-block m-auto w-25" src="../../assets/images/logo.png" alt="My company logo">
			<span class="text-center text-light fw-bold ff-headings d-block">CFDI App</span>
		</div>
		<div class="nav py-3 flex-column">
			<router-link class="nav-item nav-link text-light" :to="{name: 'homeView'}">
				<i class="bi-speedometer me-2"></i>
				<span class="ff-headings">Dashboard</span>
			</router-link>

			<router-link class="nav-item nav-link text-light" :to="{name: 'cfdiView'}">
				<i class="bi-currency-dollar me-2"></i>
				<span class="ff-headings">Factura</span>
			</router-link>

			<router-link class="nav-item nav-link text-light" :to="{name: 'companyView'}">
				<i class="bi-building-fill me-2"></i>
				<span class="ff-headings">Empresa</span>
			</router-link>
			
			<router-link class="nav-item nav-link text-light" :to="{name: 'customerListView'}">
				<i class="bi-person-workspace me-2"></i>
				<span class="ff-headings">Clientes</span>
			</router-link>

			<router-link class="nav-item nav-link text-light" :to="{name: 'newProductView'}">
				<i class="bi-bag-fill me-2"></i>
				<span class="ff-headings">Productos</span>
			</router-link>
		</div>
	</div>
</template>

<script setup></script>

