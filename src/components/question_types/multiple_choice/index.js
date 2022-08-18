import React, { useState } from 'react'
import * as BiIcons from 'react-icons/bi'
import * as MdIcons from 'react-icons/md'
import './styles.css'

const MCQuestion = (props) => {
	const [answersArr, setAnswersArr] = useState(
		props.showEditButton || !props.answer ? ['Not Marked'] : props.answer
	)

	//updates the answer object of the parent component
	const setAnswer = (idx) => {
		props.updateAnswer({ answer: answersArr, index: idx })
	}

	//updates the answersArr state and calls function for updating parent component answer array
	const updateAnswersArrHandler = (option) => {
		let oldAnswerArr = answersArr
		if (oldAnswerArr.length === 1 && oldAnswerArr[0] === 'Not Marked') {
			oldAnswerArr.splice(0, 1)
		}

		const optionIndex = oldAnswerArr.findIndex((element) => element === option)
		let newAnswerArr = null
		if (optionIndex === -1) {
			newAnswerArr = [...oldAnswerArr, option]
		} else {
			oldAnswerArr.splice(optionIndex, 1)
			newAnswerArr = [...oldAnswerArr]
		}
		if (newAnswerArr.length <= 1) {
			if (newAnswerArr.length === 0) {
				newAnswerArr = ['Not Marked']
			}
		}
		setAnswersArr(newAnswerArr)
		setAnswer(props.qkey)
	}

	let optionsComp = props?.optionsList?.map((option, index) => {
		return (
			<div key={index} className='Option'>
				<input
					type='checkbox'
					name={props.qkey}
					onChange={() => updateAnswersArrHandler(option)}
					disabled={props.pageOnWhichRendered !== 'questionPaper'}
				></input>
				<span>{option}</span>
			</div>
		)
	})

	let answers = null
	const n = answersArr.length
	if (n) {
		answers = answersArr.map((answer, i) => {
			return (
				<span key={i} style={{ margin: '15px 0' }}>
					{answer}
					{n === i + 1 ? ' ' : ', '}
				</span>
			)
		})
	}
	let selectedAnswer = null
	if (props?.pageOnWhichRendered !== 'newPaper') {
		selectedAnswer = <p style={{ display: 'inline-block' }}>Selected Answer(s): {answers}</p>
	}
	return (
		<div className='Question'>
			<p style={{ marginBottom: '5px', display: 'inline-block' }}>
				Ques {props?.qkey + 1}: {props?.question || ''}
			</p>
			{optionsComp}
			{selectedAnswer}
			{props?.pageOnWhichRendered === 'newPaper' && (
				<div className='EditButtonContent'>
					<BiIcons.BiEdit
						onClick={() =>
							props.onEditHandler({ idx: props?.qkey, type: 'MultipleChoiceQuestion' })
						}
						className='EditIcon'
					/>
					<MdIcons.MdOutlineDelete
						onClick={() => props.onRemoveHandler(props?.qkey)}
						className='DeleteIcon'
					/>
				</div>
			)}
		</div>
	)
}

export default MCQuestion
