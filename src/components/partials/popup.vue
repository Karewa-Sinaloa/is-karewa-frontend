<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../store/index.js'

const store = useAppStore()

const alerts = computed(() => store.alerts)

function closeNotification(key) {
	let alerts = store.alerts
	alerts.splice(key, 1)
	store.update_alerts(alerts)
}

let myInterval = setInterval(() => {
	let now = Date.now()
	let notifications = store.alerts
	if(notifications.length > 0) {
		notifications.forEach((notification, index) => {
			if((notification.time + 5000) < now) {
				closeNotification(index)
			}
		})
	}
}, 500)

</script>

<template>
	<div class="alert">
		<div class="alert__container" :class="{'alert__container--error': alert.type == 'error', 'alert__container--warning': alert.type == 'warning', 'alert__container--success': alert.type == 'success'}" v-for="(alert, key) in alerts">
			<span class="material-symbols-outlined" v-if="alert.type == 'error'">report</span>
			<span class="material-symbols-outlined" v-else-if="alert.type == 'success'">check_circle</span>
			<span class="material-symbols-outlined" v-else-if="alert.type == 'warning'">warning</span>
			<p class="alert__description">{{ alert.text }}</p>
			<button class="alert__close btn btn__icon" @click="closeNotification(key)">
				<span class="material-symbols-outlined">close</span>
			</button>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_alert.sass"
</style>
