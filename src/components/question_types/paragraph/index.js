import React from 'react'
import * as BiIcons from 'react-icons/bi'
import * as MdIcons from 'react-icons/md'
import './styles.css'

const PGQuestion = (props) => {
	const onAnswerChangeHandler = (e) => {
		props.updateAnswer({ answer: e.target.value, index: props.qkey })
	}

	let questionArea = null
	if (props.question) {
		questionArea = (
			<textarea
				className='paraAnswer'
				rows='8'
				cols='70'
				value={props.answer ? props.answer : ''}
				onChange={(e) => onAnswerChangeHandler(e)}
				disabled={props.pageOnWhichRendered !== 'questionPaper'}
			></textarea>
		)
	}
	return (
		<div className='question'>
			<p style={{ display: 'inline-block' }}>
				Ques. {props.qkey + 1}: {props.question}
			</p>
			{questionArea}
			{props.pageOnWhichRendered === 'newPaper' && (
				<div className='iconsWrapper'>
					<BiIcons.BiEdit
						onClick={() => props.onEditHandler({ idx: props.qkey, type: 'ParagraphQuestion' })}
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

export default PGQuestion
