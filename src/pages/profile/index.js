import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../../store/actions'
import BackDrop from '../../components/hoc/backdrop'
import './styles.css'
import axiosCaller from '../../utils/axios'

const Profile = () => {
	const [userName, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [totalPapers, setTotalPapers] = useState(0)
	const [totalResponses, setTotalResponses] = useState(0)

	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		const getProfileInfo = async () => {
			try {
				dispatch(setLoading(true))
				const queryParams = `?orderBy="userId"&equalTo="${authState.userId}"`

				const response = await axiosCaller({
					method: 'get',
					url: '/users.json' + queryParams,
				})

				if (!response.data) {
					dispatch(setLoading(false))
					return
				}

				const userData = Object.values(response.data)[0]
				setUserName(userData.name)
				setEmail(userData.email)
				setTotalPapers(userData.createdPapers ? Object.keys(userData.createdPapers).length : 0)
				setTotalResponses(
					userData.submittedResponses ? Object.keys(userData.submittedResponses).length : 0
				)

				dispatch(setLoading(false))
			} catch (error) {
				dispatch(setLoading(false))
			}
		}

		getProfileInfo()
	}, [])

	const userData = (
		<div className='profileContent'>
			<p>Name :</p>
			<p>{userName}</p>
			<p>Email :</p>
			<p>{email}</p>
			<p>Total Papers Created :</p>
			<p>{totalPapers}</p>
			<p>Total Responses Submitted :</p>
			<p>{totalResponses}</p>
		</div>
	)
	return (
		<BackDrop isLoading={authState.loading}>
			<div className='profile'>
				<p className='heading'>Your Profile</p>
				{userData}
			</div>
		</BackDrop>
	)
}

export default Profile
