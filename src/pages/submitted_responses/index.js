import axios from '../../axios'
import React, { useEffect, useState } from 'react'
import Button from '../../components/UI/button'
import { useSelector, useDispatch } from 'react-redux'
import Collapse from '@kunukn/react-collapse'
import Response from '../../components/response'
import { setLoading } from '../../store/actions'
import BackDrop from '../../components/hoc/backdrop'
import './styles.css'

const SubmittedResponses = (props) => {
	const [responses, setResponses] = useState([])
	const [isVisible, setIsVisible] = useState([])
	const [currentResponseData, setCurrentResponseData] = useState({})
	const [noResponse, setNoResponse] = useState(false)

	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	const showResponseHandler = (responseId, i) => {
		if (isVisible[i] === true) {
			let newIsVisible = [...isVisible]
			newIsVisible[i] = !newIsVisible[i]
			setIsVisible(newIsVisible)
		} else {
			const queryParams = `?auth=${authState.token}&orderBy="responseId"&equalTo="${responseId}"`
			axios
				.get('/responses.json' + queryParams)
				.then((response) => {
					const currentResponseData = Object.values(response.data)[0]
					setCurrentResponseData(currentResponseData)
					let newIsVisible = [...isVisible]
					newIsVisible[i] = !newIsVisible[i]
					setIsVisible(newIsVisible)
				})
				.catch((error) => {})
		}
	}

	const closeResponseHandler = (i) => {
		let newIsVisible = [...isVisible]
		newIsVisible[i] = false
		setIsVisible(newIsVisible)
	}

	useEffect(() => {
		dispatch(setLoading(true))
		axios
			.get('/users/' + authState.userKey + '/submittedResponses.json?auth=' + authState.token)
			.then((response) => {
				if (!response.data) {
					setNoResponse(true)
				} else {
					setResponses(Object.values(response.data))
					setIsVisible(Array(Object.values(response.data).length).fill(false))
				}
				dispatch(setLoading(false))
			})
			.catch((error) => {
				dispatch(setLoading(false))
			})
	}, [])

	let titles = null
	if (responses.length > 0) {
		titles = (
			<div className='colNames'>
				<span>Paper Title</span>
				<span>Response</span>
			</div>
		)
	}

	let responsesComp = null
	if (responses.length > 0) {
		responsesComp = responses.map((response, i) => {
			return (
				<div key={i} className='subResponse'>
					<div className='row'>
						<div className='smallScreen'>
							<span>{response.paperTitle}</span>
							<Button
								varient='secondary'
								onClick={() => showResponseHandler(response.responseId, i)}
							>
								View
							</Button>
						</div>

						<div className='largeScreen'>
							<span>{response.paperTitle}</span>
							<Button
								varient='secondary'
								onClick={() => showResponseHandler(response.responseId, i)}
							>
								View Response
							</Button>
						</div>
					</div>

					<Collapse
						isOpen={isVisible[i]}
						transition='height 0.7s cubic-bezier(.4, 0, .2, 1)'
						className='collapsibleContent'
					>
						<div className='collapsible'>
							<Response data={currentResponseData.questionArr} />

							<Button
								varient='secondary'
								style={{ marginLeft: 'auto' }}
								onClick={() => closeResponseHandler(i)}
							>
								Close
							</Button>
						</div>
					</Collapse>
				</div>
			)
		})
	}
	return (
		<BackDrop isLoading={authState.loading}>
			{noResponse ? (
				<div className='noPapers'>
					<p>You haven't submitted any responses yet.</p>
				</div>
			) : (
				<div className='submittedResponses'>
					{titles}
					{responsesComp}
				</div>
			)}
		</BackDrop>
	)
}

export default SubmittedResponses
