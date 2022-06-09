import React, { Component } from 'react';
import axios from '../../axios';
import {connect} from 'react-redux';
import './Profile.css';

class Profile extends Component {
  
    state = {
        userName: "",
        email: "",
        totalPapers: 0,
        totalResponses: 0
    }

    componentDidMount = () => {
        const queryParams = '?auth='+this.props.token+'&orderBy="userId"&equalTo="'+this.props.userId+'"';
        axios.get('/users.json'+queryParams).then(response => {
            const userData = Object.values(response.data)[0];
            this.setState({
                userName: userData.name,
                email: userData.email,
                totalPapers: userData.createdPapers?Object.keys(userData.createdPapers).length:0,
                totalResponses: userData.submittedResponses?Object.keys(userData.submittedResponses).length:0
            })
        });
    }

    render() {
        const userData = <div className='profileContent'>
            
            <p>Name</p>
            <input type="text" placeholder='Enter Your Full Name' defaultValue={this.state.userName} className='input' readOnly></input>
            <p>Email</p>
            <input type="text" defaultValue={this.state.email} readOnly></input>
            <p>Total Papers Created</p>
            <input type="text" value={this.state.totalPapers} readOnly></input>
            <p>Total Responses Submitted</p>
            <input type="text" value={this.state.totalResponses} readOnly></input>
        </div>
    return (
        <div className='profile'>
            <p className='heading'>Your Profile</p>
            {userData}
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