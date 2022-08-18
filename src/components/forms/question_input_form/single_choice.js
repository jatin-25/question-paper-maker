import React, { useState } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'
import './styles.css'

const SCQuestionForm = (props) => {
	const [questionData, setQuestionData] = useState({
		type: 'SingleChoiceQuestion',
		question: props.question ? props.question : '',
		optionsList: props.optionsList ? props.optionsList : [],
	})

	const [optionsString, setOptionsString] = useState(props.optionsStr ? props.optionsStr : '')

	//adds new question in new paper's question Array or updates the question if edit button clicked.
	const updateQuestionArr = () => {
		if (questionData.question === '') {
			swal('Warning', "Question can't be Empty!", 'warning')
		} else if (questionData.optionsList.length < 2) {
			swal('Warning', 'There should be atleast two options in the Question!', 'warning')
		} else if (props.edit) {
			props.updateSCQOnEdit({
				question: questionData,
				index: props.qkey,
			})
		} else props.questionDataPass(questionData)
	}

	//updates question of the question object.
	const onChangeQuestionHandler = (e) => {
		const newQuestion = e.target.value
		const newQuestionData = {
			type: 'SingleChoiceQuestion',
			question: newQuestion,
			optionsList: questionData.optionsList,
		}
		setQuestionData(newQuestionData)
	}

	//updates options of the question object.
	const onChangeOptionsHandler = (e) => {
		let optionsListString = e.target.value
		let options = ''
		let newOptions = ''
		if (optionsListString) {
			options = [...optionsListString.split(',')]
			newOptions = [...options]
		}
		const newQuestionData = {
			type: 'SingleChoiceQuestion',
			question: questionData.question,
			optionsList: newOptions,
		}

		setQuestionData(newQuestionData)
		setOptionsString(optionsListString)
	}

	//closes the modal and doesn't update the array
	const cancelButtonHandler = () => {
		if (props.edit) {
			props.updateSCQOnEdit()
		} else props.questionDataPass()
	}

	let options = null
	if (questionData.optionsList) {
		options = questionData.optionsList.map((option, i) => {
			return (
				<div key={i} className='option'>
					<input type='radio'></input>
					<span className='Text'>{option}</span>
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

export default SCQuestionForm
