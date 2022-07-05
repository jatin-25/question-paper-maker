import React, { useState } from "react";
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import "./styles.css";

const PGQuestion = (props) => {

    const [answer, setAnswer] = useState(props.showEditButton || !(props.answer) ? "" : props.answer);


    const setAnswerHandler = (idx) => {
        props.updateAnswer({ answer: answer, index: idx });
    }

    const onAnswerChangeHandler = (e) => {
        setAnswer(e.target.value);
        setAnswerHandler(props.qkey);
    }

    let questionArea = null;
    if (props.question) {
        questionArea = <div>
            <textarea className="ParaAnswer" rows='8' cols='70' onChange={(e) => onAnswerChangeHandler(e)} value={answer} disabled={props.pageOnWhichRendered !== 'questionPaper'}></textarea></div>
    }
    return (
        <div className="Question">
            <p style={{ display: "inline-block" }}>Ques. {props.qkey + 1}: {props.question}</p>
            {questionArea}
            {props.pageOnWhichRendered === 'newPaper' && <div className="EditButtonContent">
                <BiIcons.BiEdit onClick={() => props.onEditHandler({ idx: props.qkey, type: "ParagraphQuestion" })} className="EditIcon" />
                <MdIcons.MdOutlineDelete onClick={() => props.onRemoveHandler(props.qkey)} className="DeleteIcon" />
            </div>}
        </div>
    );
}

export default PGQuestion;