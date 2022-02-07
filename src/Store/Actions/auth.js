import * as actions from './actionTypes';
import axios from '../../axios';

export const authStart = () => {
    return {
        type:  actions.AUTH_START
    };
};

export const authSuccess = (idToken,localId) => {
    return {
        type: actions.AUTH_SUCCESS,
        idToken: idToken,
        localId: localId
    }
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actions.AUTH_LOGOUT
    }
}

export const setExpirationTime = (expirationTime) => {
    return dispatch => {
        setTimeout(() => dispatch(logout()),expirationTime*1000);
    }
}

export const authFail = (errorObject) => {
    return {
        type: actions.AUTH_FAIL,
        error: errorObject
    }
}

export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem("token");
        if(!token){
            dispatch(logout());
        }
        else{
            const userId = localStorage.getItem("userId");
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if(expirationDate < new Date()){
                dispatch(logout());
            }
            else{
                dispatch(authSuccess(token,userId));
                dispatch(setExpirationTime((expirationDate.getTime()-new Date().getTime())/1000))
            }
            
        }
    }
}

export const auth = (formData,isSignIn) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: formData.email,
            password: formData.password,
            returnSecureToken: true
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQbp0YYgwBRV4aPY23XalonWrvI0OGKNo';

        if(isSignIn){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQbp0YYgwBRV4aPY23XalonWrvI0OGKNo';
        }
        console.log(authData);
        axios.post(url,authData).then(response => {
            console.log(response);
            const expirationDate = new Date(new Date().getTime()+response.data.expiresIn*1000);
            dispatch(authSuccess(response.data.idToken,response.data.localId));
            dispatch(setExpirationTime(response.data.expiresIn));
            localStorage.setItem("token",response.data.idToken);
            localStorage.setItem("expirationDate",expirationDate);
            localStorage.setItem("userId",response.data.localId);
            if(!isSignIn){
                const userObject = {
                    userId: localStorage.getItem("userId"),
                    name: formData.username,
                    email: formData.email,
                    submittedResponses: [],
                    createdPapers: []
                }
                axios.post("/users.json?auth="+response.data.idToken,userObject).then(response => {
                    localStorage.setItem("userKey",response.data.name);
                }).catch(error => console.log(error));
            }
            
        }).catch(error => {
            dispatch(authFail(error.response.data.error))
        })

    }
}
