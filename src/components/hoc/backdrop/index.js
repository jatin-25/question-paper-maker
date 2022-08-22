import React from 'react'
import Spinner from '../../UI/spinner'
import './styles.css'

const BackDrop = (props) => {
	let children = null
	if (props.isLoading) {
		children = (
			<>
				<div className='spinner'>
					<Spinner />
				</div>
				<div className='backdrop'>{props.children}</div>
			</>
		)
	} else {
		children = <div className='backdrop'>{props.children}</div>
	}
	return children
}

export default BackDrop
