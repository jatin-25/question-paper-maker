// updates form fields
export const getUpdatedForm = (event, form, idx) => {
	const newForm = { ...form }
	// if (!form || idx < 0 || idx >= form.elements.length) return newForm

	const updatedElement = { ...newForm.elements[idx] }
	updatedElement.value = event.target.value
	newForm.elements[idx] = updatedElement

	return newForm
}

// extracts the error message from the error string in case of some api error
export const extractError = (error) => {
	if (!error) {
		return ''
	}

	let errorMessage = error.message
	let em = errorMessage.split('_')
	let lowerCase = em.map((word) => word.toLowerCase())
	let ans = lowerCase.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

	errorMessage = ans.join(' ')

	return errorMessage
}
