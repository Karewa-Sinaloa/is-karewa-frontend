import { defineStore } from 'pinia'
import { serverMessages } from '../resources/errors.js'

export const useAppStore = defineStore('cfdiAppStore', {
	state: () => {
		return {
			siteConfig: null,
			userData: null,
			alerts: [],
			processing: false,
			newElements: null
		}
	},
	getters: {},
	actions: {
		addSiteConfig(state, data) {
			state.siteConfig = data
		},
		setUserData(data) {
			this.userData = data
		},
		push_alert(notification) {
			let message = {
				time: null,
				title: null,
				text: null
			}
			if (notification.code !== undefined && notification.code) {
				message = serverMessages(notification.code)
				this.alerts.push(message)
			}
		},
		update_alerts(notifications) {
			this.alerts = notifications
		},
		loading(loading) {
			this.processing = loading
		},
		newElements(state, data) {
			state.newElements = data
		}
	},
	modules: {}
})
