import * as actions from './actionTypes'
export const authStart = () => {
	return {
		type: actions.AUTH_START,
	}
}

export const authSuccess = (idToken, localId, userKey, email, expirationDate) => {
	localStorage.setItem('token', idToken)
	localStorage.setItem('expirationDate', expirationDate)
	localStorage.setItem('userId', localId)
	localStorage.setItem('userKey', userKey)
	localStorage.setItem('email', email)

	return {
		type: actions.AUTH_SUCCESS,
		idToken: idToken,
		localId: localId,
		userKey: userKey,
		email: email,
	}
}

export const logout = () => {
	localStorage.removeItem('token')
	localStorage.removeItem('expirationDate')
	localStorage.removeItem('userId')
	localStorage.removeItem('userKey')
	localStorage.removeItem('email')

	return {
		type: actions.AUTH_LOGOUT,
	}
}

export const setExpirationTime = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout())
		}, expirationTime * 1000)
	}
}

export const loading = (isLoading) => {
	return {
		type: actions.LOADING,
		isLoading: isLoading,
	}
}

export const setLoading = (isLoading) => {
	return (dispatch) => {
		dispatch(loading(isLoading))
	}
}

export const authFail = () => {
	return {
		type: actions.AUTH_FAIL,
	}
}

export const checkAuthState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token')
		if (!token) {
			dispatch(logout())
			return
		}

		const userId = localStorage.getItem('userId')
		const userKey = localStorage.getItem('userKey')
		const email = localStorage.getItem('email')
		const expirationDate = new Date(localStorage.getItem('expirationDate'))

		if (expirationDate < new Date()) {
			dispatch(logout())
			return
		}

		const expirationTime = (expirationDate.getTime() - new Date().getTime()) / 1000
		dispatch(authSuccess(token, userId, userKey, email, expirationDate))
		dispatch(setExpirationTime(expirationTime))
	}
}
