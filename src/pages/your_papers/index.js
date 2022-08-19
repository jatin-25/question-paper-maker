import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axios from '../../axios'
import { setLoading } from '../../store/actions/index'
import { useSelector, useDispatch } from 'react-redux'
import BackDrop from '../../components/hoc/backdrop'
import * as BiIcons from 'react-icons/bi'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import swal from 'sweetalert'
import './styles.css'
import Button from '../../components/UI/button'

const YourPapers = (props) => {
	const [questionData, setQuestionData] = useState([])
	// const [questionKeyArr, setQuestionKeyArr] = useState([]);
	const [doPaperExists, setDoPaperExists] = useState(false)
	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoading(true))
		const queryParams = `?auth=${authState.token}`

		axios
			.get('/users/' + authState.userKey + '/createdPapers.json' + queryParams)
			.then((response) => {
				if (response.data) {
					setQuestionData(Object.values(response.data))
					// setQuestionKeyArr(Object.keys(response.data));
				} else {
					setDoPaperExists(true)
				}
				dispatch(setLoading(false))
			})
			.catch((error) => {
				dispatch(setLoading(false))
			})
	}, [])

	const showQuestionHandler = (i) => {
		props.updateQuestionRouteData({
			idx: i,
			id: questionData[i].paperId,
		})
	}

	const showResponsesHandler = (i) => {
		props.updateResponsesRouteData({
			idx: i,
			id: questionData[i].paperId,
		})
	}

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

						<Button varient='secondary' onClick={() => showQuestionHandler(i)} className='btn'>
							<NavLink
								to={'/papers/' + questionData[i].paperId}
								onClick={() => showResponsesHandler(i)}
							>
								View
							</NavLink>
						</Button>

						<Button varient='secondary' onClick={() => showQuestionHandler(i)} className='btn'>
							<NavLink
								to={'/yourPapers/' + i + '/responses'}
								onClick={() => showResponsesHandler(i)}
							>
								View
							</NavLink>
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

						<Button varient='secondary' onClick={() => showQuestionHandler(i)} className='btn'>
							<NavLink
								to={'/papers/' + questionData[i].paperId}
								onClick={() => showResponsesHandler(i)}
							>
								View Paper
							</NavLink>
						</Button>

						<Button varient='secondary' onClick={() => showQuestionHandler(i)} className='btn'>
							<NavLink
								to={'/yourPapers/' + i + '/responses'}
								onClick={() => showResponsesHandler(i)}
							>
								View Responses
							</NavLink>
						</Button>
					</div>
				</div>
			)
		})
	}

	return (
		<BackDrop isLoading={authState.loading}>
			{doPaperExists ? (
				<div className='noPapers'>
					<p>You haven't created any papers yet.</p>
				</div>
			) : (
				<div className='yourPapersContent'>
					{responderInfoFeildTitles}
					{questions}
				</div>
			)}
		</BackDrop>
	)
}

export default YourPapers
