import { apiRequest } from '../api/requests'
import { useAppStore } from '../store/index.js'

export const getCompany = function() {
	const store = useAppStore()
	new apiRequest().Get({
		module: 'tax-payers'
	}).then(response => {
		store.setCompany(response.data.data)
	}).catch(error => {
		store.setCompany(null)
	})
}
