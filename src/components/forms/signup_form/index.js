import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BiErrorCircle } from 'react-icons/bi'
import { authSuccess, authFail, authStart, setExpirationTime } from '../../../store/actions'
import { Input, Button } from '../../UI'
import { getUpdatedForm, extractError } from '../../../utils/form'
import { checkFormValidation } from '../../../utils/validation'
import axiosCaller from '../../../utils/axios'
import BackDrop from '../../hoc/backdrop'
import './styles.css'
import '../commonStyles.css'

const SignupForm = () => {
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
		isFormValid: false,
		showErrors: false,
	})

	const [showSignupAuthError, setShowSignupAuthError] = useState(false)
	const [signUpErrorMessage, setSignUpErrorMessage] = useState('')

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const authState = useSelector((state) => state.auth)

	const onSubmitHandler = async (event) => {
		event.preventDefault()

		const newForm = checkFormValidation(signUpForm)
		setSignUpForm(newForm)

		if (!newForm.isFormValid) return

		const formData = {
			username: signUpForm.elements[0].value,
			email: signUpForm.elements[1].value,
			password: signUpForm.elements[2].value,
			returnSecureToken: true,
		}

		try {
			dispatch(authStart())

			// signing up the user in Firebase Authentication
			const response = await axiosCaller({
				method: 'post',
				url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
				data: formData,
			})

			if (!response.data) {
				dispatch(authFail())
				return
			}

			// sending user details to the server
			await setUser(response)
		} catch (error) {
			dispatch(authFail())
			setSignUpErrorMessage(extractError(error?.response?.data?.error))
			setShowSignupAuthError(true)
		}
	}

	const setUser = async (response) => {
		const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)

		try {
			const userObject = {
				userId: response.data.localId,
				name: signUpForm.elements[0].value,
				email: signUpForm.elements[1].value,
			}

			const userResponse = await axiosCaller({
				method: 'post',
				url: '/users.json',
				params: {
					auth: response.data.idToken,
				},
				data: userObject,
			})

			if (!userResponse.data) {
				dispatch(authFail())
				return
			}

			dispatch(
				authSuccess(
					response.data.idToken,
					response.data.localId,
					userResponse.data.name,
					response.data.email,
					expirationDate
				)
			)

			dispatch(setExpirationTime(response.data.expiresIn))

			// navigates to new paper page if logged in successfully
			navigate('/newPaper')
		} catch (error) {
			dispatch(authFail())
			setSignUpErrorMessage(extractError(error?.response?.data?.error))
			setShowSignupAuthError(true)
		}
	}

	return (
		<BackDrop isLoading={authState.loading}>
			<div className='signUpContainer'>
				<p className='title-heading'>Question Paper Maker</p>

				<form className='signUpForm'>
					<h2 className='title'>Sign Up</h2>

					<div
						className={
							showSignupAuthError === true && signUpErrorMessage ? 'error showMainError' : 'error'
						}
					>
						<BiErrorCircle color='#fff' />
						<p>{signUpErrorMessage}</p>
					</div>

					{signUpForm.elements.map((elementData, i) => {
						return (
							<Input
								key={elementData.name}
								type='auth-input'
								iconName={elementData.name}
								elementConfig={elementData.elementConfig}
								value={elementData.value}
								onChange={(event) => setSignUpForm(getUpdatedForm(event, signUpForm, i))}
								error={elementData.error}
								isValid={elementData.isValid}
								showErrors={signUpForm.showErrors}
							/>
						)
					})}

					<Button varient='primary' onClick={onSubmitHandler}>
						Sign up
					</Button>
				</form>
			</div>
		</BackDrop>
	)
}

export default SignupForm
