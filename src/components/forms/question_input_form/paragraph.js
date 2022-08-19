import React, { useState } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'

const PGQuestionForm = (props) => {
	const [questionData, setQuestionData] = useState({
		type: 'ParagraphQuestion',
		question: props.question ? props.question : '',
	})

	//adds new question in new paper's question Array or updates the question if edit button clicked.
	const updateQuestionArr = () => {
		if (questionData.question === '') {
			swal('Warning', "Question can't be Empty!", 'warning')
		} else if (props.edit) {
			props.updatePQOnEdit({ question: questionData, index: props.qkey })
		} else props.questionDataPass(questionData)
	}

	//updates question of the question object.
	const onChangeQuestionHandler = (e) => {
		const newQuestion = e.target.value
		const newQuestionData = {
			type: 'ParagraphQuestion',
			question: newQuestion,
		}
		setQuestionData(newQuestionData)
	}

	//closes the modal and doesn't update the array
	const cancelButtonHandler = () => {
		if (props.edit) {
			props.updatePQOnEdit()
		} else props.questionDataPass()
	}

	let inputForm = (
		<div>
			<p>Question</p>
			<Input
				type='text'
				onChange={(e) => onChangeQuestionHandler(e)}
				value={questionData.question}
			></Input>
			<br></br>
		</div>
	)

	return (
		<div className='questionForm'>
			{inputForm}
			<p>Preview</p>
			<p>{questionData.question}</p>
			<Button
				onClick={() => updateQuestionArr()}
				varient='secondary'
				style={{ display: 'inline-block', marginRight: '1rem' }}
			>
				Submit
			</Button>
			<Button varient='secondary' style={{ display: 'inline-block' }} onClick={cancelButtonHandler}>
				Cancel
			</Button>
		</div>
	)
}
export default PGQuestionForm
