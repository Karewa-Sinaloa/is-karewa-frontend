import { apiRequest } from '../api/requests'
import { useAppStore } from '../store/index.js'

export const getOrganization = function() {
	return new Promise(resolve => {
		const store = useAppStore()
		new apiRequest().Get({
			module: 'organization'
		}).then(response => {
			store.setCompany(response.data.data)
			resolve(true)
		}).catch(error => {
			store.setCompany(null)
			resolve(true)
		})
	})
}
