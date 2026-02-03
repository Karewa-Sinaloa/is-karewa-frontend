import { jwtDecode } from "jwt-decode"
import { toRaw } from 'vue'
import { useAppStore } from '../store/index.js'
import { apiRequest } from '../api/requests'
import { frontEndLogs } from '../helpers/frontend.logs.js'

export class userSession {
	constructor() {
		this.store = useAppStore()
	}
	set(bearer) {
		return new Promise((resolve, reject) => {
			if(bearer) {
				let userData = jwtDecode(bearer)
				this.validateSession(userData, bearer).then(() => {
					this.store.setUserData(userData)
					resolve(userData)
				}).catch(error => {
					$debug && console.error('Error validating session:', error)
					reject(false)
				})
			} else {
				reject(false)
				$debug && console.error('No bearer token provided')
			}
		})
	}
	verify() {
		let uData = toRaw(this.store.userData)
		let bearer = localStorage.getItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
		if(bearer && uData) {
			return this.validateSession(uData, bearer, true)
		} else if(bearer && !uData) {
			let result = this.validateSession(jwtDecode(bearer), bearer, true)
			if(result) {
				this.store.setUserData(jwtDecode(bearer))
			}
			return result
		} else {
			this.store.setUserData(null)
			return false
		}
	}
	validateSession(userData, bearer, stored = false) {
		return new Promise((resolve, reject) => {
			if(!userData || userData.data === undefined || this.sessionExpired(userData.exp) || userData.data.role_id > 5 || !userData.data.role_id || userData.data.role_id === undefined) {
				localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
				this.store.setUserData(null)
				frontEndLogs({
					message: 'No se pudo registrar el inicio de sesión por lo que el usuario no pudo continuar',
					data: userData
				})
				reject(false)
			} else {
				if(!stored) {
					localStorage.setItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`, bearer)
				}
				resolve(true)
			}
		})
	}
	sessionExpired(exp) {
		let now = Math.round(Date.now() / 1000)
		return now > exp
	}
	unSet() {
		return new Promise((resolve, reject) => {
			new apiRequest().Get({
				module: 'access/logout'
			}).then(response => {
				localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
				this.store.setUserData(null)
				this.store.push_alert(response.data.code)
				resolve(true)
			}).catch(error => {
				this.store.push_alert(error.data.code)
				reject(false)
			})
		})
	}
}
