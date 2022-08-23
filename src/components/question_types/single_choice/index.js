import React from 'react'
import * as BiIcons from 'react-icons/bi'
import * as MdIcons from 'react-icons/md'
import './styles.css'

const SCQuestion = (props) => {
	const markAnswerHandler = (markedOption, index) => {
		props.updateAnswer({ answer: { index: index, value: markedOption }, index: props.qkey })
	}

	let options = props.optionsList
		? props.optionsList.map((option, index) => {
				return (
					<div key={index} className='option'>
						<input
							type='radio'
							name={props.qkey}
							checked={option === props.answer?.value && props.answer?.index === index}
							onChange={() => markAnswerHandler(option, index)}
							disabled={props.pageOnWhichRendered !== 'questionPaper'}
						></input>
						<span>{option}</span>
					</div>
				)
		  })
		: null

	let answerComp = null
	if (props.pageOnWhichRendered !== 'newPaper') {
		answerComp = props.question ? (
			<p style={{ display: 'inline-block' }}>Selected Answer: {props.answer.value}</p>
		) : null
	}

	return (
		<div className='question'>
			<p style={{ display: 'inline-block' }}>
				Ques. {props.qkey + 1}: {props.question}
			</p>
			{options}
			{answerComp}
			{props.pageOnWhichRendered === 'newPaper' && (
				<div className='iconsWrapper'>
					<BiIcons.BiEdit
						onClick={() => props.onEditHandler({ idx: props.qkey, type: 'SingleChoiceQuestion' })}
						className='editIcon'
					/>
					<MdIcons.MdOutlineDelete
						onClick={() => props.onRemoveHandler(props.qkey)}
						className='deleteIcon'
					/>
				</div>
			)}
		</div>
	)
}

export default SCQuestion
