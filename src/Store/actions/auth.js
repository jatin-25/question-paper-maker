import * as actions from "./actionTypes";
import axios from "../../axios";
export const authStart = () => {
  return {
    type: actions.AUTH_START,
  };
};

export const authSuccess = (idToken, localId, userKey, email) => {
  return {
    type: actions.AUTH_SUCCESS,
    idToken: idToken,
    localId: localId,
    userKey: userKey,
    email: email,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("userKey");
  localStorage.removeItem("email");
  return {
    type: actions.AUTH_LOGOUT,
  };
};

export const setExpirationTime = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const loading = (isLoading) => {
  return {
    type: actions.LOADING,
    isLoading: isLoading,
  };
};
export const setLoading = (isLoading) => {
  return (dispatch) => {
    dispatch(loading(isLoading));
  };
};

export const authFail = (errorObject) => {
  return {
    type: actions.AUTH_FAIL,
    error: errorObject,
  };
};

export const checkAuthState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const userId = localStorage.getItem("userId");
      const userKey = localStorage.getItem("userKey");
      const email = localStorage.getItem("email");
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, userId, userKey, email));
        dispatch(
          setExpirationTime(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const auth = (formData, isSignIn, navigate, onAuthFail) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: formData.email,
      password: formData.password,
      returnSecureToken: true,
    };

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQbp0YYgwBRV4aPY23XalonWrvI0OGKNo";

    if (isSignIn) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQbp0YYgwBRV4aPY23XalonWrvI0OGKNo";
    }
    axios
      .post(url, authData)
      .then((response) => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );

        if (!isSignIn) {
          const userObject = {
            userId: response.data.localId,
            name: formData.username,
            email: formData.email,
            submittedResponses: [],
            createdPapers: [],
          };
          axios
            .post("/users.json?auth=" + response.data.idToken, userObject)
            .then((userResponse) => {
              dispatch(
                authSuccess(
                  response.data.idToken,
                  response.data.localId,
                  userResponse.data.name,
                  response.data.email
                )
              );
              dispatch(setExpirationTime(response.data.expiresIn));
              localStorage.setItem("token", response.data.idToken);
              localStorage.setItem("expirationDate", expirationDate);
              localStorage.setItem("userId", response.data.localId);
              localStorage.setItem("userKey", userResponse.data.name);
              localStorage.setItem("email", response.data.email);
              navigate("/newPaper");
            })
            .catch((error) => {
              onAuthFail(error?.response?.data?.error);
              dispatch(authFail(error?.response?.data?.error));
            });
        } else {
          const queryParams = `?auth=${response.data.idToken}&orderBy="userId"&equalTo="${response.data.localId}"`;
          axios
            .get("/users.json" + queryParams)
            .then((userResponse) => {
              dispatch(
                authSuccess(
                  response.data.idToken,
                  response.data.localId,
                  Object.keys(userResponse.data)[0],
                  response.data.email
                )
              );
              dispatch(setExpirationTime(response.data.expiresIn));
              localStorage.setItem("token", response.data.idToken);
              localStorage.setItem("expirationDate", expirationDate);
              localStorage.setItem("userId", response.data.localId);
              localStorage.setItem(
                "userKey",
                Object.keys(userResponse.data)[0]
              );
              localStorage.setItem("email", response.data.email);
              navigate("/newPaper");
            })
            .catch((error) => {
              onAuthFail(error?.response?.data?.error);
              dispatch(authFail(error?.response?.data?.error))
            });
        }
      })
      .catch((error) => {
        onAuthFail(error?.response?.data?.error)
        dispatch(authFail(error?.response?.data?.error));
      });
  };
};
