import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'
import Button from '../../UI/button'
import Input from '../../UI/input'

const PGQuestionForm = ({ question: globalQuestion, edit = false, ...props }) => {
	const [question, setQuestion] = useState('')

	useEffect(() => {
		if (globalQuestion) setQuestion(globalQuestion)
	}, [edit])

	// adds new question in new paper's question Array or updates the question if edit button clicked.
	const updateQuestionArr = () => {
		if (question === '') {
			swal('Warning', "Question can't be Empty!", 'warning')
			return
		}

		const questionData = {
			type: 'ParagraphQuestion',
			question: question,
		}

		if (edit) {
			props.updatePQOnEdit({ question: questionData, index: props.qkey })
			return
		}

		props.questionDataPass(questionData)
	}

	// updates question of the question object.
	const onChangeQuestionHandler = (e) => {
		setQuestion(e.target.value)
	}

	// closes the modal and doesn't update the array
	const cancelButtonHandler = () => {
		if (edit) {
			props.updatePQOnEdit()
			return
		}

		props.questionDataPass()
	}

	let inputForm = (
		<div>
			<p>Question</p>
			<Input type='text' onChange={(e) => onChangeQuestionHandler(e)} value={question}></Input>
			<br></br>
		</div>
	)

	return (
		<div className='questionForm'>
			{inputForm}
			<p>Preview</p>
			<p>{question}</p>
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
