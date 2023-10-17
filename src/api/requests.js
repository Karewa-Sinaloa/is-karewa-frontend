import { apiInstance } from './axios.js'
import { useAppStore } from '../store/index.js'
import { userSession } from '../helpers/set.session.js'


export class apiRequest {
	constructor(contentType = 'application/json') {
		this.instance = new apiInstance().init(contentType)
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
				.catch(error => {
					reject(error)
				})
		})
	}
	Delete(_params, id = null) {
		return new Promise((resolve, reject) => {
			this.processResponse('delete', _params, id)
				.then(response => resolve(response))
				.catch(error => reject(error))
		})
	}
	Upload(_params, _files) {
		return new Promise((resolve, reject) => {
			this.processResponse('upload', _params)
				.then(response =>resolve(response))
				.catch(error => reject(error))
		})
	}
	processResponse(method, params, id = null) {
		const store = useAppStore()
		store.loading(true)
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
				case 'upload':
					var formData = new FormData()
					for(var key in params.files) {
						formData.append(params.files[key].name, params.files[key].file)
					}
					request = this.instance.post(`${params.module}${id}${uri}`, formData)
					break
			}
			request
				.then(response => {
					store.loading(false)
					resolve(response)
				})
				.catch(error => {
					store.loading(false)
					if (error.request.status === 401) {
						store.showPopup({
							title: "SESIÓN FINALIZADA",
							text: "Su sesión ha sido cerrada, esto puede deberse a diversos factores, como por ejemplo, que el token expiró o alguién mas inicio sesión en otro dispositivo con sus credenciales",
							type: "route",
							route: {
								name: 'accessViewLogin'
							},
							button_text: 'ENTENDIDO',
							icon: 'expired.png'
						})
						new userSession().unSet()
					}
					reject({
						status: error.request.status,
						data: JSON.parse(error.request.response)
					})
				})
		})
	}
}
