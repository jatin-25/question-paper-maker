import React,{Component} from "react";
import classes from './SingleChoiceQuestion.css';

class SingleChoiceQuestion extends Component{

    state = {
        question:this.props.showEditButton?null:this.props.question,
        options: this.props.showEditButton?null:this.props.optionsList,
        answer: this.props.showEditButton || this.props.answer === undefined?'Not Marked':this.props.answer
    }

    setAnswer = (idx) => {
        
        this.props.updateAnswer({answer:this.state.answer,index:idx});
    }
    markAnswerHandler = (markedOption) => {
        this.setState({answer:markedOption},() => this.setAnswer(this.props.qkey));
        // console.log(this.state.answer);
    }

    render(){
        let options = null;
        options = this.props.optionsList?this.props.optionsList.map(option =>{
            return (
            <div key={option}>
            <input type="radio" name={this.props.qkey} onChange={() => this.markAnswerHandler(option)} disabled = {this.props.pageOnWhichRendered !== 'questionPaper'}></input>
            <span >{option}</span>
            </div>
            )
        }):null;

        
        let answer = null
        if(this.props.pageOnWhichRendered !== 'newPaper'){
            answer = this.props.question?<p  style={{display: "inline-block"}}>Selected Answer: {this.state.answer}</p>:null;
        }
        return (
            <div className={classes.Question}>
                <p style={{display: "inline-block"}}>Ques. {this.props.qkey+1}: {this.props.question}</p>
                {options}
                {answer}
                <button style={{display: this.props.pageOnWhichRendered === 'newPaper'?null:"none"}} onClick={() => this.props.editButtonHandler({idx: this.props.qkey,type: "SingleChoiceQuestion"})}>Edit</button>
            </div>
        );
    }
}

export default SingleChoiceQuestion;