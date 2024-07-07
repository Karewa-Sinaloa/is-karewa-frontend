<script setup>
import { watch, computed, onMounted } from 'vue'
import notificationComponent from './components/partials/notifications.vue'
import loadingComponent from './components/partials/loading.vue'
import popupComponent from './components/partials/popups.vue'
import { getCompany } from './mixins/company.js'
import { useRoute } from 'vue-router'
import helpPopup from './components/partials/help.popup.vue'

const route = useRoute()
/*--
const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/'
			})
			if (registration.installing) {
				console.log('Service worker installing')
			} else if (registration.waiting) {
				console.log('Service worker installed')
			} else if (registration.active) {
				console.log('Service worker active')
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`)
		}
	}
}
--*/
const isLoggedIn = computed(() => {
	return route.meta.login === true ? true : false
})

onMounted(() => {
	if(isLoggedIn.value) {
		getCompany()
	}
})

watch(isLoggedIn, () => {
	if(isLoggedIn.value) {
		getCompany()
	}
})

//registerServiceWorker()
</script>

<template>
	<router-view />
	<notification-component />
	<loading-component />
	<popup-component />
	<help-popup></help-popup>
</template>

<style lang="sass">
	@import "./assets/sass/base/_base.sass"
</style>
