import axios from "../../../axios";
import React, { Component } from "react";
import {connect} from 'react-redux';
import Button from '../../UI/Button/Button';
import classes from './SubmittedResponses.css';
import Collapse from '@kunukn/react-collapse';
import Response from "../Response/Response";

class SubmittedResponses extends Component{

    state = {
        responses: [],
        isVisible: [],
        isDataArrived: false,
        currentResponseData: {}
    }

    showResponseHandler = (responseId,i) => {
        console.log("entered")
        if(this.state.isVisible[i] === true){
            let newIsVisible = [...this.state.isVisible];
            newIsVisible[i] = !newIsVisible[i];
            this.setState({isVisible: newIsVisible});
        }
        else{
            const queryParams = `?auth=${this.props.token}&orderBy="responseId"&equalTo="${responseId}"`
            axios.get("/responses.json"+queryParams).then(response => {
                console.log(Object.values(response.data)[0]);
                const currentResponseData = Object.values(response.data)[0];
                this.setState({currentResponseData: currentResponseData});
                this.setState({isDataArrived: true});
                let newIsVisible = [...this.state.isVisible];
                newIsVisible[i] = !newIsVisible[i];
                this.setState({isVisible: newIsVisible});
            }).catch(error => console.log(error));
        }
    }
    
    closeResponseHandler = (i) => {
        console.log("exit");
        let newIsVisible = [...this.state.isVisible];
       newIsVisible[i] = false;
       this.setState({isVisible: newIsVisible});
    }

    componentDidMount(){
        axios.get("/users/"+localStorage.getItem("userKey")+"/submittedResponses.json?auth="+this.props.token).then(response => {
            console.log(response);
            response&&this.setState({
                responses: Object.values(response.data),
                isVisible: Array(Object.values(response.data).length).fill(false)
            });
        }).catch(error => console.log(error));
    }

    showData = () => {
        console.log(this.state.currentResponseData);
    }
    render(){

        let titles = null;
        if(this.state.responses.length > 0){
            titles = <div className={classes.Title}>
                        <span>Paper Title</span>
                        <span>Response</span>
                    </div>
        }
        let responses = null;
        if(this.state.responses.length > 0){
            responses = this.state.responses.map((response,i) => {
                return (
                    <div key={i} className={classes.Response}>
                    <div className = {classes.Content}>
                        <span>{response.paperTitle}</span>
                        <Button clicked = {() => this.showResponseHandler(response.responseId,i)}>View Response</Button>
                    </div>
                    {this.state.isDataArrived&&<div className={classes.Collapsible}>
                    <Collapse isOpen = {this.state.isVisible[i]} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className={classes.CollapsibleContent}>
                    <div>
                    <Response isDataArrived = {this.state.isDataArrived} data = {this.state.currentResponseData.questionArr}/>
                    <Button clicked={() => this.closeResponseHandler(i)}>Close</Button>
                    </div>
                    </Collapse>
                    </div>}
                    </div>
                );
            })
        }
        return(
            <div className={classes.Responses} onClick={this.showData}>
                {titles}
                {responses}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}
export default connect(mapStateToProps)(SubmittedResponses);