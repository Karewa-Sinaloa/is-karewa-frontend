import { defineStore } from 'pinia';
import { serverMessages } from '../resources/errors.js';

export const useAppStore = defineStore('KarewaAppStore', {
	state: () => {
		return {
			siteConfig: null,
			userData: null,
			allowedRoles: {},
			alerts: [],
			processing: false,
			newElements: [],
			popup: null,
			company: null,
			help: null,
		};
	},
	getters: {},
	actions: {
		addSiteConfig(state, data) {
			state.siteConfig = data;
		},
		setUserData(data) {
			this.userData = data ? data : null;
		},
		setSectionPermissions(section, permissions) {
			if (!section || !permissions || typeof permissions !== 'object') return;
			this.allowedRoles = { ...this.allowedRoles, [section]: { ...permissions } };
		},
		setAllowedRoles(permissions) {
			this.allowedRoles = permissions && typeof permissions === 'object' ? { ...permissions } : {};
		},
		clearAllowedRoles() {
			this.allowedRoles = {};
		},
		can(section, action) {
			const declared = this.allowedRoles[section];
			if (!declared || typeof declared !== 'object') return true;
			const allowed = declared[action];
			if (!Array.isArray(allowed) || allowed.length === 0) return true;
			const data = this.userData ? this.userData.data : null;
			const roleId = data ? data.role_id : null;
			if (roleId === null || roleId === undefined) return false;
			return allowed.some(role => Number(role) === Number(roleId));
		},
		push_help(data) {
			this.help = data;
		},
		push_alert(notification) {
			let message = {
				time: null,
				title: null,
				text: null,
				help: null,
			};
			if (notification !== undefined && notification.code !== undefined && notification.code) {
				message = serverMessages(notification.code);
				message.help = notification.help;
				this.alerts.push(message);
			}
		},
		update_alerts(notifications) {
			this.alerts = notifications;
		},
		loading(loading) {
			this.processing = loading;
		},
		new_elements(data) {
			this.newElements = data;
		},
		showPopup(data) {
			this.popup = data;
		},
		setCompany(info) {
			this.company = info;
		},
	},
	modules: {},
});
