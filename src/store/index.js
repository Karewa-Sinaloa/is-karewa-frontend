import { createStore } from 'vuex'
import { alertData } from '../resources/errors.js'

export const store = createStore({
	state: {
		siteConfig: null,
		userData: null,
		alerts: [],
		loading: false,
		newElements: null
	},
	mutations: {
		addSiteConfig(state, data) {
			state.siteConfig = data
		},
		setUserData(state, data) {
			state.userData = data
		},
		pushAlert(state, alert) {
			if (alert.code !== undefined && alert.code) {
				alert = alertData[alert.code]
			}
			alert.time = Date.now()
			state.alerts.push(alert)
		},
		updateAlerts(state, alerts) {
			state.alerts = alerts
		},
		loading(state, loading) {
			state.loading = loading
		},
		newElements(state, data) {
			state.newElements = data
		}
	},
	actions: {},
	modules: {}
})
