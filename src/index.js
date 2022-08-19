import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.js'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/reducers/auth.js'
import { BrowserRouter as Routers } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'

const store = configureStore({
	reducer: {
		auth: authReducer,
	},
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Routers>
				<App />
			</Routers>
		</Provider>
	</React.StrictMode>
)
reportWebVitals()
