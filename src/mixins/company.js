import { apiRequest } from '../api/requests'
import { useAppStore } from '../store/index.js'

export const getCompany = function() {
	return new Promise(resolve => {
		const store = useAppStore()
		new apiRequest().Get({
			module: 'tax-payers'
		}).then(response => {
			store.setCompany(response.data.data)
			resolve(true)
		}).catch(error => {
			store.setCompany(null)
			resolve(true)
		})
	})
}
