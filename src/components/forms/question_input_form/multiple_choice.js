import React, { useState } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'
import './styles.css'

const MCQuestionForm = ({
	question: globalQuestion,
	optionsList: globalOptionsList,
	edit = false,
	...props
}) => {
	const [question, setQuestion] = useState('')
	const [optionsList, setOptionsList] = useState([])

	const [prevEdit, setPrevEdit] = useState(edit)

	const optionsString = optionsList.join(',')

	if (prevEdit !== edit) {
		setPrevEdit(edit)
		if (globalQuestion) setQuestion(globalQuestion)
		if (globalOptionsList) {
			setOptionsList(globalOptionsList)
		}
	}

	// adds new question in new paper's question Array or updates the question if edit button clicked.
	const updateQuestionArr = () => {
		if (question === '') {
			swal('Warning', "Question can't be Empty!", 'warning')
			return
		}

		if (optionsList.length < 2) {
			swal('Warning', 'There should be atleast two options in the Question!', 'warning')
			return
		}

		const questionData = {
			type: 'MultipleChoiceQuestion',
			question: question,
			optionsList: optionsList,
		}

		if (edit) {
			props.updateMCQOnEdit({
				question: questionData,
				index: props.qkey,
			})
			return
		}

		props.questionDataPass(questionData)
	}

	// closes the modal and doesn't update the array
	const cancelButtonHandler = () => {
		if (edit) {
			props.updateMCQOnEdit()
			return
		}

		props.questionDataPass()
	}

	// updates question of the question object.
	const onChangeQuestionHandler = (e) => {
		setQuestion(e.target.value)
	}

	// updates options of the question object.
	const onChangeOptionsHandler = (e) => {
		let optionsListString = e.target.value
		let options = ''
		let newOptions = ''

		if (optionsListString) {
			options = [...optionsListString.split(',')]
			newOptions = [...options]
		}

		setOptionsList(newOptions)
	}

	let options = null
	if (optionsList) {
		options = optionsList.map((option, i) => {
			return (
				<div key={i} className='option'>
					<input type='checkbox'></input>
					<span>{option}</span>
				</div>
			)
		})
	}

	let inputForm = (
		<>
			<p>Question</p>
			<Input type='text' onChange={(e) => onChangeQuestionHandler(e)} value={question}></Input>
			<p>Options in the form of comma seperated values.</p>
			<Input type='text' onChange={(e) => onChangeOptionsHandler(e)} value={optionsString}></Input>
			<br></br>
		</>
	)

	return (
		<div className='questionForm'>
			{inputForm}
			<p>Preview</p>
			<p>{question}</p>
			<div className='optionsContainer'> {options}</div>

			<Button
				varient='secondary'
				style={{ display: 'inline-block', marginRight: '1rem' }}
				onClick={() => updateQuestionArr()}
			>
				Submit
			</Button>
			<Button varient='secondary' style={{ display: 'inline-block' }} onClick={cancelButtonHandler}>
				Cancel
			</Button>
		</div>
	)
}

export default MCQuestionForm
