import jwt_decode from "jwt-decode"
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
				let userData = jwt_decode(bearer)
				this.validateSession(userData, bearer).then(() => {
					this.store.setUserData(userData)
					resolve(userData)
				}).catch(() => {
					reject(false)
				})
			} else {
				reject(false)
			}
		})
	}
	verify() {
		let bearer = localStorage.getItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
		if(bearer && this.store.userData) {
			return this.validateSession(this.store.userData, bearer, true)
		} else if(bearer && !this.store.userData) {
			let result = this.validateSession(jwt_decode(bearer), bearer, true)
			if(result) {
				this.store.setUserData(jwt_decode(bearer))
			}
			return result
		} else {
			this.store.setUserData(null)
			return false
		}
	}
	validateSession(userData, bearer, stored = false) {
		return new Promise((resolve, reject) => {
			if(!userData || this.sessionExpired(userData.exp) || userData.role > 5 || !userData.role || userData.role === undefined) {
				localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
				console.log(userData)
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
