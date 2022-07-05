import React, { Component } from 'react';
import "./styles.css";

class NotFound extends Component {

    render() {
        return (
            <div className='Wrapper'>
                <div className='Content'>
                    <h1>404 Error</h1>
                    <h1>Page Not Found!!</h1>
                </div>
            </div>
        );
    }
}

export default NotFound;