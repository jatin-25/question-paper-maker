import React, { Component } from "react";
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import './ParagraphQuestion.css';
class ParagraphQuestion extends Component {

    state = {
        question: this.props.showEditButton ? null : this.props.question,
        answer: this.props.showEditButton || this.props.answer === undefined ? "" : this.props.answer,
    }

    setAnswer = (idx) => {
        this.props.updateAnswer({ answer: this.state.answer, index: idx });
    }

    onAnswerChangeHandler = (e) => {
        this.setState({ answer: e.target.value }, () => this.setAnswer(this.props.qkey));
    }

    render() {
        let questionArea = null;
        if (this.props.question !== null) {
            questionArea = <div>
                <textarea className="ParaAnswer" rows='8' cols='70' onChange={(e) => this.onAnswerChangeHandler(e)} value={this.state.answer} disabled={this.props.pageOnWhichRendered !== 'questionPaper'}></textarea></div>
        }
        return (
            <div className="Question">
                <p style={{ display: "inline-block" }}>Ques. {this.props.qkey + 1}: {this.props.question}</p>
                {questionArea}
                {this.props.pageOnWhichRendered === 'newPaper' && <div className="EditButtonContent">
                    <BiIcons.BiEdit onClick={() => this.props.onEditHandler({ idx: this.props.qkey, type: "ParagraphQuestion" })} className="EditIcon" />
                    <MdIcons.MdOutlineDelete onClick={() => this.props.onRemoveHandler(this.props.qkey)} className="DeleteIcon" />
                </div>}
            </div>
        );
    }
}

export default ParagraphQuestion;