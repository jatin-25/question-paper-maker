import React from 'react'
import './styles.css'

const Button = ({ varient, style, className, onClick, children }) => {
	if (varient === 'primary')
		return (
			<button
				className={[varient, className].join(' ')}
				style={style}
				onClick={(event) => onClick(event)}
			>
				{children}
			</button>
		)

	// secondary
	return (
		<div
			className={[varient, className].join(' ')}
			style={style}
			onClick={(event) => onClick(event)}
		>
			<button>{children}</button>
		</div>
	)
}

export default Button
