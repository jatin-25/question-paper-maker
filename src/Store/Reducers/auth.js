import { updateObject } from "../utility";
import * as actionTypes from '../Actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    userKey: null,
    error: null,
    loading: null,
    email: null
}

const authStart = (state,action) => {
    return updateObject(state,{error: null,loading: true});
}

const setLoading = (state,action) => {
    return updateObject(state,{loading: action.isLoading})
}
const authSuccess = (state,action) => {
    return updateObject(state,{
        token: action.idToken,
        userId: action.localId,
        userKey: action.userKey,
        loading: false,
        error: null,
        email: action.email
    })
}

const authFail = (state,action) => {
    return updateObject(state,{
        loading: false,
        error: action.error
    })
}

const logout = (state, action) => {
    return updateObject(state,{
        token: null,
        userId: null
    })
}
const reducer = (state = initialState,action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state,action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state,action);
        case actionTypes.AUTH_FAIL: return authFail(state,action);
        case actionTypes.AUTH_LOGOUT: return logout(state, action);
        case actionTypes.LOADING: return setLoading(state, action);
        default: return state;
    }
}

export default reducer;
