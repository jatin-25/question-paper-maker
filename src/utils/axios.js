import axios from '../axios'

// custom axios caller function
const axiosCaller = async ({ method, url, params = {}, data = null, headers = {} }) => {
	if (localStorage.getItem('token')) {
		params.auth = localStorage.getItem('token')
	}

	const response = await axios({
		method,
		url,
		params,
		data,
		headers,
	})
	return response
}

export default axiosCaller
