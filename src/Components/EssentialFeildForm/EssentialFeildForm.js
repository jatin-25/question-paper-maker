import React, { Component } from "react";
import classes from './EssentialFeildForm.css';

class EssentialFeildForm extends Component{

    state = {
        essentialFeilds : (this.props.essentialFeilds !== undefined)?this.props.essentialFeilds:[],
        answers: (this.props.essentialFeilds !== undefined)?Array(this.props.essentialFeilds.length):[]
    }


    onAnswerChangeHandler = (object) => {
        let answerArr = [...this.state.answers];
        answerArr[object.idx] = object.e.target.value;
        this.setState({answers: answerArr},() => this.props.updateAnswer(answerArr));
    }

    render(){

        let essentialFeildForm = this.state.essentialFeilds.map((feildTitle,i) => {
            return (
                <div key={i}>
                    <p>{feildTitle}</p>
                    <input type='text' onChange={(e) => this.onAnswerChangeHandler({e: e,idx: i})} minLength={1}></input>
                </div>
            );
        })
        return(
            <div className={classes.EssentialFeildForm}>
                {console.log(this.state.essentialFeilds,this.props.essentialFeilds)}
                {essentialFeildForm}
            </div>
        );
    }
}

export default EssentialFeildForm;