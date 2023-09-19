import jwt_decode from "jwt-decode"
import { useAppStore } from '../store/index.js'
import { apiRequest } from '../api/requests'

export class userSession {
	constructor() {
		this.store = useAppStore()
	}
	set(bearer) {
		let isLoggendIn = false
		if(bearer) {
			let userData = jwt_decode(bearer)
			if(this.validateSession(userData, bearer)) {
				this.store.setUserData(userData)
				isLoggendIn = userData
			}
		}
		return isLoggendIn
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
		if(!userData || this.sessionExpired(userData.exp) || userData.role > 3 || !userData.role || userData.role === undefined) {
			localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
			this.store.setUserData(null)
			return false
		} else {
			if(!stored) {
				localStorage.setItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`, bearer)
			}
			return true
		}
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
