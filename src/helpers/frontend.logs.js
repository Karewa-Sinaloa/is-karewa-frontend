import { apiRequest } from '../api/requests'

export const frontEndLogs = function(data = {}) {
	let params = {
		module: 'frontend-logs/update',
		data: {
			level: 10,
			data: data,
			date: new Date(),
			uri: window.location.href,
			navigator: {
				browser: navigator.appCodeName,
				build: navigator.buildID,
				lang: navigator.language,
				oscpu: navigator.oscpu,
				userAgent: navigator.userAgent,
				platform: navigator.platform
			}
		}
	}
	console.log(params)
	new apiRequest().Post(params).then(response => console.log(response)).catch(error => console.log(error))
}
