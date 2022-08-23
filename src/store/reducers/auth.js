import { updateObject } from '../utility'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
	token: null,
	userId: null,
	userKey: null,
	loading: null,
	email: null,
}

const authStart = (state) => {
	return updateObject(state, { loading: true })
}

const setLoading = (state, action) => {
	return updateObject(state, { loading: action.isLoading })
}
const authSuccess = (state, action) => {
	return updateObject(state, {
		token: action.idToken,
		userId: action.localId,
		userKey: action.userKey,
		loading: false,
		email: action.email,
	})
}

const authFail = (state) => {
	return updateObject(state, {
		loading: false,
		token: null,
		userId: null,
		userKey: null,
		email: null,
	})
}

const logout = (state) => {
	return updateObject(state, {
		loading: false,
		token: null,
		userId: null,
		userKey: null,
		email: null,
	})
}
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return authStart(state, action)
		case actionTypes.AUTH_SUCCESS:
			return authSuccess(state, action)
		case actionTypes.AUTH_FAIL:
			return authFail(state, action)
		case actionTypes.AUTH_LOGOUT:
			return logout(state, action)
		case actionTypes.LOADING:
			return setLoading(state, action)
		default:
			return state
	}
}

export default reducer
