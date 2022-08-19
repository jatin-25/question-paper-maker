import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://question-paper-maker-d054e-default-rtdb.firebaseio.com/',
})

export default instance
