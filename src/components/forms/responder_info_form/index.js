import React from 'react'
import { useSelector } from 'react-redux'
import { Input } from '../../UI'
import './styles.css'

const ResponderInfoForm = ({ fields, updateAnswer }) => {
	const authState = useSelector((state) => state.auth)

	// changes the form feilds of responder info form except email.
	const onAnswerChangeHandler = ({ e, idx }) => {
		let fieldsArr = [...fields]

		fieldsArr[2].value = authState.email

		fieldsArr[idx].value = e.target.value

		updateAnswer(fieldsArr)
	}

	let responderInfoForm = fields?.map((field, i) => {
		return (
			<div key={i}>
				<p>{field.name}</p>
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
						value={field.value ? field.value : ''}
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
