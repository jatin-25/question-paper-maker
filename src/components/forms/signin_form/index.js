import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authSuccess, authFail, authStart, setExpirationTime } from '../../../store/actions'
import { BiErrorCircle } from 'react-icons/bi'
import { Button, Input } from '../../UI'
import { getUpdatedForm, extractError } from '../../../utils/form'
import { checkFormValidation } from '../../../utils/validation'
import axiosCaller from '../../../utils/axios'
import BackDrop from '../../hoc/backdrop'
import './styles.css'
import '../commonStyles.css'

const SigninForm = () => {
	const authState = useSelector((state) => state.auth)

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
		isFormValid: false,
		showErrors: false,
	})

	const [showSignInAuthError, setShowSignInAuthError] = useState(false)
	const [signInErrorMessage, setSignInErrorMessage] = useState('')

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const onSubmitHandler = async (event) => {
		event.preventDefault()
		const newForm = checkFormValidation(signInForm)
		setSignInForm(newForm)

		if (!newForm.isFormValid) return

		const formData = {
			email: signInForm.elements[0].value,
			password: signInForm.elements[1].value,
			returnSecureToken: true,
		}

		try {
			dispatch(authStart())

			// checking for user in Firebase Authentication Database
			const response = await axiosCaller({
				method: 'post',
				url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
				data: formData,
			})

			if (!response.data) {
				dispatch(authFail())
				return
			}

			// getting the user info
			await getUser(response)
		} catch (error) {
			dispatch(authFail())
			setSignInErrorMessage(extractError(error?.response?.data?.error))
			setShowSignInAuthError(true)
		}
	}

	const getUser = async (response) => {
		const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)

		try {
			const userResponse = await axiosCaller({
				method: 'get',
				url: '/users.json',
				params: {
					auth: response.data.idToken,
					orderBy: `"userId"`,
					equalTo: `"${response.data.localId}"`,
				},
			})

			if (!userResponse.data) return

			dispatch(
				authSuccess(
					response.data.idToken,
					response.data.localId,
					Object.keys(userResponse.data)[0],
					response.data.email,
					expirationDate
				)
			)

			dispatch(setExpirationTime(response.data.expiresIn))

			// navigates to new paper page if logged in successfully
			navigate('/newPaper')
		} catch (error) {
			dispatch(authFail())
			setSignInErrorMessage(extractError(error?.response?.data?.error))
			setShowSignInAuthError(true)
		}
	}

	return (
		<BackDrop isLoading={authState.loading}>
			<div className='signInContainer'>
				<span className='title-heading'>Question Paper Maker</span>

				<form className='signInForm'>
					<h2 className='title'>Sign in</h2>

					<div
						className={
							showSignInAuthError === true && signInErrorMessage ? 'error showMainError' : 'error'
						}
					>
						<BiErrorCircle color='#fff' />
						<p>{signInErrorMessage}</p>
					</div>

					{signInForm.elements.map((elementData, i) => {
						return (
							<Input
								key={elementData.name}
								type='auth-input'
								iconName={elementData.name}
								elementConfig={elementData.elementConfig}
								value={elementData.value}
								onChange={(event) => setSignInForm(getUpdatedForm(event, signInForm, i))}
								error={elementData.error}
								isValid={elementData.isValid}
								showErrors={signInForm.showErrors}
							/>
						)
					})}

					<Button varient={'primary'} onClick={onSubmitHandler}>
						Login
					</Button>
				</form>
			</div>
		</BackDrop>
	)
}

export default SigninForm
