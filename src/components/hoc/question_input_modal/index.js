import React from 'react'
import './styles.css'

const Modal = ({ children, show }) => {
	return <div className={['modal', show ? 'show' : null].join(' ')}>{children}</div>
}

export default Modal
