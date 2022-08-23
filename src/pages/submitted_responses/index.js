import React, { useEffect, useState } from 'react'
import { Button } from '../../components/UI'
import { useSelector, useDispatch } from 'react-redux'
import Collapse from '@kunukn/react-collapse'
import Response from '../../components/response'
import { setLoading } from '../../store/actions'
import BackDrop from '../../components/hoc/backdrop'
import axiosCaller from '../../utils/axios'
import './styles.css'

const SubmittedResponses = () => {
	const [responses, setResponses] = useState([])
	const [numberOfResponses, setNumberOfResponses] = useState(-1)
	const [isVisible, setIsVisible] = useState([])
	const [currentResponseData, setCurrentResponseData] = useState({})

	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	const showResponseHandler = (responseId, i) => {
		if (isVisible[i] === true) {
			let newIsVisible = [...isVisible]
			newIsVisible[i] = !newIsVisible[i]
			setIsVisible(newIsVisible)
			return
		}

		const getResponse = async () => {
			const response = await axiosCaller({
				method: 'get',
				url: '/responses.json',
				params: {
					orderBy: `"responseId"`,
					equalTo: `"${responseId}"`,
				},
			})

			const currentResponseData = Object.values(response.data)[0]
			setCurrentResponseData(currentResponseData)
			let newIsVisible = [...isVisible]
			newIsVisible[i] = !newIsVisible[i]
			setIsVisible(newIsVisible)
		}

		getResponse()
	}

	const closeResponseHandler = (i) => {
		let newIsVisible = [...isVisible]
		newIsVisible[i] = false
		setIsVisible(newIsVisible)
	}

	useEffect(() => {
		const getSubmittedResponses = async () => {
			try {
				dispatch(setLoading(true))
				const response = await axiosCaller({
					method: 'get',
					url: '/users/' + authState.userKey + '/submittedResponses.json',
				})

				if (response.data == null) {
					setNumberOfResponses(0)
					dispatch(setLoading(false))
					return
				}

				setResponses(Object.values(response.data))
				setNumberOfResponses(Object.values(response.data).length)
				setIsVisible(Array(Object.values(response.data).length).fill(false))

				dispatch(setLoading(false))
			} catch (error) {
				dispatch(setLoading(false))
			}
		}

		getSubmittedResponses()
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
			{numberOfResponses === 0 ? (
				<div className='noPapers'>
					<p>You haven't submitted any responses yet.</p>
				</div>
			) : null}
			{numberOfResponses > 0 ? (
				<div className='submittedResponses'>
					{titles}
					{responsesComp}
				</div>
			) : null}
		</BackDrop>
	)
}

export default SubmittedResponses
