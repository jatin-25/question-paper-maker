import React, { useState } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'
import './styles.css'

const MCQuestionForm = (props) => {
	const [questionData, setQuestionData] = useState({
		type: 'MultipleChoiceQuestion',
		question: props.question ? props.question : '',
		optionsList: props.optionsList ? props.optionsList : [],
	})

	const [optionsString, setOptionsString] = useState(props.optionsStr ? props.optionsStr : '')

	// adds new question in new paper's question Array or updates the question if edit button clicked.
	const updateQuestionArr = () => {
		if (questionData.question === '') {
			swal('Warning', "Question can't be Empty!", 'warning')
			return
		}

		if (questionData.optionsList.length < 2) {
			swal('Warning', 'There should be atleast two options in the Question!', 'warning')
			return
		}

		if (props.edit) {
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
		if (props.edit) {
			props.updateMCQOnEdit()
			return
		}

		props.questionDataPass()
	}

	// updates question of the question object.
	const onChangeQuestionHandler = (e) => {
		const newQuestion = e.target.value
		const newQuestionData = {
			type: 'MultipleChoiceQuestion',
			question: newQuestion,
			optionsList: questionData.optionsList,
		}
		setQuestionData(newQuestionData)
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

		let oldQuestionData = questionData
		const newQuestionData = {
			type: 'MultipleChoiceQuestion',
			question: oldQuestionData.question,
			optionsList: newOptions,
		}

		setQuestionData(newQuestionData)
		setOptionsString(optionsListString)
	}

	let options = null
	if (questionData.optionsList) {
		options = questionData.optionsList.map((option, i) => {
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
			<Input
				type='text'
				onChange={(e) => onChangeQuestionHandler(e)}
				value={questionData.question}
			></Input>
			<p>Options in the form of comma seperated values.</p>
			<Input type='text' onChange={(e) => onChangeOptionsHandler(e)} value={optionsString}></Input>
			<br></br>
		</>
	)

	return (
		<div className='questionForm'>
			{inputForm}
			<p>Preview</p>
			<p>{questionData.question}</p>
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
