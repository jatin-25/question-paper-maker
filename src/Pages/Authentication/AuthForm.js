import React, { Component } from "react";
import './AuthForm.css';
import log from '../../assets/log.svg';
import register from '../../assets/register.svg';
import googleIcon from '../../assets/google-logo.png';
import facebookIcon from '../../assets/facebook-brands.svg';
import twitterIcon from '../../assets/twitter-brands.svg';
import userIcon from '../../assets/user-solid.svg';
import appleIcon from '../../assets/apple-brands.svg';
import emailIcon from '../../assets/envelope-solid.svg';
import passwordIcon from '../../assets/lock-solid.svg';
import * as actions from '../../Store/Actions/index';
import { connect } from 'react-redux';
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";


class AuthForm extends Component {

    state = {
        loginForm: {
            Email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: ' Email ID'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
                error: "Email can't be Empty.",
                imageSrc: emailIcon
            },
            Password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: ' Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8
                },
                valid: false,
                touched: false,
                error: "Password can't be Empty.",
                imageSrc: passwordIcon
            },
            formIsValid: false,
            showErrors: false
        },
        signUpForm: {
            Username: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: ' Full Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "Username can't be Empty.",
                imageSrc: userIcon
            },
            Email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: ' Email ID'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
                error: "Email can't be Empty.",
                imageSrc: emailIcon
            },
            Password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: ' Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8
                },
                valid: false,
                touched: false,
                error: "Password can't be Empty.",
                imageSrc: passwordIcon
            },
            formIsValid: false,
            showErrors: false
        },
        isSignUp: false
    }


    checkValidation = (value, rules, elementIdentifier) => {
        let isValid = true;
        let error = "";

        if (rules.maxLength) {
            const valid = (value.length <= rules.maxLength);
            isValid = isValid && valid;
            if (!valid) {
                error = "The Maximum Length of " + elementIdentifier + " is " + rules.maxLength + ".";
            }
        }
        if (rules.minLength) {
            const valid = (value.length >= rules.minLength);
            isValid = isValid && valid
            if (!valid) {
                error = elementIdentifier + " must be atleast " + rules.minLength + " characters long.";
            }
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const valid = pattern.test(value);
            isValid = valid && isValid;

            if (!valid) {
                error = elementIdentifier + " is Invalid.";
            }
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.required) {
            const valid = (value.trim() !== '');
            isValid = isValid && valid;
            if (!valid) {
                error = elementIdentifier + " can't be Empty.";
            }
        }
        return {
            valid: isValid,
            error: error
        }
    }

    onInputChangeHandler = (event, elementIdentifier) => {
        let newForm = { ...this.state.loginForm };
        if (this.state.isSignUp) {
            newForm = { ...this.state.signUpForm };
        }
        const updatedFormElement = { ...newForm[elementIdentifier] }
        updatedFormElement.value = event.target.value;

        const errorObject = this.checkValidation(updatedFormElement.value, updatedFormElement.validation, elementIdentifier);
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
        if (this.state.isSignUp) {
            this.setState({ signUpForm: newForm });
        }
        else {
            this.setState({ loginForm: newForm });
        }
    }

    submitHandler = (event) => {
        event.preventDefault();
        let formData = null;
        let isValid = true;
        if (this.state.isSignUp) {
            if (!this.state.signUpForm.formIsValid) {
                let signUpForm = { ...this.state.signUpForm };
                signUpForm.showErrors = true;
                isValid = isValid && false;
                this.setState({ signUpForm: signUpForm });
            }
            else {
                formData = {
                    username: this.state.signUpForm.Username.value,
                    email: this.state.signUpForm.Email.value,
                    password: this.state.signUpForm.Password.value,
                }
            }
        }
        else {
            if (!this.state.loginForm.formIsValid) {
                let loginForm = { ...this.state.loginForm }
                loginForm.showErrors = true;
                isValid = isValid && false;
                this.setState({ loginForm: loginForm });
            }
            else {
                formData = {
                    email: this.state.loginForm.Email.value,
                    password: this.state.loginForm.Password.value,
                }
            }
        }
        if (isValid) {
            this.props.onAuth(formData, !this.state.isSignUp);
        }
    }


    switchSignUpHandler = (event) => {
        event.preventDefault();
        this.setState({ isSignUp: !this.state.isSignUp });
    }

    changeToSignUp = () => {

        this.setState({ isSignUp: true });

    }

    changeToSignIn = () => {

        this.setState({ isSignUp: false })
    }

    render() {

        const loginKeyArr = Object.keys(this.state.loginForm);
        const loginFormObject = Object.values(this.state.loginForm).slice(0, 2);
        const signUpKeyArr = Object.keys(this.state.signUpForm);
        const signUpFormObject = Object.values(this.state.signUpForm).slice(0, 3);

        const loginFormElements = loginFormObject.map((elementData, i) => {
            return <div key={i} className={["inputField", (elementData.touched && !(elementData.valid)) ? "invalidElement" : null].join(" ")}>
                <img src={elementData.imageSrc} className="icon" alt={loginKeyArr[i]} />
                <input
                    {...elementData.elementConfig}
                    value={elementData.value}
                    onChange={(event) => this.onInputChangeHandler(event, loginKeyArr[i])}
                    className={!elementData.valid && elementData.touched ? "invalid" : null}
                />
            </div>
        })

        const signUpFormElements = signUpFormObject.map((elementData, i) => {
            return <div key={i} className={["inputField", (elementData.touched && !(elementData.valid)) ? "invalidElement" : null].join(" ")}>
                <img src={elementData.imageSrc} className="icon" alt={signUpKeyArr[i]} />
                <input
                    {...elementData.elementConfig}
                    value={elementData.value}
                    onChange={(event) => this.onInputChangeHandler(event, signUpKeyArr[i])}
                    className={!elementData.valid && elementData.touched ? "invalid" : null}
                />
            </div>
        })

        let signUpErrorMessage = null;
        let signInErrorMessage = null;

        if (this.state.isSignUp) {
            if (!(this.state.signUpForm.formIsValid)) {
                signUpErrorMessage = signUpFormObject.map((elementData, i) => {
                    return <p key={i} className="errorElement">{elementData.error}</p>
                })
            }
        }
        else {
            if (!(this.state.loginForm.formIsValid)) {
                signInErrorMessage = loginFormObject.map((elementData, i) => {
                    return <p key={i} className="errorElement">{elementData.error}</p>
                })
            }
        }

        if (this.props.error) {
            let errorMessage = this.props.error.message;
            let em = errorMessage.split("_");
            let lowerCase = em.map((word) => word.toLowerCase());
            let ans = lowerCase.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
            errorMessage = ans.join(" ");
            if (this.state.isSignUp && this.state.signUpForm.formIsValid) {
                signUpErrorMessage = <p>{errorMessage}</p>
            }
            else if (this.state.loginForm.formIsValid) {
                signInErrorMessage = <p>{errorMessage}</p>
            }
        }


        return (
            <BackDrop isLoading={this.props.loading}>
                <div className={this.state.isSignUp === false ? ["container"].join(" ") : ["container", "signUpMode"].join(" ")}>
                    <div className="formsContainer">
                        <div className="signinSignup">
                            <div className="signInContainer">
                                <p className="title-heading">Question Paper Maker</p>
                                <form className="signInForm">
                                    <h2 className="title">Sign in</h2>
                                    <div className={(this.state.loginForm.showErrors === true && !this.state.loginForm.formIsValid === true) || this.props.error ? "error" : "none"}>{signInErrorMessage}</div>
                                    {loginFormElements}
                                    <button className={["btn", this.state.loginForm.formIsValid ? "valid" : null].join(" ")} onClick={this.submitHandler}>Login</button>
                                    <p className="socialText">Sign in with social platforms</p>
                                    <div className="socialMedia">
                                        <a className="socialIcon">
                                            <img src={googleIcon} className="icon" alt="Google" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={appleIcon} alt="Apple" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={facebookIcon} alt="Facebook" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={twitterIcon} alt="Twitter" />
                                        </a>
                                    </div>
                                </form>
                            </div>
                            <div className="signUpContainer">
                                <p className="title-heading">Question Paper Maker</p>
                                <form className="signUpForm">
                                    <h2 className="title">Sign Up</h2>
                                    {(this.state.signUpForm.showErrors && !this.state.signUpForm.formIsValid) ? <div className="error">{signUpErrorMessage}</div> : null}
                                    {signUpFormElements}
                                    <button className={["btn", this.state.signUpForm.formIsValid ? "valid" : null].join(" ")} onClick={this.submitHandler}>Sign Up</button>
                                    <p className="socialText">Sign Up with social platforms</p>
                                    <div className="socialMedia">
                                        <a className="socialIcon">
                                            <img src={googleIcon} className="icon" alt="Google" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={appleIcon} alt="Apple" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={facebookIcon} alt="Facebook" />
                                        </a>
                                        <a className="socialIcon">
                                            <img src={twitterIcon} alt="Twitter" />
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div><div className="panelsContainer">
                        <div className={["panel", "leftPanel"].join(" ")}>
                            <div className="content">
                                <h3>New here ?</h3>
                                <p>
                                    Join Now and start your journey of creating your own papers.
                                </p>
                                <button className={["btn", "transparent", "valid"].join(" ")} onClick={this.changeToSignUp}>
                                    Sign up
                                </button>
                            </div>
                            <img src={log} className="image" alt="" />
                        </div>
                        <div className={["panel", "rightPanel"].join(" ")}>
                            <div className="content">
                                <h3>One of us ?</h3>
                                <p>
                                    Then start creating your own papers.
                                </p>
                                <button className={["btn", "transparent", "valid"].join(" ")} onClick={this.changeToSignIn}>
                                    Sign in
                                </button>
                            </div>
                            <img src={register} className="image" alt="" />
                        </div>
                    </div>
                </div>
            </BackDrop >
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (formData, isSignIn) => dispatch(actions.auth(formData, isSignIn))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);