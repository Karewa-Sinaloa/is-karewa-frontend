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
			if((notification.time + 500000) < now) {
				closeNotification(index)
			}
		})
	}
}, 50000)

</script>

<template>
	<div class="position-fixed top-0 end-0 col-3 z-3" style="height: 100vh">
		<div class="alert m-1 fs-small d-flex align-items-center" :class="{'alert-danger': alert.type == 'error', 'alert-warning': alert.type == 'warning', 'alert-success': alert.type == 'success'}" v-for="(alert, key) in alerts">
			<button class="btn-close d-block me-3" @click="closeNotification(key)"></button>
			<p class="fs-small ff-content m-auto">{{ alert.text }}<br>{{ alert.help }}</p>
		</div>
	</div>
</template>
