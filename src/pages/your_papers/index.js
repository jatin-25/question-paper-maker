import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosCaller from '../../utils/axios'
import { setLoading } from '../../store/actions/index'
import { useSelector, useDispatch } from 'react-redux'
import BackDrop from '../../components/hoc/backdrop'
import * as BiIcons from 'react-icons/bi'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import swal from 'sweetalert'
import './styles.css'
import { Button } from '../../components/UI'

const YourPapers = () => {
	const [questionData, setQuestionData] = useState([])
	const [numberOfPapers, setNumberOfPapers] = useState(-1)
	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		const getCreatedPapers = async () => {
			try {
				dispatch(setLoading(true))
				const response = await axiosCaller({
					method: 'get',
					url: '/users/' + authState.userKey + '/createdPapers.json',
				})

				if (response.data == null) {
					setNumberOfPapers(0)
					dispatch(setLoading(false))
					return
				}

				setQuestionData(Object.values(response.data))
				setNumberOfPapers(Object.values(response.data).length)
				dispatch(setLoading(false))
			} catch (error) {
				dispatch(setLoading(false))
			}
		}

		getCreatedPapers()
	}, [])

	const linkCopied = () => {
		swal({
			title: 'Congratulations!',
			text: 'The link of your paper has been copied!',
			icon: 'success',
			button: 'Okay!',
		})
	}

	let responderInfoFeildTitles = null
	if (questionData[0] !== undefined) {
		responderInfoFeildTitles = (
			<div className='paperColNames'>
				<span>Title</span>
				<span>Question Paper</span>
				<span>Responses</span>
			</div>
		)
	}

	let questions = null
	if (questionData.length > 0) {
		questions = questionData.map((question, i) => {
			return (
				<div key={i} className='questionPapers'>
					<div className='row mobile'>
						<CopyToClipboard
							text={window.location.origin + '/papers/' + question.paperId}
							onCopy={() => linkCopied()}
						>
							<div className='titleContainer'>
								<span>{question.paperTitle}</span>
								<BiIcons.BiShareAlt />
							</div>
						</CopyToClipboard>

						<Button
							varient='secondary'
							onClick={() => navigate('/papers/' + questionData[i].paperId)}
							className='btn'
						>
							View
						</Button>

						<Button
							varient='secondary'
							onClick={() => navigate('/papers/' + questionData[i].paperId + '/responses')}
							className='btn'
						>
							View
						</Button>
					</div>

					<div className='row tab'>
						<CopyToClipboard
							text={window.location.origin + '/papers/' + question.paperId}
							onCopy={() => linkCopied()}
						>
							<div className='titleContainer'>
								<span>{question.paperTitle}</span>
								<BiIcons.BiShareAlt />
							</div>
						</CopyToClipboard>

						<Button
							varient='secondary'
							onClick={() => navigate('/papers/' + questionData[i].paperId)}
							className='btn'
						>
							View Paper
						</Button>

						<Button
							varient='secondary'
							onClick={() => navigate('/papers/' + questionData[i].paperId + '/responses')}
							className='btn'
						>
							View Responses
						</Button>
					</div>
				</div>
			)
		})
	}

	return (
		<BackDrop isLoading={authState.loading}>
			{numberOfPapers === 0 ? (
				<div className='noPapers'>
					<p>You haven't created any papers yet.</p>
				</div>
			) : null}
			{numberOfPapers > 0 ? (
				<div className='yourPapersContent'>
					{responderInfoFeildTitles}
					{questions}
				</div>
			) : null}
		</BackDrop>
	)
}

export default YourPapers
