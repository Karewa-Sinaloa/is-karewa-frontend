<template>
	<div class="container-fluid d-flex p-0">
		<sidebar-component />
		<div class="col-10 content">
			<content-header />
			<main class="container bg-light main">
				<div class="col-4 p-3 bg-white rounded shadow-sm">
					<h2 class="ff-headings h5 text-primary">Completa la configuración de la cuenta</h2>
					<span class="d-block ff-content text-secondary fs-small fw-light">Completa la información personal y de empresa para poder emitir facturas u otros comprobantes, recuerda tener a mano tu constancia de situación fiscal, tus claves (CSD) y su contraseña, estas deben estar vigentes.</span>
					<div class="list-group list-group-numbered mt-3 rounded">
						<div class="list-group-item d-flex justify-content-between align-items-start">
							<div class="ms-2 me-auto">
								<h4 class="fs-6 ff-headings text-primary">Datos de usuario</h4>
								<p class="fs-small text-secondary ff-content">Tu información de usuario, correo, nombre, teléfono y otros datos más</p>
							</div>
							<i class="bi-toggle-on fs-1 text-success"></i>
						</div>

						<div class="list-group-item d-flex justify-content-between align-items-start flex-wrap">
							<div class="ms-2 me-auto col-9">
								<h4 class="fs-6 ff-headings text-primary">Configurar empresa</h4>
								<p class="fs-small text-secondary ff-content">Agrega la información fiscal de tu empresa, CSD, RFC, Razón Social y otros datos</p>
							</div>
							<i v-if="companyCreated" class="fs-1 bi-toggle-on text-success"></i>
							<i v-else class="bi-toggle-off text-secondary fs-1"></i>
							<hr v-if="!companyCreated" class="col-12 my-auto">	
							<router-link v-if="!companyCreated" class="btn btn-primary btn-sm mt-2 mb-1" :to="{name: 'newCompanyView'}">Configurar mi empresa</router-link>
						</div>

						<div class="list-group-item d-flex justify-content-between align-items-start flex-wrap">
							<div class="ms-2 me-auto col-9">
								<h4 class="ff-headings text-primary fs-6">Configurar dirección</h4>
								<p class="fs-small ff-content text-secondary">Agrega la información de la dirección de fiscal de tu empresa, recuerda que el código postal debe coincidir con el registrado en tu constancia de situación fiscal</p>
							</div>
							<i v-if="companyCreated" class="fs-1 bi-toggle-on text-success"></i>
							<i v-else class="bi-toggle-off fs-1 text-secondary"></i>
							<hr v-if="!companyCreated" class="col-12 my-auto">
							<router-link v-if="!companyCreated" class="btn btn-primary btn-sm mt-2 mb-1" :to="{name: 'newCompanyView'}">Configurar dirección</router-link>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'

const store = useAppStore()

const companyCreated = computed(() => {
	return store.company != null ? true : false
})

</script>
