import axios from 'axios'
import VueAxios from 'vue-axios'

export class apiInstance {
	init(cType = 'application/json') {
		let storedBearer = localStorage.getItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
		let bearer = storedBearer === undefined ? null : storedBearer
		let axiosSettings = {
			baseURL: import.meta.env.VITE_API_ENDPOINT,
			headers: {
				'Content-Type': cType,
				Accept: 'application/json',
				Authorization: bearer
				//Connection: 'close'
			}
		}
		return axios.create(axiosSettings)
	}
}
