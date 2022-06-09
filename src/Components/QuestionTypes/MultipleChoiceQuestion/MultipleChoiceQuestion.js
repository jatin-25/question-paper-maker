import React, { Component } from "react";
import './MultipleChoiceQuestion.css';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';


class MultipleChoiceQuestion extends Component {

    state = {
        question: this.props.showEditButton ? null : this.props.question,
        options: this.props.showEditButton ? null : this.props.optionsList,
        answersArr: this.props.showEditButton || this.props.answer === undefined ? ['Not Marked'] : this.props.answer
    }

    setAnswer = (idx) => {
        this.props.updateAnswer({ answer: this.state.answersArr, index: idx });
    }

    updateAnswersArrHandler = (option) => {

        let oldAnswerArr = this.state.answersArr;
        if (oldAnswerArr.length === 1 && oldAnswerArr[0] === 'Not Marked') {
            oldAnswerArr.splice(0, 1);
        }
        const optionIndex = oldAnswerArr.findIndex((element) => element === option);
        let newAnswerArr = null;
        if (optionIndex === -1) {
            newAnswerArr = [...oldAnswerArr, option];
        }
        else {
            oldAnswerArr.splice(optionIndex, 1);
            newAnswerArr = [...oldAnswerArr];
        }
        if (newAnswerArr.length <= 1) {
            if (newAnswerArr.length === 0) {
                newAnswerArr = ['Not Marked'];
            }
        }
        this.setState({ answersArr: newAnswerArr }, () => this.setAnswer(this.props.qkey));
    }

    render() {
        let options = null;
        options = this.props.optionsList ? this.props.optionsList.map((option, index) => {
            return (
                <div key={index} className="Option">
                    <input type="checkbox" name={this.props.qkey} onChange={() => this.updateAnswersArrHandler(option)} disabled={this.props.pageOnWhichRendered !== 'questionPaper'}></input>
                    <span>{option}</span>
                </div>
            )
        }) : null;


        let answers = null;
        const n = this.state.answersArr.length;
        if (n) {
            answers = this.state.answersArr.map((answer, i) => {
                return <span key={i} style={{ margin: "15px 0" }}>{answer}{n === i + 1 ? ' ' : ', '}</span>
            })
        }
        let selectedAnswer = null;
        if (this.props.pageOnWhichRendered !== 'newPaper') {
            selectedAnswer = <p style={{ display: "inline-block" }}>Selected Answer(s): {answers}</p>
        }
        return (
            <div className="Question">
                <p style={{ marginBottom: "5px", display: "inline-block" }}>Ques {this.props.qkey + 1}: {this.props.question}</p>
                {options}
                {selectedAnswer}
                {this.props.pageOnWhichRendered === 'newPaper' && <div className="EditButtonContent">
                    <BiIcons.BiEdit onClick={() => this.props.onEditHandler({ idx: this.props.qkey, type: "MultipleChoiceQuestion" })} className="EditIcon" />
                    <MdIcons.MdOutlineDelete onClick={() => this.props.onRemoveHandler(this.props.qkey)} className="DeleteIcon" />
                </div>}
            </div>
        );
    }
}

export default MultipleChoiceQuestion;