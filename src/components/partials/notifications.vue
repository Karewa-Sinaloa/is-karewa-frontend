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
}, 5000)

</script>

<template>
	<div class="position-fixed top-0 end-0 col-3 z-3" style="height: 100vh" v-if="alerts.length > 0">
		<div class="alert-custom" v-for="(alert, key) in alerts" :class="{'alert-custom-danger': alert.type == 'error', 'alert-custom-warning': alert.type == 'warning', 'alert-custom-success': alert.type == 'success'}">
			<i v-if="alert.type == 'error'" class="bi-dash-circle-fill me-3 fs-3"></i>
			<i v-else-if="alert.type == 'warning'" class="bi-exclamation-triangle-fill me-3 fs-3"></i>
			<i v-else-if="alert.type == 'success'" class="bi-check-circle-fill me-3 fs-3"></i>
			<p class="ff-headings fs-small m-auto">{{ alert.text }}<br>{{ alert.help }}</p>
			<button class="btn d-block ms-3" style="color: inherit!important" @click="closeNotification(key)">
				<i class="bi-x fs-4"></i>
			</button>
		</div>
	</div>
</template>
