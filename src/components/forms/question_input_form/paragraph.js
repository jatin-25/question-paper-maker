import React, { useState } from 'react'
import swal from 'sweetalert'

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
			<input
				type='text'
				onChange={(e) => onChangeQuestionHandler(e)}
				value={questionData.question}
			></input>
			<br></br>
		</div>
	)

	return (
		<div className='Text'>
			{inputForm}
			<p>Preview</p>
			<p>{questionData.question}</p>
			<button onClick={() => updateQuestionArr()} className='Button'>
				Submit
			</button>
			<button onClick={cancelButtonHandler} className='Button'>
				Cancel
			</button>
		</div>
	)
}
export default PGQuestionForm
