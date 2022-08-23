import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	SCQuestionForm,
	MCQuestionForm,
	PGQuestionForm,
} from '../../components/forms/question_input_form'
import { SCQuestion, MCQuestion, PGQuestion } from '../../components/question_types'
import Modal from '../../components/hoc/question_input_modal'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import Collapse from '@kunukn/react-collapse'
import { setLoading } from '../../store/actions'
import { Button } from '../../components/UI'
import swal from 'sweetalert'
import axiosCaller from '../../utils/axios'
import './styles.css'
import BackDrop from '../../components/hoc/backdrop'

const NewPaper = () => {
	const [title, setTitle] = useState('')
	const [responderInfoFeilds] = useState([
		{
			name: 'Name',
		},
		{
			name: 'Roll No.',
		},
		{
			name: 'Email Id',
		},
	])

	const [questionArr, setQuestionArr] = useState([])
	const [openedModalType, setOpenedModalType] = useState(null)

	const [editData, setEditData] = useState({
		type: '',
		clicked: false,
		idx: null,
	})

	const [isPaperReady, setIsPaperReady] = useState(false)
	const [addQuestion, setAddQuestion] = useState(false)

	const navigate = useNavigate()
	const authState = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	const updateQuestionArr = (questionObject) => {
		if (!questionObject) {
			setOpenedModalType(null)
			return
		}

		let newQuestionsList = [...questionArr, questionObject]
		setQuestionArr(newQuestionsList)
		if (questionArr.length === 0) {
			setIsPaperReady(true)
		}

		setOpenedModalType(null)
	}

	const showInputForm = (modalType) => {
		if (openedModalType !== null) {
			swal('Warning', 'There is already one question form opened!', 'warning')
			return
		}

		setOpenedModalType(modalType)
	}

	const submitQuestionPaperHandler = (event) => {
		event.preventDefault()

		if (title === '') {
			swal('Warning', "Title can't be Empty!", 'warning')
			return
		}

		swal({
			title: 'Are you sure?',
			text: 'You want to create your Paper!',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
		}).then((willCreate) => {
			if (!willCreate) return

			const postQuestionPaperToServer = async () => {
				const questionPaper = {
					paperId: uuid(),
					title: title,
					responderInfoFeilds: responderInfoFeilds,
					questionArr: questionArr,
				}

				try {
					dispatch(setLoading(true))

					await axiosCaller({
						method: 'post',
						url: '/questionPapers.json',
						data: questionPaper,
					})

					const currentPaper = {
						paperId: questionPaper.paperId,
						paperTitle: title,
					}

					await axiosCaller({
						method: 'post',
						url: '/users/' + authState.userKey + '/createdPapers.json',
						data: currentPaper,
					})

					dispatch(setLoading(false))

					swal('Congratulations, Your Paper has been created.', {
						icon: 'success',
						buttons: {
							stay: 'Stay Here',
							catch: {
								text: 'Move to Your Papers',
								value: 'move',
							},
						},
					}).then((value) => {
						switch (value) {
							case 'stay':
								break
							case 'move':
								navigate('/yourPapers')
								break
							default:
								break
						}
					})
				} catch (error) {
					dispatch(setLoading(false))
				}
			}

			postQuestionPaperToServer()
		})
	}

	const onEditButtonClickedHandler = (editDataObject) => {
		if (editData.clicked) {
			swal('Warning', 'There is already one question form opened!', 'warning')
			return
		}

		const newEditData = {
			type: editDataObject.type,
			clicked: true,
			idx: editDataObject.idx,
		}
		setEditData(newEditData)
	}

	const onRemoveButtonClickedHandler = (index) => {
		let newQuestionArr = [...questionArr]
		newQuestionArr.splice(index, 1)

		if (newQuestionArr.length === 0) {
			setIsPaperReady(false)
		}

		setQuestionArr(newQuestionArr)
	}

	const updateQuestionOnEdit = (questionObject) => {
		const newEditData = {
			clicked: false,
			idx: null,
		}

		if (questionObject) {
			let newQuestionArr = [...questionArr]
			newQuestionArr.splice(questionObject.index, 1, questionObject.question)
			setQuestionArr(newQuestionArr)
		}

		setEditData(newEditData)
	}

	let questionsComponent = questionArr.map((question, i) => {
		let questionComp = null
		switch (question.type) {
			case 'SingleChoiceQuestion':
				questionComp = (
					<SCQuestion
						optionsList={questionArr[i].optionsList}
						question={questionArr[i].question}
						key={i}
						qkey={i}
						onEditHandler={onEditButtonClickedHandler}
						onRemoveHandler={onRemoveButtonClickedHandler}
						pageOnWhichRendered='newPaper'
					/>
				)
				break

			case 'MultipleChoiceQuestion':
				questionComp = (
					<MCQuestion
						optionsList={questionArr[i].optionsList}
						question={questionArr[i].question}
						key={i}
						qkey={i}
						onEditHandler={onEditButtonClickedHandler}
						onRemoveHandler={onRemoveButtonClickedHandler}
						pageOnWhichRendered='newPaper'
					/>
				)
				break

			case 'ParagraphQuestion':
				questionComp = (
					<PGQuestion
						question={questionArr[i].question}
						key={i}
						qkey={i}
						onEditHandler={onEditButtonClickedHandler}
						onRemoveHandler={onRemoveButtonClickedHandler}
						pageOnWhichRendered='newPaper'
					/>
				)
				break

			default:
				break
		}
		return questionComp
	})

	let singleChoiceQuestionForm = null
	if (openedModalType === 'SingleChoiceQuestion') {
		singleChoiceQuestionForm = <SCQuestionForm questionDataPass={updateQuestionArr} edit={false} />
	}

	let multipleChoiceQuestionForm = null
	if (openedModalType === 'MultipleChoiceQuestion') {
		multipleChoiceQuestionForm = (
			<MCQuestionForm questionDataPass={updateQuestionArr} edit={false} />
		)
	}

	let paragraphQuestionForm = null
	if (openedModalType === 'ParagraphQuestion') {
		paragraphQuestionForm = <PGQuestionForm questionDataPass={updateQuestionArr} edit={false} />
	}

	let singleChoiceEditForm = null
	if (editData.clicked && editData.type === 'SingleChoiceQuestion') {
		let optionsString = null
		let tempOptionsString = questionArr[editData.idx].optionsList.join(',')
		optionsString = tempOptionsString.substring(0, tempOptionsString.length)
		singleChoiceEditForm = (
			<SCQuestionForm
				optionsList={questionArr[editData.idx].optionsList}
				question={questionArr[editData.idx].question}
				edit={editData.clicked}
				updateSCQOnEdit={updateQuestionOnEdit}
				qkey={editData.idx}
				optionsStr={optionsString}
			/>
		)
	}

	let multipleChoiceEditForm = null
	if (editData.clicked && editData.type === 'MultipleChoiceQuestion') {
		let optionsString = null
		let tempOptionsString = questionArr[editData.idx].optionsList.join(',')
		optionsString = tempOptionsString.substring(0, tempOptionsString.length)
		multipleChoiceEditForm = (
			<MCQuestionForm
				optionsList={questionArr[editData.idx].optionsList}
				question={questionArr[editData.idx].question}
				edit={editData.clicked}
				updateMCQOnEdit={updateQuestionOnEdit}
				qkey={editData.idx}
				optionsStr={optionsString}
			/>
		)
	}

	let paragraphEditForm = null
	if (editData.clicked && editData.type === 'ParagraphQuestion') {
		paragraphEditForm = (
			<PGQuestionForm
				question={questionArr[editData.idx].question}
				edit={editData.clicked}
				updatePQOnEdit={updateQuestionOnEdit}
				qkey={editData.idx}
			/>
		)
	}

	let paperTitle = isPaperReady ? (
		<div className='paperTitle'>
			<p>Paper Title</p>
			<input type='text' value={title} onChange={(e) => setTitle(e.target.value)}></input>
		</div>
	) : null

	let addQuestionTypes = null
	addQuestionTypes = (
		<Button
			varient='secondary'
			style={{ marginBottom: '3rem' }}
			onClick={() => setAddQuestion(!addQuestion)}
		>
			<span>Add Question</span>
			<Collapse isOpen={addQuestion} transition='height 0.7s cubic-bezier(.4, 0, .2, 1)'>
				<ul className='questionTypes'>
					<li onClick={() => showInputForm('SingleChoiceQuestion')}>Single Choice Question</li>
					<li onClick={() => showInputForm('MultipleChoiceQuestion')}>Multiple Choice Question</li>
					<li onClick={() => showInputForm('ParagraphQuestion')}>Paragraph Question</li>
				</ul>
			</Collapse>
		</Button>
	)

	return (
		<BackDrop isLoading={authState.loading}>
			<div className='questionArea'>
				{paperTitle}

				<Modal show={openedModalType === 'SingleChoiceQuestion'}>{singleChoiceQuestionForm}</Modal>
				<Modal show={openedModalType === 'MultipleChoiceQuestion'}>
					{multipleChoiceQuestionForm}
				</Modal>
				<Modal show={openedModalType === 'ParagraphQuestion'}>{paragraphQuestionForm}</Modal>

				<Modal show={editData.clicked && editData.type === 'SingleChoiceQuestion'}>
					{singleChoiceEditForm}
				</Modal>
				<Modal show={editData.clicked && editData.type === 'MultipleChoiceQuestion'}>
					{multipleChoiceEditForm}
				</Modal>
				<Modal show={editData.clicked && editData.type === 'ParagraphQuestion'}>
					{paragraphEditForm}
				</Modal>

				{isPaperReady ? <div className='questionPaper'>{questionsComponent}</div> : null}

				<div className='submitBtn'>
					<Button
						varient='secondary'
						onClick={(event) => submitQuestionPaperHandler(event)}
						style={{ display: isPaperReady ? 'inline' : 'none' }}
					>
						Submit
					</Button>
				</div>

				{addQuestionTypes}
			</div>
		</BackDrop>
	)
}

export default NewPaper
