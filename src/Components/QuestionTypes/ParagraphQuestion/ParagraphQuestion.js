import React,{Component} from "react";
import classes from './ParagraphQuestion.css';

class ParagraphQuestion extends Component{

    state = {
        question: this.props.showEditButton?null:this.props.question,
        answer: this.props.showEditButton|| this.props.answer === undefined?"":this.props.answer

    }

    setAnswer = (idx) => {
        this.props.updateAnswer({answer:this.state.answer,index:idx});
    }

    onAnswerChangeHandler = (e) => {
        this.setState({answer:e.target.value},() => this.setAnswer(this.props.qkey));
    }

    render(){
        let questionArea = null;
        if(this.props.question !== null){
            questionArea =  <div>
                <textarea rows='7' cols='70' onChange={(e) => this.onAnswerChangeHandler(e)} value={this.state.answer}  disabled = {this.props.pageOnWhichRendered !== 'questionPaper'}></textarea></div>
        }
        return (  
            <div className={classes.Question}>
            <p style={{display: "inline-block"}}>Ques. {this.props.qkey+1}: {this.props.question}</p>
            {questionArea}
            <button className={classes.display}  style={{display: this.props.pageOnWhichRendered === 'newPaper'?null:"none"}} onClick={() => this.props.editButtonHandler({idx:this.props.qkey,type: "ParagraphQuestion"})}>Edit</button>
            </div>
        );
    }
}

export default ParagraphQuestion;