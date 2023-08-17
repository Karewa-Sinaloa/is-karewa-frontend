export class userSession {
	constructor() {}
	set(data) {
		let isLoggendIn = false
		if(data && data.bearer) {
			let splitedToken = data.bearer.split('.')
			let b64DataString = atob(splitedToken[1])
			let userData = JSON.parse(b64DataString)
			if(this.sessionExpired(userData.exp) || userData.role > 3 || !userData.role || userData.role === undefined) {
				localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
			} else {
				localStorage.setItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`, data.bearer)
				isLoggendIn = userData
			}
		}
		return isLoggendIn
	}
	verify() {
		let bearer = localStorage.getItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
		if(bearer) {
			return this.set({'bearer': bearer})
		} else {
			return false
		}
	}
	sessionExpired(exp) {
		let now = Math.round(Date.now() / 1000)
		return now > exp
	}
}
