import { apiInstance } from './axios.js'
import { store } from '../store/index.js'
//import logOutMixin from '../helpers/logout.vue'
export class api {
	constructor() {
		this.instance = new apiInstance().init()
	}
	Get(_params, id = null) {
		return new Promise((resolve, reject) => {
			this.processResponse('get', _params, id)
				.then(response => resolve(response))
				.catch(error => reject(error))
		})
	}
	Put(_params, id = null) {
		return new Promise((resolve, reject) => {
			this.processResponse('put', _params, id)
				.then(response => resolve(response))
				.catch(error => reject(error))
		})
	}
	Post(_params) {
		return new Promise((resolve, reject) => {
			this.processResponse('post', _params)
				.then(response => resolve(response))
				.catch(error => reject(error))
		})
	}
	Delete(_params, id = null) {
		return new Promise((resolve, reject) => {
			this.processResponse('delete', _params, id)
				.then(response => resolve(response))
				.catch(error => reject(error))
		})
	}
	processResponse(method, params, id = null) {
		store.commit('loading', true)
		return new Promise((resolve, reject) => {
			let uri = params.params !== undefined && params.params ? params.params : ''
			id = id && !isNaN(id) && id > 0 ? `/${id}` : ''
			let request = null
			switch (method) {
				case 'get':
					request = this.instance.get(`${params.module}${id}${uri}`)
					break
				case 'put':
					request = this.instance.put(`${params.module}${id}${uri}`, JSON.stringify(params.data))
					break
				case 'post':
					request = this.instance.post(`${params.module}${id}${uri}`, JSON.stringify(params.data))
					break
				case 'delete':
					request = this.instance.delete(`${params.module}${id}${uri}`)
					break
			}
			request
				.then(response => {
					store.commit('loading', false)
					resolve(response)
				})
				.catch(error => {
					store.commit('loading', false)
					if (error.request.status === 401) {
						//this.logOut()
					}
					reject({
						status: error.request.status,
						data: JSON.parse(error.request.response)
					})
				})
		})
	}
}
