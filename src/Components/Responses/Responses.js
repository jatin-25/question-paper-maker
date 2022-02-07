import React,{Component} from "react";
import classes from './Responses.css';
import Response from './Response/Response';
import Collapse from '@kunukn/react-collapse';
import axios from '../../axios';
import {connect} from 'react-redux';
import Button from '../UI/Button/Button';

class Responses extends Component {
    state = {
        responseData: [],
        isVisible: []
    }
        
    componentDidMount(){
        console.log("Hello");
        const queryParams = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${this.props.qkey}"`
        axios.get('/responses.json'+queryParams).then(response => response.data?this.setState({
            responseData: Object.values(response.data),
            isVisible: Array(Object.values(response.data).length).fill(false)
        }):null)
        axios.get('/responses.json'+queryParams).then(response => response.data?console.log(Object.values(response.data)):null);
    }
        showData = () => {
            console.log(this.state.responseData);
        }

        showResponseHandler = (i) => {
            console.log("entered")
           let newIsVisible = [...this.state.isVisible];
           newIsVisible[i] = !newIsVisible[i];
           this.setState({isVisible: newIsVisible});
        }
        
        closeResponseHandler = (i) => {
            console.log("exit");
            let newIsVisible = [...this.state.isVisible];
           newIsVisible[i] = false;
           this.setState({isVisible: newIsVisible});
        }
    render(){
        let essentialFeildTitles = null;
        if(this.state.responseData[0] !== undefined){
            essentialFeildTitles = <div className={classes.Title}>{this.state.responseData[0].essentialFeilds.title.map((title,i) => {
                return (
                    <span key={i}>{title}</span>
                );
            })}<span>Responses</span></div>
        }
        let responses = null;
        if(this.state.responseData.length > 0){
            responses = this.state.responseData.map((response,i) => {
                return (
                    <div key={i} className={classes.Response}>
                    <div className={classes.Content}>
                        {response.essentialFeilds.answer?response.essentialFeilds.answer.map((feild,i) => (<span key={i}>{feild}</span>)):null}
                        <button onClick={() => this.showResponseHandler(i)} className={classes.collapsible}>View Response</button>
                    </div>
                    <div className={classes.Collapsible}>
                    <Collapse isOpen = {this.state.isVisible[i]} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className={classes.CollapsibleContent}>
                    <div>
                        <Response isDataArrived = {true} data = {response.questionArr}/>
                        <Button clicked={() => this.closeResponseHandler(i)}>Close</Button>
                    </div>
                    </Collapse>
                    </div>
                    </div>
                );
            })
        }
        
        return(
            <div className={classes.Responses} onClick={this.showData}>
                {essentialFeildTitles}
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
export default connect(mapStateToProps)(Responses);