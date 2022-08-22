import React, { useState } from 'react'
import Button from '../../components/UI/button'
import { SignupForm, SigninForm } from '../../components/forms'
import './styles.css'

const AuthForm = () => {
	const [isSignUp, setIsSignUp] = useState(false)

	return (
		<div
			className={
				isSignUp === false ? ['container'].join(' ') : ['container', 'signUpMode'].join(' ')
			}
		>
			<div className='formsContainer'>
				<div className='signinSignup'>
					<SigninForm />
					<SignupForm />
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
	)
}

export default AuthForm
