import { defineStore } from 'pinia'
import { serverMessages } from '../resources/errors.js'

export const useAppStore = defineStore('KarewaAppStore', {
	state: () => {
		return {
			siteConfig: null,
			userData: null,
			alerts: [],
			processing: false,
			newElements: [],
			popup: null,
			company: null,
			help: null
		}
	},
	getters: {},
	actions: {
		addSiteConfig(state, data) {
			state.siteConfig = data
		},
		setUserData(data) {
			this.userData = data ? data : null
		},
		push_help(data) {
			this.help = data
		},
		push_alert(notification) {
			let message = {
				time: null,
				title: null,
				text: null,
				help: null
			}
			if (notification !== undefined && notification.code !== undefined && notification.code) {
				message = serverMessages(notification.code)
				message.help = notification.help
				this.alerts.push(message)
			}
		},
		update_alerts(notifications) {
			this.alerts = notifications
		},
		loading(loading) {
			this.processing = loading
		},
		new_elements(data) {
			this.newElements = data
		},
		showPopup(data) {
			this.popup = data
		},
		setCompany(info) {
			this.company = info
		}
	},
	modules: {}
})
