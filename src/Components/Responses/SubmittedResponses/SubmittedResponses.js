import axios from "../../../axios";
import React, { Component } from "react";
import {connect} from 'react-redux';
import Button from '../../UI/Button/Button';
import './SubmittedResponses.css';
import Collapse from '@kunukn/react-collapse';
import Response from "../Response/Response";
import * as actions from '../../../Store/Actions/index';
import BackDrop from "../../hoc/BackDrop/BackDrop";

class SubmittedResponses extends Component{

    state = {
        responses: [],
        isVisible: [],
        isDataArrived: false,
        currentResponseData: {},
        noResponse: false
    }

    showResponseHandler = (responseId,i) => {
        if(this.state.isVisible[i] === true){
            let newIsVisible = [...this.state.isVisible];
            newIsVisible[i] = !newIsVisible[i];
            this.setState({isVisible: newIsVisible});
        }
        else{
            const queryParams = `?auth=${this.props.token}&orderBy="responseId"&equalTo="${responseId}"`
            axios.get("/responses.json"+queryParams).then(response => {
                const currentResponseData = Object.values(response.data)[0];
                this.setState({currentResponseData: currentResponseData});
                this.setState({isDataArrived: true});
                let newIsVisible = [...this.state.isVisible];
                newIsVisible[i] = !newIsVisible[i];
                this.setState({isVisible: newIsVisible});
            }).catch(error => {

            });
        }
    }
    
    closeResponseHandler = (i) => {
        let newIsVisible = [...this.state.isVisible];
       newIsVisible[i] = false;
       this.setState({isVisible: newIsVisible});
    }

    componentDidMount() {
        this.props.setLoading(true);
        axios.get("/users/"+this.props.userKey+"/submittedResponses.json?auth="+this.props.token).then(response => {
            if (!response.data) {
                this.setState({noResponse: true})
            }
            else {
                this.setState({
                    responses: Object.values(response.data),
                    isVisible: Array(Object.values(response.data).length).fill(false)
                }); 
            }
            this.props.setLoading(false);
        }).catch(error => {
            this.props.setLoading(false);
        });
    }

    render(){

        let titles = null;
        if(this.state.responses.length > 0){
            titles = <div className="SubmittedResponseTitle">
                        <span>Paper Title</span>
                        <span>Response</span>
                    </div>
        }
        let responses = null;
        if(this.state.responses.length > 0){
            responses = this.state.responses.map((response,i) => {
                return (
                    <div key={i} className="SubmittedResponse">
                        <div className= "SubmittedResponseContent">
                        <span>{response.paperTitle}</span>
                        <Button clicked = {() => this.showResponseHandler(response.responseId,i)}>View Response</Button>
                    </div>
                    {this.state.isDataArrived&&<div className="Collapsible">
                    <Collapse isOpen = {this.state.isVisible[i]} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className="CollapsibleContent">
                    <div className="MainContent">
                    <Response isDataArrived = {this.state.isDataArrived} data = {this.state.currentResponseData.questionArr}/>
                    <Button clicked={() => this.closeResponseHandler(i)}>Close</Button>
                    </div>
                    </Collapse>
                    </div>}
                    </div>
                );
            })
        }
        return (
            <BackDrop isLoading={this.props.loading}>
                {this.state.noResponse ? <div className="noPapers"><p>You haven't submitted any responses yet.</p></div> :
                    <div className="SubmittedResponses">
                        {titles}
                        {responses}
                    
                    </div>}
            </BackDrop>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userKey: state.auth.userKey,
        loading: state.auth.loading
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(SubmittedResponses);