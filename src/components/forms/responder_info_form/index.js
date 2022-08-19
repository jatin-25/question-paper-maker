import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Input from '../../UI/input'
import './styles.css'

const ResponderInfoForm = (props) => {
	const authState = useSelector((state) => state.auth)

	const [answers, setAnswers] = useState(props.feilds ? Array(props.feilds.length) : [])

	//changes the form feilds of responder info form except email.
	const onAnswerChangeHandler = (object) => {
		let answerArr = [...answers]
		if (answerArr.indexOf(authState.email) === -1) {
			answerArr[2] = authState.email
		}
		answerArr[object.idx] = object.e.target.value
		setAnswers(answerArr)
		props.updateAnswer(answerArr)
	}

	let responderInfoForm = props.feilds?.map((feildTitle, i) => {
		return (
			<div key={i}>
				<p>{feildTitle}</p>
				{i === 2 ? (
					<Input
						type='text'
						elementConfig={{
							minLength: 1,
							defaultValue: authState.email,
							readOnly: true,
						}}
						style={{ marginBottom: '1rem' }}
					></Input>
				) : (
					<Input
						type='text'
						onChange={(e) => onAnswerChangeHandler({ e: e, idx: i })}
						elementConfig={{ minLength: 1 }}
						style={{ marginBottom: '1rem' }}
					></Input>
				)}
			</div>
		)
	})
	return <div className='responderInfoForm'>{responderInfoForm}</div>
}

export default ResponderInfoForm
