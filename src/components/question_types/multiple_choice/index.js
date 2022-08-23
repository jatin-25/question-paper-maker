import React from 'react'
import * as BiIcons from 'react-icons/bi'
import * as MdIcons from 'react-icons/md'
import './styles.css'

const MCQuestion = (props) => {
	// calls function for updating parent component answer array
	const updateAnswersArrHandler = (option, index) => {
		let oldAnswerArr = [...props.answersArr]

		if (oldAnswerArr[0].value === 'Not Marked') {
			oldAnswerArr.splice(0, 1)
		}

		const optionIndex = oldAnswerArr.findIndex(
			(element) => element.value === option && element.index === index
		)

		let newAnswerArr = null
		// adding option if not already present otherwise deleting it from array
		if (optionIndex === -1) {
			newAnswerArr = [...oldAnswerArr, { index: index, value: option }]
		} else {
			oldAnswerArr.splice(optionIndex, 1)
			newAnswerArr = [...oldAnswerArr]
		}

		if (newAnswerArr.length === 0) {
			newAnswerArr = [{ index: 0, value: 'Not Marked' }]
		}

		props.updateAnswer({ answer: newAnswerArr, index: props.qkey })
	}

	let optionsComp = props?.optionsList?.map((option, index) => {
		return (
			<div key={index} className='option'>
				<input
					type='checkbox'
					name={option}
					checked={
						props.answersArr?.find(
							(element) => element.value === option && element.index === index
						) != null
					}
					onChange={() => updateAnswersArrHandler(option, index)}
					disabled={props.pageOnWhichRendered !== 'questionPaper'}
				></input>
				<span>{option}</span>
			</div>
		)
	})

	let selectedAnswer = null
	let answers = ''
	if (props?.pageOnWhichRendered !== 'newPaper') {
		const n = props.answersArr?.length
		if (n) {
			answers = props.answersArr?.map((answer, i) => {
				return (
					<span key={i} style={{ margin: '15px 0' }}>
						{answer.value}
						{n === i + 1 ? ' ' : ', '}
					</span>
				)
			})
		}

		selectedAnswer = <p style={{ display: 'inline-block' }}>Selected Answer(s): {answers}</p>
	}
	return (
		<div className='question'>
			<p style={{ marginBottom: '5px', display: 'inline-block' }}>
				Ques {props?.qkey + 1}: {props?.question || ''}
			</p>
			{optionsComp}
			{selectedAnswer}
			{props?.pageOnWhichRendered === 'newPaper' && (
				<div className='iconsWrapper'>
					<BiIcons.BiEdit
						onClick={() =>
							props.onEditHandler({ idx: props?.qkey, type: 'MultipleChoiceQuestion' })
						}
						className='editIcon'
					/>
					<MdIcons.MdOutlineDelete
						onClick={() => props.onRemoveHandler(props?.qkey)}
						className='deleteIcon'
					/>
				</div>
			)}
		</div>
	)
}

export default MCQuestion
