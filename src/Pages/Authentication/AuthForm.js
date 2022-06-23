import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import log from "../../assets/log.svg";
import register from "../../assets/register.svg";
import googleIcon from "../../assets/google-logo.png";
import facebookIcon from "../../assets/facebook-brands.svg";
import twitterIcon from "../../assets/twitter-brands.svg";
import userIcon from "../../assets/user-solid.svg";
import appleIcon from "../../assets/apple-brands.svg";
import emailIcon from "../../assets/envelope-solid.svg";
import passwordIcon from "../../assets/lock-solid.svg";
import * as actions from "../../Store/Actions/index";
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";

const AuthForm = (props) => {
  const [state, setState] = useState({
    loginForm: {
      Email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: " Email ID",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        error: "Email can't be Empty.",
        imageSrc: emailIcon,
      },
      Password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: " Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        touched: false,
        error: "Password can't be Empty.",
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
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        error: "Username can't be Empty.",
        imageSrc: userIcon,
      },
      Email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: " Email ID",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
        error: "Email can't be Empty.",
        imageSrc: emailIcon,
      },
      Password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: " Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
        },
        valid: false,
        touched: false,
        error: "Password can't be Empty.",
        imageSrc: passwordIcon,
      },
      formIsValid: false,
      showErrors: false,
    },
    isSignUp: false,
  });

  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const onInputChangeHandler = (event, elementIdentifier) => {
    let newForm = { ...state.loginForm };
    if (state.isSignUp) {
      newForm = { ...state.signUpForm };
    }
    const updatedFormElement = { ...newForm[elementIdentifier] };
    updatedFormElement.value = event.target.value;

    const errorObject = checkValidation(
      updatedFormElement.value,
      updatedFormElement.validation,
      elementIdentifier
    );
    updatedFormElement.valid = errorObject.valid;

    updatedFormElement.touched = true;
    updatedFormElement.error = errorObject.error;
    newForm[elementIdentifier] = updatedFormElement;

    let isFormValid = true;
    for (let element in newForm) {
      if (element === "formIsValid" || element === "showErrors") {
        continue;
      }
      isFormValid = isFormValid && newForm[element].valid;
    }
    newForm.formIsValid = isFormValid;
    newForm.showErrors = false;
    if (state.isSignUp) {
      setState({ ...state, signUpForm: newForm });
    } else {
      setState({ ...state, loginForm: newForm });
    }
  };

  const onAuthSuccess = (path) => {
    navigate(path);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let formData = null;
    let isValid = true;
    if (state.isSignUp) {
      if (!state.signUpForm.formIsValid) {
        let signUpForm = { ...state.signUpForm };
        signUpForm.showErrors = true;
        isValid = isValid && false;
        setState({ ...state, signUpForm: signUpForm });
      } else {
        formData = {
          username: state.signUpForm.Username.value,
          email: state.signUpForm.Email.value,
          password: state.signUpForm.Password.value,
        };
      }
    } else {
      if (!state.loginForm.formIsValid) {
        let loginForm = { ...state.loginForm };
        loginForm.showErrors = true;
        isValid = isValid && false;
        setState({ ...state, loginForm: loginForm });
      } else {
        formData = {
          email: state.loginForm.Email.value,
          password: state.loginForm.Password.value,
        };
      }
    }
    if (isValid) {
      dispatch(actions.auth(formData, !state.isSignUp, onAuthSuccess));
    }
  };

  //   const switchSignUpHandler = (event) => {
  //     event.preventDefault();
  //     const newState = { ...state };
  //     newState.isSignUp = !state.isSignUp;
  //     setState(newState);
  //   };

  const changeToSignUp = () => {
    setState({ ...state, isSignUp: true });
  };

  const changeToSignIn = () => {
    setState({ ...state, isSignUp: false });
  };

  const loginKeyArr = Object.keys(state.loginForm);
  const loginFormObject = Object.values(state.loginForm).slice(0, 2);
  const signUpKeyArr = Object.keys(state.signUpForm);
  const signUpFormObject = Object.values(state.signUpForm).slice(0, 3);

  const loginFormElements = loginFormObject.map((elementData, i) => {
    return (
      <div
        key={i}
        className={[
          "inputField",
          elementData.touched && !elementData.valid ? "invalidElement" : null,
        ].join(" ")}
      >
        <img src={elementData.imageSrc} className="icon" alt={loginKeyArr[i]} />
        <input
          {...elementData.elementConfig}
          value={elementData.value}
          onChange={(event) => onInputChangeHandler(event, loginKeyArr[i])}
          className={
            !elementData.valid && elementData.touched ? "invalid" : null
          }
        />
      </div>
    );
  });

  const signUpFormElements = signUpFormObject.map((elementData, i) => {
    return (
      <div
        key={i}
        className={[
          "inputField",
          elementData.touched && !elementData.valid ? "invalidElement" : null,
        ].join(" ")}
      >
        <img
          src={elementData.imageSrc}
          className="icon"
          alt={signUpKeyArr[i]}
        />
        <input
          {...elementData.elementConfig}
          value={elementData.value}
          onChange={(event) => onInputChangeHandler(event, signUpKeyArr[i])}
          className={
            !elementData.valid && elementData.touched ? "invalid" : null
          }
        />
      </div>
    );
  });

  let signUpErrorMessage = null;
  let signInErrorMessage = null;

  if (state.isSignUp) {
    if (!state.signUpForm.formIsValid) {
      signUpErrorMessage = signUpFormObject.map((elementData, i) => {
        return (
          <p key={i} className="errorElement">
            {elementData.error}
          </p>
        );
      });
    }
  } else {
    if (!state.loginForm.formIsValid) {
      signInErrorMessage = loginFormObject.map((elementData, i) => {
        return (
          <p key={i} className="errorElement">
            {elementData.error}
          </p>
        );
      });
    }
  }

  if (authState.error) {
    let errorMessage = authState.error.message;
    let em = errorMessage.split("_");
    let lowerCase = em.map((word) => word.toLowerCase());
    let ans = lowerCase.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    errorMessage = ans.join(" ");
    if (state.isSignUp && state.signUpForm.formIsValid) {
      signUpErrorMessage = <p>{errorMessage}</p>;
    } else if (state.loginForm.formIsValid) {
      signInErrorMessage = <p>{errorMessage}</p>;
    }
  }

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
                    (state.loginForm.showErrors === true &&
                      !state.loginForm.formIsValid === true) ||
                    authState.error
                      ? "error"
                      : "none"
                  }
                >
                  {signInErrorMessage}
                </div>
                {loginFormElements}
                <button
                  className={[
                    "btn",
                    state.loginForm.formIsValid ? "valid" : null,
                  ].join(" ")}
                  onClick={submitHandler}
                >
                  Login
                </button>
                <p className="socialText">Sign in with social platforms</p>
                <div className="socialMedia">
                  <div className="socialIcon">
                    <img src={googleIcon} className="icon" alt="Google" />
                  </div>
                  <div className="socialIcon">
                    <img src={appleIcon} alt="Apple" />
                  </div>
                  <div className="socialIcon">
                    <img src={facebookIcon} alt="Facebook" />
                  </div>
                  <div className="socialIcon">
                    <img src={twitterIcon} alt="Twitter" />
                  </div>
                </div>
              </form>
            </div>
            <div className="signUpContainer">
              <p className="title-heading">Question Paper Maker</p>
              <form className="signUpForm">
                <h2 className="title">Sign Up</h2>
                {state.signUpForm.showErrors &&
                !state.signUpForm.formIsValid ? (
                  <div className="error">{signUpErrorMessage}</div>
                ) : null}
                {signUpFormElements}
                <button
                  className={[
                    "btn",
                    state.signUpForm.formIsValid ? "valid" : null,
                  ].join(" ")}
                  onClick={submitHandler}
                >
                  Sign Up
                </button>
                <p className="socialText">Sign Up with social platforms</p>
                <div className="socialMedia">
                  <div className="socialIcon">
                    <img src={googleIcon} className="icon" alt="Google" />
                  </div>
                  <div className="socialIcon">
                    <img src={appleIcon} alt="Apple" />
                  </div>
                  <div className="socialIcon">
                    <img src={facebookIcon} alt="Facebook" />
                  </div>
                  <div className="socialIcon">
                    <img src={twitterIcon} alt="Twitter" />
                  </div>
                </div>
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
                className={["btn", "transparent", "valid"].join(" ")}
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
                className={["btn", "transparent", "valid"].join(" ")}
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
};

export default AuthForm;
