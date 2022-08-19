import React from 'react'
import { SCQuestion, MCQuestion, PGQuestion } from '../../components/question_types'
import './styles.css'

const Response = (props) => {
	let questionsComponent = null
	if (props.data) {
		questionsComponent = props.data.map((question, i) => {
			let questionComp = null
			switch (question.type) {
				case 'SingleChoiceQuestion':
					questionComp = (
						<SCQuestion
							optionsList={props.data[i].optionsList}
							question={props.data[i].question}
							answer={props.data[i].answer}
							key={i}
							qkey={i}
							questionNo={i + 1}
							pageOnWhichRendered='response'
						/>
					)
					break

				case 'MultipleChoiceQuestion':
					questionComp = (
						<MCQuestion
							optionsList={props.data[i].optionsList}
							question={props.data[i].question}
							answer={props.data[i].answer}
							key={i}
							qkey={i}
							questionNo={i + 1}
							pageOnWhichRendered='response'
						/>
					)
					break

				case 'ParagraphQuestion':
					questionComp = (
						<PGQuestion
							question={props.data[i].question}
							answer={props.data[i].answer}
							key={i}
							qkey={i}
							questionNo={i + 1}
							pageOnWhichRendered='response'
						/>
					)
					break
				default:
					break
			}
			return questionComp
		})
	}
	return <div className='IndividualResponse'>{questionsComponent}</div>
}

export default Response
