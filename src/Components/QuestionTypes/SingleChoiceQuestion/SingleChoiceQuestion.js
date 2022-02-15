import React,{Component} from "react";
import './SingleChoiceQuestion.css';

class SingleChoiceQuestion extends Component{

    state = {
        question:this.props.showEditButton?null:this.props.question,
        options: this.props.showEditButton?null:this.props.optionsList,
        answer: this.props.showEditButton || this.props.answer === undefined ? 'Not Marked' : this.props.answer,
        isHovered: false
    }

    setAnswer = (idx) => {
        
        this.props.updateAnswer({answer:this.state.answer,index:idx});
    }
    markAnswerHandler = (markedOption) => {
        this.setState({answer:markedOption},() => this.setAnswer(this.props.qkey));
    }

    onMouseEnterHandler = () => {
        this.setState({isHovered: true})
    }
    render(){
        let options = null;
        options = this.props.optionsList?this.props.optionsList.map(option =>{
            return (
            <div key={option} className="Option">
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
            <div className="Question" onMouseEnter={() => this.setState({ isHovered: true })} onMouseLeave={() => this.setState({ isHovered: false })}>
                <p style={{display: "inline-block"}}>Ques. {this.props.qkey+1}: {this.props.question}</p>
                {options}
                {answer}
                {this.props.pageOnWhichRendered === 'newPaper' && <div className={[this.state.isHovered ? "EditButtonContent" : "None"]}>
                    <button onClick={() => this.props.onEditHandler({ idx: this.props.qkey, type: "SingleChoiceQuestion" })}>Edit</button>
                    <button onClick={() => this.props.onRemoveHandler(this.props.qkey)}>Remove</button>
                </div>}
            </div>
        );
    }
}

export default SingleChoiceQuestion;