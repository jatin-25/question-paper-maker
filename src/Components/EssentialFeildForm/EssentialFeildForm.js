import React, { useState } from "react";
import "./EssentialFeildForm.css";
import { useSelector } from "react-redux";

const EssentialFeildForm = (props) => {
  const authState = useSelector((state) => state.auth);

  const [essentialFeilds, setEssentialFeilds] = useState(
    props.essentialFeilds !== undefined ? props.essentialFeilds : []
  );

  const [answers, setAnswers] = useState(
    props.essentialFeilds !== undefined
      ? Array(props.essentialFeilds.length)
      : []
  );

  const onAnswerChangeHandler = (object) => {
    let answerArr = [...answers];
    if (answerArr.indexOf(authState.email) === -1) {
      answerArr[2] = authState.email;
    }
    answerArr[object.idx] = object.e.target.value;
    setAnswers(answerArr);
    props.updateAnswer(answerArr);
  };

  let essentialFeildForm = essentialFeilds.map((feildTitle, i) => {
    return (
      <div key={i}>
        <p>{feildTitle}</p>
        {i === 2 ? (
          <input
            type="text"
            minLength={1}
            defaultValue={authState.email}
            readOnly
          ></input>
        ) : (
          <input
            type="text"
            onChange={(e) => onAnswerChangeHandler({ e: e, idx: i })}
            minLength={1}
          ></input>
        )}
      </div>
    );
  });
  return <div className="EssentialFeildForm">{essentialFeildForm}</div>;
};

export default EssentialFeildForm;
