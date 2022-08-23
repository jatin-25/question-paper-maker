import React, { useEffect } from 'react'
import './app.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import NewPaper from './pages/new_paper'
import PaperResponses from './pages/paper_responses'
import Toolbar from './components/toolbar'
import YourPapers from './pages/your_papers'
import QuestionPaper from './pages/question_paper'
import Profile from './pages/profile'
import SubmittedResponses from './pages/submitted_responses'
import AuthForm from './pages/authentication'
import NotFound from './pages/not_found'
import { checkAuthState } from './store/actions'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

const App = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(checkAuthState())
	}, [])

	useEffect(() => {
		if (authState.token && location.state) {
			navigate(location.state.prevPath)
		}
	}, [authState.token])

	return (
		<div>
			{authState.token ? <Toolbar /> : null}
			{
				<Routes>
					{authState.token ? (
						<>
							<Route path='/' exact element={<NewPaper />} />
							<Route path='/newPaper' element={<NewPaper />} />
							<Route path='/response' element={<PaperResponses />} />
							<Route path='/yourPapers' element={<YourPapers />} />
							<Route path='/submittedResponses' element={<SubmittedResponses />} />
							<Route path='/papers/:qkey' element={<QuestionPaper />} />
							<Route path={'/papers/:qkey/responses'} element={<PaperResponses />} />
							<Route path='/profile' element={<Profile />} />
							<Route path='/*' element={<NotFound />} />
						</>
					) : null}
					{authState.token == null ? (
						<>
							<Route path='/authenticate' element={<AuthForm />} />
							{localStorage.getItem('token') == null && (
								<Route
									path={'*'}
									element={
										<Navigate to='/authenticate' replace state={{ prevPath: location.pathname }} />
									}
								/>
							)}
						</>
					) : null}
				</Routes>
			}
		</div>
	)
}

export default App
