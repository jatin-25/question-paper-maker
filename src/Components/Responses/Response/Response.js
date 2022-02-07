import React, { Component } from "react";
import SingleChoiceQuestion from "../../QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../../QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import classes from './Response.css';

class Response extends Component{
    
    state = {
        isDataArrived: this.props.isDataArrived,
        questionArr: this.props.isDataArrived?this.props.data:[]
    }


    render(){

        let questionsComponent = null;
        console.log(this.state.questionArr);
        questionsComponent =  this.state.questionArr.map( ( question, i) => {
            let questionComp = null;
            console.log(question);
            switch(question.type){
                case "SingleChoiceQuestion":
                questionComp = <SingleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} answer = {this.state.questionArr[i].answer} key={i} qkey = {i} questionNo = {i+1} pageOnWhichRendered = "response"/>
                break;

                case "MultipleChoiceQuestion":
                    questionComp = <MultipleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} answer = {this.state.questionArr[i].answer} key={i} qkey = {i} questionNo = {i+1} pageOnWhichRendered = "response"/>
                    break;

                case "ParagraphQuestion":
                    questionComp = <ParagraphQuestion question = {this.state.questionArr[i].question} answer = {this.state.questionArr[i].answer} key={i} qkey = {i} questionNo = {i+1} pageOnWhichRendered = "response"/>
                    break;
                default:
                    break;
            }
            return questionComp;
        })
        return(
            <div className={classes.Response}>
                {console.log(this.props.data,"Hello")}
                {questionsComponent}
            </div>
        );
    }
}

export default Response;