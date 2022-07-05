import React, { useState } from "react";
import swal from "sweetalert";

const SCQuestionForm = (props) => {


  const [questionData, setQuestionData] = useState({
    type: "SingleChoiceQuestion",
    question: props.question ? props.question : "",
    optionsList: props.optionsList ? props.optionsList : [],
  });

  const [optionsString, setOptionsString] = useState(props.optionsStr ? props.optionsStr : "");


  //adds new question in new paper's question Array or updates the question if edit button clicked.
  const updateQuestionArr = () => {
    if (questionData.question === "") {
      swal("Warning", "Question can't be Empty!", "warning");
    } else if (questionData.optionsList.length < 2) {
      swal(
        "Warning",
        "There should be atleast two options in the Question!",
        "warning"
      );
    } else if (props.edit) {
      props.updateSCQOnEdit({
        question: questionData,
        index: props.qkey,
      });
    } else props.questionDataPass(questionData);
  };


  //updates question of the question object.
  const onChangeQuestionHandler = (e) => {
    const newQuestion = e.target.value;
    const newQuestionData = {
      type: "SingleChoiceQuestion",
      question: newQuestion,
      optionsList: questionData.optionsList,
    };
    setQuestionData(newQuestionData);
  };


  //updates options of the question object.
  const onChangeOptionsHandler = (e) => {
    let optionsListString = e.target.value;
    let options = "";
    let newOptions = "";
    if (optionsListString) {
      options = [...optionsListString.split(",")];
      newOptions = [...options];
    }
    const newQuestionData = {
      type: "SingleChoiceQuestion",
      question: questionData.question,
      optionsList: newOptions,
    };

    setQuestionData(newQuestionData);
    setOptionsString(optionsListString);
  };


  //closes the modal and doesn't update the array
  const cancelButtonHandler = () => {
    if (props.edit) {
      props.updateSCQOnEdit();
    } else props.questionDataPass();
  };


  let options = null;
  if (questionData.optionsList) {
    options = questionData.optionsList.map((option, i) => {
      return (
        <div key={i}>
          <input type="radio"></input>
          <span className="Text">{option}</span>
        </div>
      );
    });
  }

  let inputForm = (
    <div className="Text">
      <p>Write Question Here</p>
      <input
        type="text"
        onChange={(e) => onChangeQuestionHandler(e)}
        value={questionData.question}
      ></input>
      <p>Write options here in the form of comma seperated values</p>
      <input
        type="text"
        onChange={(e) => onChangeOptionsHandler(e)}
        value={optionsString}
      ></input>
      <br></br>
    </div>
  );

  return (
    <div className="Text">
      {inputForm}
      <p>Preview</p>
      <p>{questionData.question}</p>
      {options}
      <button onClick={() => updateQuestionArr()} className="Button">
        Submit
      </button>
      <button onClick={cancelButtonHandler} className="Button">
        Cancel
      </button>
    </div>
  );
}


export default SCQuestionForm;
