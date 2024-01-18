<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<div class="widget widget--default">
					<h2 class="widget__heading2">Completa la configuración de la cuenta</h2>
					<span class="widget__help">Completa la información personal y de empresa para poder emitir facturas u otros comprobantes, recuerda tener a mano tu constancia de situación fiscal, tus claves (CSD) y su contraseña, estas deben estar vigentes.</span>
					<div class="progress-list">
						<div class="progress-list__element">
							<div class="progress-list__text-container">
								<h4 class="progress-list__title">Datos de usuario</h4>
								<p class="progress-list__text">Tu información de usuario, correo, nombre, teléfono y otros datos más</p>
							</div>
							<span class="material-symbols-outlined progress-list__icon progress-list__icon--checked">check_circle</span>
						</div>

						<div class="progress-list__element">
							<div class="progress-list__text-container">
								<h4 class="progress-list__title">Configurar empresa</h4>
								<p class="progress-list__text">Agrega la información fiscal de tu empresa, CSD, RFC, Razón Social y otros datos</p>
							</div>
							<span v-if="companyCreated" class="material-symbols-outlined progress-list__icon progress-list__icon--checked">check_circle</span>
							<span v-else class="material-symbols-outlined progress-list__icon progress-list__icon--unchecked">radio_button_unchecked</span>
							<router-link v-if="!companyCreated" class="btn btn__default btn--small" :to="{name: 'newCompanyView'}">Configurar mi empresa</router-link>
						</div>

						<div class="progress-list__element">
							<div class="progress-list__text-container">
								<h4 class="progress-list__title">Configurar dirección</h4>
								<p class="progress-list__text">Agrega la información de la dirección de fiscal de tu empresa, recuerda que el código postal debe coincidir con el registrado en tu constancia de situación fiscal</p>
							</div>
							<span v-if="companyCreated" class="material-symbols-outlined progress-list__icon progress-list__icon--checked">check_circle</span>
							<span v-else class="material-symbols-outlined progress-list__icon progress-list__icon--unchecked">radio_button_unchecked</span>
							<router-link v-if="!companyCreated" class="btn btn__default btn--small" :to="{name: 'newCompanyView'}">Configurar dirección</router-link>
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
