import React, { Component } from "react";
import classes from './AuthForm.css';
import log from '../../assets/log.svg';
import register from '../../assets/register.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import googleIcon from '../../assets/google-logo.png';
import facebookIcon from '../../assets/facebook-brands.svg';
import twitterIcon from '../../assets/twitter-brands.svg';
import userIcon from '../../assets/user-solid.svg';
import appleIcon from '../../assets/apple-brands.svg';
import emailIcon from '../../assets/envelope-solid.svg';
import passwordIcon from '../../assets/lock-solid.svg';
import * as actions from '../../Store/Actions/index';
import { connect } from 'react-redux';
import Spinner from "../UI/Spinner/Spinner";
class AuthForm extends Component{

    state = {
        loginForm: {
            email: {
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
                imageSrc: emailIcon
            },
            password: {
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
                imageSrc: passwordIcon
            },
            formIsValid: false
        },
        signUpForm: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: ' Full Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 1
                },
                valid: false,
                touched: false,
                imageSrc: userIcon
            },
            email: {
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
                imageSrc: emailIcon
            },
            password: {
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
                imageSrc: passwordIcon
            },
            formIsValid: false
        },
        isSignUp: false
    }


    checkValidation = (value, rules) => {
        let isValid = false;

        if (rules.required) {
            isValid = (value.trim() !== '');
        }
        if (rules.maxLength) {
            isValid = isValid && (value.length <= rules.maxLength);
        }
        if (rules.minLength) {
            isValid = isValid && (value.length >= rules.minLength);
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid;
    }

    onInputChangeHandler = (event, elementIdentifier) => {
        let newForm = { ...this.state.loginForm };
        if (this.state.isSignUp) {
            newForm = { ...this.state.signUpForm };
        }
        // if (!this.state.isSignUp) {
        //     newLoginForm.slice(1);
        // }
        console.log(newForm);
        const updatedFormElement = { ...newForm[elementIdentifier] }
        updatedFormElement.value = event.target.value;

        updatedFormElement.valid = this.checkValidation(updatedFormElement.value, updatedFormElement.validation);
        console.log(updatedFormElement.valid)
        updatedFormElement.touched = true;
        newForm[elementIdentifier] = updatedFormElement;

        let isFormValid = true;
        for (let element in newForm) {
            // console.log(newLoginForm[loginElement].valid);
            if (element === "formIsValid") {
                continue;
            }
            console.log(element, newForm[element].valid)
            isFormValid = isFormValid && newForm[element].valid;
        }
        newForm.formIsValid = isFormValid;
        console.log(isFormValid);
        if (this.state.isSignUp) {
            this.setState({ signUpForm: newForm});
        }
        else {
            this.setState({ loginForm: newForm});
        }
    }


    submitHandler = (event) => {
        event.preventDefault();
        let formData = null;
        if (this.state.isSignUp) {
            formData = {
                username: this.state.signUpForm.username.value,
                email: this.state.signUpForm.email.value,
                password: this.state.signUpForm.password.value,
            }
        }
        else {
            formData = {
                email: this.state.loginForm.email.value,
                password: this.state.loginForm.password.value,
            }
        }
        this.props.onAuth(formData, !this.state.isSignUp);
    }


    switchSignUpHandler = (event) => {
        event.preventDefault();
        this.setState({ isSignUp: !this.state.isSignUp });
    }

    changeToSignUp = () => {
       
        this.setState({ isSignUp:true});
       
    }

    changeToSignIn = () => {
       
        this.setState({ isSignUp: false })
    }

    render() {

        const loginKeyArr = Object.keys(this.state.loginForm);
        const loginFormObject = Object.values(this.state.loginForm).slice(0,2);
        const signUpKeyArr = Object.keys(this.state.signUpForm);
        const signUpFormObject = Object.values(this.state.signUpForm).slice(0,3);

        const loginFormElements = loginFormObject.map((elementData, i) => {
            return <div key={i} className={[classes.inputField, (elementData.touched && !(elementData.valid)) ? classes.invalidElement : null].join(" ")}>
                {/* {console.log(elementData.touched, !elementData.valid)} */}
                <img src={elementData.imageSrc} className={classes.icon}/>
                <input
                    {...elementData.elementConfig}
                    value={elementData.value}
                    onChange={(event) => this.onInputChangeHandler(event, loginKeyArr[i])}
                    className={!elementData.valid && elementData.touched ? classes.invalid:null}
                />
            </div>
        })

        const signUpFormElements = signUpFormObject.map((elementData, i) => {
            return <div key={i} className={[classes.inputField, (elementData.touched && !(elementData.valid)) ? classes.invalidElement : null].join(" ")}>
                <img src={elementData.imageSrc} className={classes.icon} />
                <input
                    {...elementData.elementConfig}
                    value={elementData.value}
                    onChange={(event) => this.onInputChangeHandler(event, signUpKeyArr[i])}
                    className={!elementData.valid && elementData.touched ? classes.invalid : null}
                />
            </div>
        })

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = this.props.error.message;
        }

        return (
            <div className={this.state.isSignUp === false?classes.container:[classes.container,classes.signUpMode].join(" ")}>
                <div className={classes.formsContainer}>
                    <div className={classes.signinSignup}>
                        <form action="#" className={classes.signInForm}>
                            <h2 className={classes.title}>Sign in</h2>
                            {errorMessage}
                            {/*
                            <div className={classes.inputField}>
                                <img src={emailIcon} className={classes.icon}/>
                                <input type="text" placeholder="Email"/>
                            </div>
                            <div className={classes.inputField}>
                                <img src={passwordIcon} className={classes.icon}/>
                                <input type="password" placeholder="Password" />
                            </div> */}
                            {loginFormElements}
                            <button className={[classes.btn, this.state.loginForm.formIsValid?classes.valid:null].join(" ")} onClick={this.submitHandler} disabled={!this.state.loginForm.formIsValid}>Login</button>
                            <p className={classes.socialText}>Sign in with social platforms</p>
                            <div className={classes.socialMedia}>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={googleIcon} className={ classes.icon}/>
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={appleIcon} />
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={facebookIcon} />
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={twitterIcon} />
                                </a>
                            </div>
                        </form>
                        <form action="#" className={classes.signUpForm}>
                            <h2 className={classes.title}>Sign Up</h2>
                            {signUpFormElements}
                            <button className={[classes.btn, this.state.signUpForm.formIsValid ? classes.valid : null].join(" ")} onClick={this.submitHandler} disabled={!this.state.signUpForm.formIsValid}>Sign Up</button>
                            <p className={classes.socialText}>Sign Up with social platforms</p>
                            <div className={classes.socialMedia}>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={googleIcon} className={classes.icon} />
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={appleIcon} />
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={facebookIcon} />
                                </a>
                                <a href="#" className={classes.socialIcon}>
                                    <img src={twitterIcon} />
                                </a>    
                            </div>
                        </form>
                    </div>
                </div>

                <div className={classes.panelsContainer}>
                    <div className={[classes.panel, classes.leftPanel].join(" ")}>
                        <div className={classes.content}>
                            <h3>New here ?</h3>
                            <p>
                                Join Now and start your journey of creating your own papers.
                            </p>
                            <button className={[classes.btn, classes.transparent,classes.valid].join(" ")} id="sign-up-btn" onClick={this.changeToSignUp}>
                                Sign up
                            </button>
                        </div>
                        <img src={log} className={classes.image} alt="" />
                    </div>
                    <div className={[classes.panel, classes.rightPanel].join(" ")}>
                        <div className={classes.content}>
                            <h3>One of us ?</h3>
                            <p>
                                Then start creating your own papers.
                            </p>
                            <button className={[classes.btn, classes.transparent].join(" ")} id="sign-in-btn" onClick={this.changeToSignIn}>
                                Sign in
                            </button>
                        </div>
                        <img src={register} className={classes.image} alt="" />
                    </div>
                </div>
            </div>
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