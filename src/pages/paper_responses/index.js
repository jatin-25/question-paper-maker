import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Response from '../../components/response'
import Collapse from '@kunukn/react-collapse'
import Button from '../../components/UI/button'
import { setLoading } from '../../store/actions'
import BackDrop from '../../components/hoc/backdrop'
import './styles.css'
import { useParams } from 'react-router-dom'
import axiosCaller from '../../utils/axios'

const Responses = () => {
	const [responseData, setResponseData] = useState([])
	const { qkey } = useParams()
	const [isVisible, setIsVisible] = useState([])
	const [numberOfResponses, setNumberOfResponses] = useState(-1)
	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		const getPaperResponses = async () => {
			try {
				dispatch(setLoading(true))
				const queryParams = `?orderBy="paperId"&equalTo="${qkey}"`

				// getting all the responses whose paperId matches with our paparId
				const response = await axiosCaller({
					method: 'get',
					url: '/responses.json' + queryParams,
				})

				if (response.data == null) {
					setNumberOfResponses(0)
					dispatch(setLoading(false))
					return
				}

				setResponseData(Object.values(response.data))
				setNumberOfResponses(Object.values(response.data).length)
				setIsVisible(Array(Object.values(response.data).length).fill(false))

				dispatch(setLoading(false))
			} catch (error) {
				dispatch(setLoading(false))
			}
		}

		getPaperResponses()
	}, [])

	const showResponseHandler = (i) => {
		let newIsVisible = [...isVisible]
		newIsVisible[i] = !newIsVisible[i]
		setIsVisible(newIsVisible)
	}

	const closeResponseHandler = (i) => {
		let newIsVisible = [...isVisible]
		newIsVisible[i] = false
		setIsVisible(newIsVisible)
	}

	let responderInfoFeildTitles = null
	if (responseData[0] !== undefined) {
		responderInfoFeildTitles = (
			<div className='responseColNames'>
				{responseData[0].responderInfoFeilds.title.map((title, i) => {
					return <span key={i}>{title}</span>
				})}
				<span>Responses</span>
			</div>
		)
	}

	let responses = null
	if (responseData.length > 0) {
		responses = responseData.map((response, i) => {
			return (
				<div key={i} className='response'>
					<div className='responsesContent'>
						{response.responderInfoFeilds.answer
							? response.responderInfoFeilds.answer.map((feild, i) => <span key={i}>{feild}</span>)
							: null}
						<Button
							varient='secondary'
							onClick={() => showResponseHandler(i)}
							className='largeScreen'
							style={{ margin: 'auto' }}
						>
							View Response
						</Button>

						<Button
							varient='secondary'
							onClick={() => showResponseHandler(i)}
							className='smallScreen'
							style={{ margin: 'auto' }}
						>
							View
						</Button>
					</div>

					<Collapse
						isOpen={isVisible[i]}
						transition='height 0.7s cubic-bezier(.4, 0, .2, 1)'
						className='collapsibleContent'
					>
						<div className='collapsible'>
							<Response isDataArrived={true} data={response.questionArr} />
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
					<p>You haven't got any responses yet.</p>
				</div>
			) : null}
			{numberOfResponses > 0 ? (
				<div className='responses'>
					{responderInfoFeildTitles}
					{responses}
				</div>
			) : null}
		</BackDrop>
	)
}

export default Responses
