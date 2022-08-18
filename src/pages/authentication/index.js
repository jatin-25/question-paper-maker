import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BiErrorCircle } from 'react-icons/bi'
import * as actions from '../../store/actions'
import BackDrop from '../../components/hoc/backdrop'
import './styles.css'
import Input from '../../components/UI/input'
import Button from '../../components/UI/button'

const AuthForm = () => {
	const [signInForm, setSignInForm] = useState({
		elements: [
			{
				name: 'Email',
				elementConfig: {
					type: 'email',
					placeholder: ' Email ID',
					autoComplete: 'username',
				},
				value: '',
				validation: {
					required: true,
					isEmail: true,
				},
				isValid: false,
				error: '',
			},
			{
				name: 'Password',
				elementConfig: {
					type: 'password',
					placeholder: ' Password',
					autoComplete: 'current-password',
				},
				value: '',
				validation: {
					required: true,
					minLength: 8,
				},
				isValid: false,
				error: '',
			},
		],
		formIsValid: false,
		showErrors: false,
	})

	const [signUpForm, setSignUpForm] = useState({
		elements: [
			{
				name: 'Username',
				elementConfig: {
					type: 'input',
					placeholder: ' Full Name',
					autoComplete: 'on',
				},
				value: '',
				validation: {
					required: true,
				},
				isValid: false,
				error: '',
			},
			{
				name: 'Email',
				elementConfig: {
					type: 'email',
					placeholder: ' Email ID',
					autoComplete: 'username',
				},
				value: '',
				validation: {
					required: true,
					isEmail: true,
				},
				isValid: false,
				error: '',
			},
			{
				name: 'Password',
				elementConfig: {
					type: 'password',
					placeholder: ' Password',
					autoComplete: 'new-password',
				},
				value: '',
				validation: {
					required: true,
					minLength: 8,
				},
				isValid: false,
				error: '',
			},
		],
		formIsValid: false,
		showErrors: false,
	})

	const [isSignUp, setIsSignUp] = useState(false)
	const [showSignInAuthError, setShowSignInAuthError] = useState(false)
	const [showSignupAuthError, setShowSignupAuthError] = useState(false)
	const [signInErrorMessage, setSignInErrorMessage] = useState('')
	const [signUpErrorMessage, setSignUpErrorMessage] = useState('')

	const authState = useSelector((state) => state.auth)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	//checks the validation of a particular form feild
	const checkValidation = (value, rules, elementIdentifier) => {
		let isFormValid = true
		let error = ''

		if (rules.maxLength) {
			const isValid = value.length <= rules.maxLength
			isFormValid = isFormValid && isValid
			if (!isValid) {
				error = 'The Maximum Length of ' + elementIdentifier + ' is ' + rules.maxLength + '.'
			}
		}

		if (rules.minLength) {
			const isValid = value.length >= rules.minLength
			isFormValid = isFormValid && isValid
			if (!isValid) {
				error = elementIdentifier + ' must be atleast ' + rules.minLength + ' characters long.'
			}
		}

		if (rules.isEmail) {
			const pattern =
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
			const isValid = pattern.test(value)
			isFormValid = isFormValid && isValid

			if (!isValid) {
				error = elementIdentifier + ' is Invalid.'
			}
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/
			isFormValid = pattern.test(value) && isFormValid
		}

		if (rules.required) {
			const isValid = value.trim() !== ''
			isFormValid = isFormValid && isValid
			if (!isValid) {
				error = elementIdentifier + " can't be Empty."
			}
		}
		return {
			isValid: isFormValid,
			error: error,
		}
	}

	//removes the error if a user starts typing again
	const cleanError = (newForm) => {
		for (let idx in newForm.elements) {
			let updatedFormElement = { ...newForm.elements[idx] }
			updatedFormElement.error = ''
			newForm.elements[idx] = updatedFormElement
		}

		if (isSignUp) {
			setSignUpForm(newForm)
			setShowSignupAuthError(false)
			return
		}

		setSignInForm(newForm)
		setShowSignInAuthError(false)
	}

	const onInputChangeHandler = (event, idx) => {
		let newForm = { ...signInForm }
		if (isSignUp) {
			newForm = { ...signUpForm }
		}

		if (newForm.showErrors) {
			cleanError(newForm)
		}

		const updatedElement = { ...newForm.elements[idx] }
		updatedElement.value = event.target.value
		updatedElement.isValid = false
		newForm.elements[idx] = updatedElement
		newForm.showErrors = false

		if (isSignUp) {
			setSignUpForm(newForm)
			return
		}

		setSignInForm(newForm)
	}

	// navigates to new paper page if logged in successfully
	const onAuthSuccess = (path) => {
		navigate(path)
	}

	// shows error message to the user in case of some api error
	const onAuthFail = (error) => {
		if (error) {
			let errorMessage = error.message
			let em = errorMessage.split('_')
			let lowerCase = em.map((word) => word.toLowerCase())
			let ans = lowerCase.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

			errorMessage = ans.join(' ')

			if (isSignUp) {
				setSignUpErrorMessage(errorMessage)
				setShowSignupAuthError(true)
			} else {
				setSignInErrorMessage(errorMessage)
				setShowSignInAuthError(true)
			}
		}
	}

	//checks validation of whole form when user clicks on login or signup
	const checkFormValidation = () => {
		let newForm = { ...signInForm }
		if (isSignUp) {
			newForm = { ...signUpForm }
		}

		let isFormValid = true
		for (let idx in newForm.elements) {
			const updatedFormElement = { ...newForm.elements[idx] }

			const errorObject = checkValidation(
				updatedFormElement.value,
				updatedFormElement.validation,
				updatedFormElement.name
			)

			updatedFormElement.isValid = errorObject.isValid
			updatedFormElement.error = errorObject.error
			newForm.elements[idx] = updatedFormElement
			isFormValid = isFormValid && newForm.elements[idx].isValid
		}

		newForm.formIsValid = isFormValid
		newForm.showErrors = !isFormValid

		if (isSignUp) {
			setSignUpForm(newForm)
			return isFormValid
		}

		setSignInForm(newForm)
		return isFormValid
	}

	const submitHandler = (event) => {
		event.preventDefault()
		const isFormValid = checkFormValidation()

		let formData = null

		if (!isFormValid) return

		if (isSignUp) {
			formData = {
				username: signUpForm.elements[0].value,
				email: signUpForm.elements[1].value,
				password: signUpForm.elements[2].value,
			}

			dispatch(actions.auth(formData, !isSignUp, onAuthSuccess, onAuthFail))
			return
		}

		formData = {
			email: signInForm.elements[0].value,
			password: signInForm.elements[1].value,
		}

		dispatch(actions.auth(formData, !isSignUp, onAuthSuccess, onAuthFail))
	}

	const loginFormElements = signInForm.elements.map((elementData, i) => {
		return (
			<Input
				key={elementData.name}
				type='auth-input'
				iconName={elementData.name}
				elementConfig={elementData.elementConfig}
				value={elementData.value}
				onChange={(event) => onInputChangeHandler(event, i)}
				error={elementData.error}
				isValid={elementData.isValid}
				showErrors={signInForm.showErrors}
			/>
		)
	})

	const signUpFormElements = signUpForm.elements.map((elementData, i) => {
		return (
			<Input
				key={elementData.name}
				type='auth-input'
				iconName={elementData.name}
				elementConfig={elementData.elementConfig}
				value={elementData.value}
				onChange={(event) => onInputChangeHandler(event, i)}
				error={elementData.error}
				isValid={elementData.isValid}
				showErrors={signUpForm.showErrors}
			/>
		)
	})

	return (
		<BackDrop isLoading={authState.loading}>
			<div
				className={
					isSignUp === false ? ['container'].join(' ') : ['container', 'signUpMode'].join(' ')
				}
			>
				<div className='formsContainer'>
					<div className='signinSignup'>
						<div className='signInContainer'>
							<span className='title-heading'>Question Paper Maker</span>

							<form className='signInForm'>
								<h2 className='title'>Sign in</h2>

								<div
									className={
										showSignInAuthError === true && signInErrorMessage
											? 'error showMainError'
											: 'error'
									}
								>
									<BiErrorCircle color='#fff' />
									<p>{signInErrorMessage}</p>
								</div>

								{loginFormElements}

								<Button varient={'primary'} onClick={submitHandler}>
									Login
								</Button>
							</form>
						</div>

						<div className='signUpContainer'>
							<p className='title-heading'>Question Paper Maker</p>

							<form className='signUpForm'>
								<h2 className='title'>Sign Up</h2>

								<div
									className={
										showSignupAuthError === true && signUpErrorMessage
											? 'error showMainError'
											: 'error'
									}
								>
									<BiErrorCircle color='#fff' />
									<p>{signUpErrorMessage}</p>
								</div>

								{signUpFormElements}

								<Button varient='primary' onClick={submitHandler}>
									Sign up
								</Button>
							</form>
						</div>
					</div>
				</div>

				<div className='panelsContainer'>
					<div className={['panel', 'leftPanel'].join(' ')}>
						<div className='content'>
							<h3>New here ?</h3>
							<p>Join Now and start your journey of creating your own papers.</p>

							<Button varient={'primary'} onClick={() => setIsSignUp(true)}>
								Sign up
							</Button>
						</div>

						<img src='/assets/log.svg' className='image' alt='Explorer' />
					</div>

					<div className={['panel', 'rightPanel'].join(' ')}>
						<div className='content'>
							<h3>One of us ?</h3>
							<p>Then start creating your own papers.</p>
							<Button varient={'primary'} onClick={() => setIsSignUp(false)}>
								Sign in
							</Button>
						</div>
						<img src='/assets/register.svg' className='image' alt='Register' />
					</div>
				</div>
			</div>
		</BackDrop>
	)
}

export default AuthForm
