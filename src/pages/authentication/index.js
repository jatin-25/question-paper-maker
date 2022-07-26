import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import log from "../../assets/log.svg";
import register from "../../assets/register.svg";
import userIcon from "../../assets/user-solid.svg";
import emailIcon from "../../assets/envelope-solid.svg";
import passwordIcon from "../../assets/lock-solid.svg";
import { BiErrorCircle } from 'react-icons/bi'
import * as actions from "../../store/actions";
import BackDrop from "../../components/hoc/backdrop";
import './styles.css'

const AuthForm = (props) => {
  const [state, setState] = useState({
    loginForm: {
      Email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: " Email ID",
          autoComplete: "username"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        error: "",
        imageSrc: emailIcon,
      },
      Password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: " Password",
          autoComplete: "current-password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        error: "",
        imageSrc: passwordIcon,
      },
      formIsValid: false,
      showErrors: false,
    },
    signUpForm: {
      Username: {
        elementType: "input",
        elementConfig: {
          type: "input",
          placeholder: " Full Name",
          autoComplete: "on"
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        error: "",
        imageSrc: userIcon,
      },
      Email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: " Email ID",
          autoComplete: "username"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        error: "",
        imageSrc: emailIcon,
      },
      Password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: " Password",
          autoComplete: "new-password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        error: "",
        imageSrc: passwordIcon,
      },
      formIsValid: false,
      showErrors: false,
    },
    isSignUp: false,
  });

  const [showLoginAuthError, setShowLoginAuthError] = useState(false);
  const [showSignupAuthError, setShowSignupAuthError] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");

  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  //checks the validation of a particular form feild
  const checkValidation = (value, rules, elementIdentifier) => {
    let isValid = true;
    let error = "";

    if (rules.maxLength) {
      const valid = value.length <= rules.maxLength;
      isValid = isValid && valid;
      if (!valid) {
        error =
          "The Maximum Length of " +
          elementIdentifier +
          " is " +
          rules.maxLength +
          ".";
      }
    }

    if (rules.minLength) {
      const valid = value.length >= rules.minLength;
      isValid = isValid && valid;
      if (!valid) {
        error =
          elementIdentifier +
          " must be atleast " +
          rules.minLength +
          " characters long.";
      }
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      const valid = pattern.test(value);
      isValid = valid && isValid;

      if (!valid) {
        error = elementIdentifier + " is Invalid.";
      }
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.required) {
      const valid = value.trim() !== "";
      isValid = isValid && valid;
      if (!valid) {
        error = elementIdentifier + " can't be Empty.";
      }
    }
    return {
      valid: isValid,
      error: error,
    };
  };


  //removes the error if a user starts typing again
  const cleanError = (newForm) => {
    for (let element in newForm) {
      let updatedFormElement = { ...newForm[element] }
      updatedFormElement.error = ""
      newForm[element] = updatedFormElement
    }
    if (state.isSignUp) {
      setState({ ...state, signUpForm: newForm });
      setShowSignupAuthError(false);
    } else {
      setShowLoginAuthError(false);
      setState({ ...state, loginForm: newForm });
    }
  }


  const onInputChangeHandler = (event, elementIdentifier) => {
    let newForm = { ...state.loginForm };
    if (state.isSignUp) {
      newForm = { ...state.signUpForm };
    }
    if (newForm.showErrors) {
      cleanError(newForm);
    }
    const updatedFormElement = { ...newForm[elementIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = false;
    newForm[elementIdentifier] = updatedFormElement;
    newForm.showErrors = false;

    if (state.isSignUp) {
      setState({ ...state, signUpForm: newForm });
    } else {
      setState({ ...state, loginForm: newForm });
    }
  };

  //navigates to new paper page if logged in successfully
  const onAuthSuccess = (path) => {
    navigate(path);
  };

  //shows error message to the user in case of some api error
  const onAuthFail = (error) => {
    if (error) {
      let errorMessage = error.message;
      let em = errorMessage.split("_");
      let lowerCase = em.map((word) => word.toLowerCase());
      let ans = lowerCase.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      errorMessage = ans.join(" ");

      if (state.isSignUp) {
        setShowSignupAuthError(true);
        setSignUpErrorMessage(errorMessage);
      } else {

        setShowLoginAuthError(true);
        setSignInErrorMessage(errorMessage)
      }
    }

  }

  //checks validation of whole form when user clicks on login or signup
  const checkFormValidation = () => {
    let newForm = { ...state.loginForm };
    if (state.isSignUp) {
      newForm = { ...state.signUpForm };
    }

    let isFormValid = true;
    for (let elementIdentifier in newForm) {
      if (elementIdentifier !== "formIsValid" && elementIdentifier !== "showErrors" && elementIdentifier !== "showAuthError") {
        const updatedFormElement = { ...newForm[elementIdentifier] };
        const errorObject = checkValidation(
          updatedFormElement.value,
          updatedFormElement.validation,
          elementIdentifier
        );
        updatedFormElement.valid = errorObject.valid;
        updatedFormElement.error = errorObject.error;
        newForm[elementIdentifier] = updatedFormElement;
        isFormValid = isFormValid && newForm[elementIdentifier].valid;
      }
    }
    newForm.formIsValid = isFormValid;
    newForm.showErrors = !isFormValid;
    if (state.isSignUp) {
      setState({ ...state, signUpForm: newForm });
    } else {
      setState({ ...state, loginForm: newForm });
    }
    return isFormValid;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const isFormValid = checkFormValidation()
    let formData = null;
    if (isFormValid) {
      if (state.isSignUp) {
        formData = {
          username: state.signUpForm.Username.value,
          email: state.signUpForm.Email.value,
          password: state.signUpForm.Password.value,
        };
      } else {
        formData = {
          email: state.loginForm.Email.value,
          password: state.loginForm.Password.value,
        };
      }
      dispatch(actions.auth(formData, !state.isSignUp, onAuthSuccess, onAuthFail));
    }
  };



  const changeToSignUp = () => {
    setState({ ...state, isSignUp: true });
  };

  const changeToSignIn = () => {
    setState({ ...state, isSignUp: false });
  };


  const loginKeyArr = Object.keys(state.loginForm);
  let loginFormObject = Object.values(state.loginForm).slice(0, 2);
  const signUpKeyArr = Object.keys(state.signUpForm);
  const signUpFormObject = Object.values(state.signUpForm).slice(0, 3);

  const loginFormElements = loginFormObject.map((elementData, i) => {
    return (
      <div
        key={i}
        className="inputContainer">
        <div className="inputField">
          <img src={elementData.imageSrc} className="icon" alt={loginKeyArr[i]} />
          <input
            {...elementData.elementConfig}
            value={elementData.value}
            onChange={(event) => onInputChangeHandler(event, loginKeyArr[i])}
          />
        </div>
        <div className={state.loginForm.showErrors === true && !elementData.valid ? "errorContainer showError" : "errorContainer"}>
          <BiErrorCircle color="#E33535" />
          <p>{elementData.error}</p>
        </div>
      </div>
    );
  })

  const signUpFormElements = signUpFormObject.map((elementData, i) => {
    return (
      <div
        key={i}
        className="inputContainer"
      >
        <div className=
          "inputField">
          <img
            src={elementData.imageSrc}
            className="icon"
            alt={signUpKeyArr[i]}
          />
          <input
            {...elementData.elementConfig}
            value={elementData.value}
            onChange={(event) => onInputChangeHandler(event, signUpKeyArr[i])}
          />
        </div>
        <div className={state.signUpForm.showErrors === true && !elementData.valid ? "errorContainer showError" : "errorContainer"}>
          <BiErrorCircle color="#E33535" />
          <p>{elementData.error}</p>
        </div>
      </div >
    );
  });



  return (
    <BackDrop isLoading={authState.loading}>
      <div
        className={
          state.isSignUp === false
            ? ["container"].join(" ")
            : ["container", "signUpMode"].join(" ")
        }
      >
        <div className="formsContainer">
          <div className="signinSignup">
            <div className="signInContainer">
              <p className="title-heading">Question Paper Maker</p>
              <form className="signInForm">
                <h2 className="title">Sign in</h2>
                <div
                  className={
                    (showLoginAuthError === true &&
                      signInErrorMessage)
                      ? "error showMainError"
                      : "error"
                  }
                >
                  <BiErrorCircle color="#fff" />
                  <p>{signInErrorMessage}</p>
                </div>
                {loginFormElements}
                <button
                  className={"btn aliceBlue"}
                  onClick={submitHandler}
                >
                  Login
                </button>
              </form>
            </div>
            <div className="signUpContainer">
              <p className="title-heading">Question Paper Maker</p>
              <form className="signUpForm">
                <h2 className="title">Sign Up</h2>
                <div
                  className={
                    (showSignupAuthError === true &&
                      signUpErrorMessage)
                      ? "error showMainError"
                      : "error"
                  }
                >
                  <BiErrorCircle color="#fff" />
                  <p>{signUpErrorMessage}</p>
                </div>
                {signUpFormElements}
                <button
                  className={"btn aliceBlue"}
                  onClick={submitHandler}
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="panelsContainer">
          <div className={["panel", "leftPanel"].join(" ")}>
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Join Now and start your journey of creating your own papers.
              </p>
              <button
                className={["btn", "transparent", "valid", "light"].join(" ")}
                onClick={changeToSignUp}
              >
                Sign up
              </button>
            </div>
            <img src={log} className="image" alt="" />
          </div>
          <div className={["panel", "rightPanel"].join(" ")}>
            <div className="content">
              <h3>One of us ?</h3>
              <p>Then start creating your own papers.</p>
              <button
                className={["btn", "transparent", "valid", "light"].join(" ")}
                onClick={changeToSignIn}
              >
                Sign in
              </button>
            </div>
            <img src={register} className="image" alt="" />
          </div>
        </div>
      </div>
    </BackDrop>
  );
}

export default AuthForm;
