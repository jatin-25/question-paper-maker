// checks the validation of a particular form feild
export const checkFieldValidation = (value, rules, elementIdentifier) => {
	if (!elementIdentifier) return { isValid: false, error: '' }

	let isFormValid = true
	let error = ''

	if (rules.maxLength) {
		const isValid = value.length <= rules.maxLength
		isFormValid = isFormValid && isValid
		if (!isValid) {
			error = 'The Maximum Length of ' + elementIdentifier + ' is ' + rules.maxLength + '.'
		}
	}

	if (rules.minLength) {
		const isValid = value.length >= rules.minLength
		isFormValid = isFormValid && isValid
		if (!isValid) {
			error = elementIdentifier + ' must be atleast ' + rules.minLength + ' characters long.'
		}
	}

	if (rules.isEmail) {
		const pattern =
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		const isValid = pattern.test(value)
		isFormValid = isFormValid && isValid

		if (!isValid) {
			error = elementIdentifier + ' is Invalid.'
		}
	}

	if (rules.isNumeric) {
		const pattern = /^\d+$/
		isFormValid = pattern.test(value) && isFormValid
	}

	if (rules.required) {
		const isValid = value.trim() !== ''
		isFormValid = isFormValid && isValid
		if (!isValid) {
			error = elementIdentifier + " can't be Empty."
		}
	}
	return {
		isValid: isFormValid,
		error: error,
	}
}

// checks validation of whole form when user clicks on login or signup
export const checkFormValidation = (form) => {
	if (form == null) return { ...form }

	let newForm = { ...form }

	let isFormValid = true
	for (let idx in newForm.elements) {
		const updatedFormElement = { ...newForm.elements[idx] }

		const errorObject = checkFieldValidation(
			updatedFormElement.value,
			updatedFormElement.validation,
			updatedFormElement.name
		)

		updatedFormElement.isValid = errorObject.isValid
		updatedFormElement.error = errorObject.error
		newForm.elements[idx] = updatedFormElement
		isFormValid = isFormValid && errorObject.isValid
	}

	newForm.isFormValid = isFormValid
	newForm.showErrors = !isFormValid

	return newForm
}

// checks the validation of Responder Info Form
export const checkResponderFormValidation = (formFields) => {
	return formFields.every((field) => field.value != null && field.value.length >= 1)
}
