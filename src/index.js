import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './Store/Reducers/auth';
import './index.css';
import { BrowserRouter as Routers} from 'react-router-dom';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <Routers>
        {/* <HashRouter> */}
            <App />
        {/* </HashRouter> */}
        </Routers>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
