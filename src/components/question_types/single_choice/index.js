import React, { useState } from "react";
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import "./styles.css";

const SCQuestion = (props) => {

    const [answer, setAnswer] = useState(props.showEditButton || !(props.answer) ? 'Not Marked' : props.answer);

    const setAnswerHandler = (idx) => {
        props.updateAnswer({ answer: answer, index: idx });
    }

    const markAnswerHandler = (markedOption) => {
        setAnswer(markedOption);
        setAnswerHandler(props.qkey);
    }


    let options = props.optionsList ? props.optionsList.map((option, index) => {
        return (
            <div key={index} className="Option">
                <input type="radio" name={props.qkey} onChange={() => markAnswerHandler(option)} disabled={props.pageOnWhichRendered !== 'questionPaper'}></input>
                <span >{option}</span>
            </div>
        )
    }) : null;

    let answerComp = null;
    if (props.pageOnWhichRendered !== 'newPaper') {
        answerComp = props.question ? <p style={{ display: "inline-block" }}>Selected Answer: {answer}</p> : null;
    }

    return (
        <div className="Question">
            <p style={{ display: "inline-block" }}>Ques. {props.qkey + 1}: {props.question}</p>
            {options}
            {answerComp}
            {props.pageOnWhichRendered === 'newPaper' && <div className="EditButtonContent">
                <BiIcons.BiEdit onClick={() => props.onEditHandler({ idx: props.qkey, type: "SingleChoiceQuestion" })} className="EditIcon" />
                <MdIcons.MdOutlineDelete onClick={() => props.onRemoveHandler(props.qkey)} className="DeleteIcon" />
            </div>}
        </div>
    );
}


export default SCQuestion;