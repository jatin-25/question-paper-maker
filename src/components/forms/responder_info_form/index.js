import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./styles.css";

const ResponderInfoForm = (props) => {
  const authState = useSelector((state) => state.auth);

  const [answers, setAnswers] = useState(
    props.feilds
      ? Array(props.feilds.length)
      : []
  );

  //changes the form feilds of responder info form except email.
  const onAnswerChangeHandler = (object) => {
    let answerArr = [...answers];
    if (answerArr.indexOf(authState.email) === -1) {
      answerArr[2] = authState.email;
    }
    answerArr[object.idx] = object.e.target.value;
    setAnswers(answerArr);
    props.updateAnswer(answerArr);
  };

  let responderInfoForm = props.feilds?.map((feildTitle, i) => {
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
  return <div className="ResponderInfoForm">{responderInfoForm}</div>;
};

export default ResponderInfoForm;
