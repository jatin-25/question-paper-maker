import React, { Component } from 'react';
import axios from '../../axios';
import {connect} from 'react-redux';


class Profile extends Component {
  
    state = {
        userObject: {}
    }

    componentDidMount = () => {
        const queryParams = '?auth='+this.props.token+'&orderBy="userId"&equalTo="'+this.props.userId+'"';
        axios.get('/users.json'+queryParams).then(response => {
            console.log(response);
        }).catch(error => console.log(error));

        console.log(queryParams);
    }

  render() {
    return (
        <div>
            
        </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    }
}
export default connect(mapStateToProps)(Profile);