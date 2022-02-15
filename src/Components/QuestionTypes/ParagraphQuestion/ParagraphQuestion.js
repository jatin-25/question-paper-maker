import React,{Component} from "react";

class ParagraphQuestion extends Component{

    state = {
        question: this.props.showEditButton?null:this.props.question,
        answer: this.props.showEditButton|| this.props.answer === undefined?"":this.props.answer,
        isHovered: false
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
            <div className="Question" onMouseEnter={() => this.setState({ isHovered: true })} onMouseLeave={() => this.setState({ isHovered: false })}>
            <p style={{display: "inline-block"}}>Ques. {this.props.qkey+1}: {this.props.question}</p>
            {questionArea}
                {this.props.pageOnWhichRendered === 'newPaper' && <div className={[this.state.isHovered ? "EditButtonContent" : "None"]}>
                    <button onClick={() => this.props.onEditHandler({ idx: this.props.qkey, type: "SingleChoiceQuestion" })}>Edit</button>
                    <button onClick={() => this.props.onRemoveHandler(this.props.qkey)}>Remove</button>
                </div>}
            </div>
        );
    }
}

export default ParagraphQuestion;