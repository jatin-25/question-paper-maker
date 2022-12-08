import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'
import './styles.css'

const SCQuestionForm = ({
	question: globalQuestion,
	optionsList: globalOptionsList,
	edit = false,
	...props
}) => {
	const [question, setQuestion] = useState('')
	const [optionsList, setOptionsList] = useState([])

	const [optionsString, setOptionsString] = useState('')

	useEffect(() => {
		if (globalQuestion) setQuestion(globalQuestion)
		if (globalOptionsList) {
			setOptionsList(globalOptionsList)
			setOptionsString(globalOptionsList.join(','))
		}
	}, [edit])

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
			type: 'SingleChoiceQuestion',
			question: question,
			optionsList: optionsList,
		}

		clearQuestionData()

		if (edit) {
			props.updateSCQOnEdit({
				question: questionData,
				index: props.qkey,
			})

			return
		}
		props.questionDataPass(questionData)
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
		setOptionsString(optionsListString)
	}

	// closes the modal and doesn't update the array
	const cancelButtonHandler = () => {
		clearQuestionData()

		if (edit) {
			props.updateSCQOnEdit()
			return
		}

		props.questionDataPass()
	}

	const clearQuestionData = () => {
		setQuestion('')
		setOptionsList([])
		setOptionsString('')
	}

	let options = null
	if (optionsList) {
		options = optionsList.map((option, i) => {
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

export default SCQuestionForm
