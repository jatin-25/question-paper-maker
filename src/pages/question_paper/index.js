import React, { useEffect, useState } from 'react'
import { SCQuestion, MCQuestion, PGQuestion } from '../../components/question_types'
import ResponderInfoForm from '../../components/forms/responder_info_form'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../../store/actions'
import { useParams } from 'react-router-dom'
import BackDrop from '../../components/hoc/backdrop'
import { v4 as uuid } from 'uuid'
import swal from 'sweetalert'
import './styles.css'
import { Button } from '../../components/UI'
import axiosCaller from '../../utils/axios'

const QuestionPaper = () => {
	const [title, setTitle] = useState('')
	const { qkey } = useParams()
	const [isSubmitted, setIsSubmitted] = useState('Not Known')
	const [responderInfoFeilds, setResponderInfoFeilds] = useState({
		answer: [],
	})
	const [questionArr, setQuestionArr] = useState([])

	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	useEffect(() => {
		const getPaper = async () => {
			try {
				dispatch(setLoading(true))
				const queryParams = `?orderBy="paperId"&equalTo="${qkey}"`
				const response = await axiosCaller({
					method: 'get',
					url: '/users/' + authState.userKey + '/submittedResponses.json' + queryParams,
				})

				if (Object.values(response.data).length > 0) {
					setIsSubmitted(true)
					dispatch(setLoading(false))
					return
				}

				const queryParams2 = `?orderBy="paperId"&equalTo="${qkey}"`
				const paper = await axiosCaller({
					method: 'get',
					url: '/questionPapers.json' + queryParams2,
				})

				const questionPaper = Object.values(paper.data)
				if (questionPaper.length > 0) {
					setTitle(questionPaper[0].title)
					setResponderInfoFeilds(questionPaper[0].responderInfoFeilds)
					setQuestionArr(questionPaper[0].questionArr)
					setIsSubmitted(false)
				}

				dispatch(setLoading(false))
			} catch (error) {
				dispatch(setLoading(false))
			}
		}

		getPaper()
	}, [])

	const updateAnswerHandler = (answerObject) => {
		if (!answerObject) return

		let oldQuestionData = { ...questionArr[answerObject.index] }
		oldQuestionData.answer = answerObject.answer
		let newQuestionArr = [...questionArr]
		newQuestionArr.splice(answerObject.index, 1, oldQuestionData)
		setQuestionArr(newQuestionArr)
	}

	const updateResponderInfoFeildAnswerHandler = (answer) => {
		if (answer == null) return

		let responderInfoFeild = { ...responderInfoFeilds, answer: [] }
		responderInfoFeild.answer = answer
		setResponderInfoFeilds(responderInfoFeild)
	}

	const submitQuestionPaperHandler = () => {
		if (!onSubmitHandler()) {
			swal('Warning', "Essential Feilds can't be Empty!", 'warning')
			return
		}

		swal({
			title: 'Are you sure?',
			text: 'You want to submit your Paper!',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
		}).then((willSubmit) => {
			if (!willSubmit) return

			const questionPaperResponse = {
				responseId: uuid(),
				paperId: qkey,
				responderInfoFeilds: responderInfoFeilds,
				questionArr: questionArr,
			}

			try {
				dispatch(setLoading(true))
				axiosCaller({
					method: 'post',
					url: '/responses.json',
					data: questionPaperResponse,
				})

				addToSubmittedPapers(questionPaperResponse.responseId)
			} catch (error) {
				dispatch(setLoading(false))
			}
		})
	}

	const addToSubmittedPapers = async (responseId) => {
		try {
			const currentResponseId = {
				responseId: responseId,
				paperId: qkey,
				paperTitle: title,
			}

			await axiosCaller({
				method: 'post',
				url: '/users/' + authState.userKey + '/submittedResponses.json',
				data: currentResponseId,
			})

			setIsSubmitted(true)
			dispatch(setLoading(false))
		} catch (error) {
			dispatch(setLoading(false))
		}
	}

	const onSubmitHandler = () => {
		if (responderInfoFeilds.answer) {
			const answers = responderInfoFeilds.answer
			let isFormInvalid = false
			for (let i = 0; i < answers.length; ++i) {
				if (answers[i] == null || answers[i] === '') {
					isFormInvalid = true
					break
				}
			}
			if (isFormInvalid) {
				return false
			}
			return true
		} else {
			return false
		}
	}

	let responderInfoInputForm = null
	if (Object.keys(responderInfoFeilds || {})?.indexOf('title') !== -1) {
		responderInfoInputForm = (
			<ResponderInfoForm
				feilds={responderInfoFeilds.title}
				updateAnswer={updateResponderInfoFeildAnswerHandler}
			/>
		)
	}

	let questionsComponent = questionArr.map((question, i) => {
		let questionComp = null
		switch (question?.type) {
			case 'SingleChoiceQuestion':
				questionComp = (
					<SCQuestion
						optionsList={questionArr[i]?.optionsList}
						question={questionArr[i]?.question}
						key={i}
						qkey={i}
						updateAnswer={updateAnswerHandler}
						questionNo={i + 1}
						pageOnWhichRendered='questionPaper'
					/>
				)
				break

			case 'MultipleChoiceQuestion':
				questionComp = (
					<MCQuestion
						optionsList={questionArr[i]?.optionsList}
						question={questionArr[i]?.question}
						key={i}
						qkey={i}
						updateAnswer={updateAnswerHandler}
						questionNo={i + 1}
						pageOnWhichRendered='questionPaper'
					/>
				)
				break

			case 'ParagraphQuestion':
				questionComp = (
					<PGQuestion
						question={questionArr[i]?.question}
						key={i}
						qkey={i}
						updateAnswer={updateAnswerHandler}
						questionNo={i + 1}
						pageOnWhichRendered='questionPaper'
					/>
				)
				break
			default:
				break
		}
		return questionComp
	})

	return (
		<BackDrop isLoading={authState.loading}>
			{isSubmitted === true ? (
				<div className='noPapers'>
					<p>Your response has been submitted.</p>
				</div>
			) : null}

			{isSubmitted !== null && isSubmitted === false ? (
				<div className='paperWrapper'>
					{responderInfoInputForm}
					<div className='paper'>{questionsComponent}</div>
					<div className='submitBtn'>
						<Button varient='secondary' onClick={submitQuestionPaperHandler}>
							Submit
						</Button>
					</div>
				</div>
			) : null}
		</BackDrop>
	)
}

export default QuestionPaper
