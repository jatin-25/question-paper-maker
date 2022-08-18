import React from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import './styles.css'

const Input = ({
	type,
	value,
	identifier,
	className,
	elementConfig,
	iconName,
	style,
	onChange,
	isValid,
	showErrors,
	error,
}) => {
	let inputElement = null

	switch (type) {
		case 'text':
		case 'password':
		case 'radio':
		case 'checkbox':
			inputElement = (
				<input
					type={type}
					{...elementConfig}
					value={value}
					className={['input', className].join(' ')}
					onChange={(event) => onChange(event, identifier)}
					style={style}
				/>
			)
			break
		case 'textarea':
			inputElement = (
				<textarea
					className={className}
					{...elementConfig}
					value={value}
					onChange={(event) => onChange(event, identifier)}
					style={style}
				/>
			)
			break
		case 'select':
			inputElement = (
				<select onChange={(event) => onChange(event, identifier)} style={style}>
					{elementConfig.options.map((option, i) => {
						return (
							<option key={i} value={option.value}>
								{option.displayValue}
							</option>
						)
					})}
				</select>
			)
		case 'auth-input':
			inputElement = (
				<div className='inputContainer'>
					<div className='inputField'>
						<img src={`/assets/${iconName}.svg`} className='icon' alt={iconName} />
						<input
							{...elementConfig}
							value={value}
							onChange={(event) => onChange(event, identifier)}
							style={style}
						/>
					</div>
					<div
						className={
							showErrors === true && !isValid ? 'errorContainer showError' : 'errorContainer'
						}
					>
						<BiErrorCircle color='#E33535' />
						<p>{error}</p>
					</div>
				</div>
			)
			break
		default:
			inputElement = (
				<input {...elementConfig} onChange={(event) => onChange(event, identifier)} value={value} />
			)
	}

	return <>{inputElement}</>
}

export default Input
