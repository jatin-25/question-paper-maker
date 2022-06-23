import React, { useState } from "react";
import SingleChoiceQuestionForm from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceInputForm";
import SingleChoiceQuestion from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import MultipleChoiceQuestionForm from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceInputForm";
import ParagraphQuestionForm from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestionInputForm";
import "./NewPaper.css";
import Modal from "../../Components/hoc/QuestionPopUp/Modal";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Collapse from "@kunukn/react-collapse";
import swal from "sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../Store/Actions/index";

const NewPaper = (props) => {
  const [title, setTitle] = useState("");
  const [essentialFeilds, setEssentialFeilds] = useState({
    title: ["Name", "Roll No.", "Email Id"],
    answer: [],
  });
  const [questionArr, setQuestionArr] = useState([]);
  const [singleChoiceClicked, setSingleChoiceClicked] = useState(false);
  const [multipleChoiceClicked, setMultipleChoiceClicked] = useState(false);
  const [paragraphClicked, setParagraphClicked] = useState(false);
  const [editData, setEditData] = useState({
    type: "",
    clicked: false,
    idx: null,
  });

  const [isToggleShown, setIisToggleShown] = useState(false);
  const [isPaperReady, setIsPaperReady] = useState(false);
  const [isPaperSubmitted, setIsPaperSubmitted] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);

  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const updateQuestionArr = (questionObject) => {
    if (questionObject) {
      let newQuestionsList = [...questionArr, questionObject];
      setQuestionArr(newQuestionsList);
      if (questionArr.length === 0) {
        setIsPaperReady(true);
      }
    }

    setSingleChoiceClicked(false);
    setMultipleChoiceClicked(false);
    setParagraphClicked(false);
  };

  const showSingleChoiceInputForm = () => {
    if (singleChoiceClicked || multipleChoiceClicked || paragraphClicked) {
      swal("Warning", "There is already one question form opened!", "warning");
    } else setSingleChoiceClicked(true);
  };

  const showMultipleChoiceInputForm = () => {
    if (singleChoiceClicked || multipleChoiceClicked || paragraphClicked) {
      swal("Warning", "There is already one question form opened!", "warning");
    } else setMultipleChoiceClicked(true);
  };

  const showParagraphInputForm = () => {
    if (singleChoiceClicked || multipleChoiceClicked || paragraphClicked) {
      swal("Warning", "There is already one question form opened!", "warning");
    } else setParagraphClicked(true);
  };

  const submitQuestionPaperHandler = () => {
    if (title === "") {
      swal("Warning", "Title can't be Empty!", "warning");
    } else {
      swal({
        title: "Are you sure?",
        text: "You want to create your Paper!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willCreate) => {
        if (willCreate) {
          dispatch(setLoading(true));
          const questionPaper = {
            paperId: uuid(),
            title: title,
            essentialFeilds: essentialFeilds,
            questionArr: questionArr,
          };

          axios
            .post("/questionPapers.json?auth=" + authState.token, questionPaper)
            .then((response) => {
              const currentPaperId = {
                paperId: questionPaper.paperId,
                paperTitle: title,
              };
              axios
                .post(
                  "/users/" +
                    authState.userKey +
                    "/createdPapers.json?auth=" +
                    authState.token,
                  currentPaperId
                )
                .then((response) => {
                  setIsPaperSubmitted(true);
                  dispatch(setLoading(false));
                })
                .catch((error) => {
                  dispatch(setLoading(false));
                });
            })
            .catch((error) => {
              dispatch(setLoading(false));
            });
          swal("Congratulations, Your Paper has been created.", {
            icon: "success",
            buttons: {
              stay: "Stay Here",
              catch: {
                text: "Move to Your Papers",
                value: "move",
              },
            },
          }).then((value) => {
            switch (value) {
              case "stay":
                break;
              case "move":
                navigate("/yourPapers");
                break;
              default:
                break;
            }
          });
        }
      });
    }
  };

  const onEditButtonClickedHandler = (editDataObject) => {
    if (editData.clicked) {
      swal("Warning", "There is already one question form opened!", "warning");
    } else {
      const newEditData = {
        type: editDataObject.type,
        clicked: true,
        idx: editDataObject.idx,
      };
      setEditData(newEditData);
    }
  };

  const onRemoveButtonClickedHandler = (index) => {
    let newQuestionArr = [...questionArr];
    newQuestionArr.splice(index, 1);
    if (newQuestionArr.length === 0) {
      setIsPaperReady(false);
    }
    setQuestionArr(newQuestionArr);
  };

  const updateQuestionOnEdit = (questionObject) => {
    const newEditData = {
      clicked: false,
      idx: null,
    };
    if (questionObject) {
      let newQuestionArr = [...questionArr];
      newQuestionArr.splice(questionObject.index, 1, questionObject.question);
      setQuestionArr(newQuestionArr);
    }
    setEditData(newEditData);
  };

  //   const invertToggle = () => {
  //     setState({ ...state, isToggleShown: !isToggleShown });
  //   };

  const onChangeTitleHandler = (e) => {
    setTitle(e.target.value);
  };
  let questionsComponent = null;
  questionsComponent = questionArr.map((question, i) => {
    let questionComp = null;
    switch (question.type) {
      case "SingleChoiceQuestion":
        questionComp = (
          <SingleChoiceQuestion
            optionsList={questionArr[i].optionsList}
            question={questionArr[i].question}
            key={i}
            qkey={i}
            onEditHandler={onEditButtonClickedHandler}
            onRemoveHandler={onRemoveButtonClickedHandler}
            pageOnWhichRendered="newPaper"
          />
        );
        break;

      case "MultipleChoiceQuestion":
        questionComp = (
          <MultipleChoiceQuestion
            optionsList={questionArr[i].optionsList}
            question={questionArr[i].question}
            key={i}
            qkey={i}
            onEditHandler={onEditButtonClickedHandler}
            onRemoveHandler={onRemoveButtonClickedHandler}
            pageOnWhichRendered="newPaper"
          />
        );
        break;

      case "ParagraphQuestion":
        questionComp = (
          <ParagraphQuestion
            question={questionArr[i].question}
            key={i}
            qkey={i}
            onEditHandler={onEditButtonClickedHandler}
            onRemoveHandler={onRemoveButtonClickedHandler}
            pageOnWhichRendered="newPaper"
          />
        );
        break;
      default:
        break;
    }
    return questionComp;
  });

  let singleChoiceQuestionForm = null;
  if (singleChoiceClicked) {
    singleChoiceQuestionForm = (
      <SingleChoiceQuestionForm
        questionDataPass={updateQuestionArr}
        edit={false}
      />
    );
  }

  let multipleChoiceQuestionForm = null;
  if (multipleChoiceClicked) {
    multipleChoiceQuestionForm = (
      <MultipleChoiceQuestionForm
        questionDataPass={updateQuestionArr}
        edit={false}
      />
    );
  }

  let paragraphQuestionForm = null;
  if (paragraphClicked) {
    paragraphQuestionForm = (
      <ParagraphQuestionForm
        questionDataPass={updateQuestionArr}
        edit={false}
      />
    );
  }

  let singleChoiceEditForm = null;
  if (editData.clicked && editData.type === "SingleChoiceQuestion") {
    let optionsString = null;
    let tempOptionsString = questionArr[editData.idx].optionsList.join(",");
    optionsString = tempOptionsString.substring(0, tempOptionsString.length);
    singleChoiceEditForm = (
      <SingleChoiceQuestionForm
        optionsList={questionArr[editData.idx].optionsList}
        question={questionArr[editData.idx].question}
        edit={editData.clicked}
        updateSCQOnEdit={updateQuestionOnEdit}
        qkey={editData.idx}
        optionsStr={optionsString}
      />
    );
  }
  let multipleChoiceEditForm = null;
  if (editData.clicked && editData.type === "MultipleChoiceQuestion") {
    let optionsString = null;
    let tempOptionsString = questionArr[editData.idx].optionsList.join(",");
    optionsString = tempOptionsString.substring(0, tempOptionsString.length);
    multipleChoiceEditForm = (
      <MultipleChoiceQuestionForm
        optionsList={questionArr[editData.idx].optionsList}
        question={questionArr[editData.idx].question}
        edit={editData.clicked}
        updateMCQOnEdit={updateQuestionOnEdit}
        qkey={editData.idx}
        optionsStr={optionsString}
      />
    );
  }
  let paragraphEditForm = null;
  if (editData.clicked && editData.type === "ParagraphQuestion") {
    paragraphEditForm = (
      <ParagraphQuestionForm
        question={questionArr[editData.idx].question}
        edit={editData.clicked}
        updatePQOnEdit={updateQuestionOnEdit}
        qkey={editData.idx}
      />
    );
  }

  let paperTitle = isPaperReady ? (
    <div className="PaperTitle">
      <p>Paper Title</p>
      <input type="text" onChange={(e) => onChangeTitleHandler(e)}></input>
    </div>
  ) : null;

  let addQuestionTypes = null;
  addQuestionTypes = (
    <div className="AddButton" onClick={() => setAddQuestion(!addQuestion)}>
      {/* <img src={add} alt="Add Question"/> */}
      <span>Add Question</span>
      <Collapse
        isOpen={addQuestion}
        transition="height 0.7s cubic-bezier(.4, 0, .2, 1)"
        className="AddQuestionContent"
      >
        <div className="QuestionTypesContent">
          <ul>
            <li onClick={showSingleChoiceInputForm}>Single Choice Question</li>
            <li onClick={showMultipleChoiceInputForm}>
              Multiple Choice Question
            </li>
            <li onClick={showParagraphInputForm}>Paragraph Question</li>
          </ul>
        </div>
      </Collapse>
    </div>
  );
  return (
    <div className="QuestionArea">
      {paperTitle}
      <Modal show={singleChoiceClicked}>{singleChoiceQuestionForm}</Modal>
      <Modal show={multipleChoiceClicked}>{multipleChoiceQuestionForm}</Modal>
      <Modal show={paragraphClicked}>{paragraphQuestionForm}</Modal>
      <Modal
        show={editData.clicked && editData.type === "SingleChoiceQuestion"}
      >
        {singleChoiceEditForm}
      </Modal>
      <Modal
        show={editData.clicked && editData.type === "MultipleChoiceQuestion"}
      >
        {multipleChoiceEditForm}
      </Modal>
      <Modal show={editData.clicked && editData.type === "ParagraphQuestion"}>
        {paragraphEditForm}
      </Modal>

      {isPaperReady ? (
        <div className="NewQuestionPaper">{questionsComponent}</div>
      ) : null}
      {addQuestionTypes}
      <div className="BtnAreaPaper">
        <button
          onClick={() => submitQuestionPaperHandler()}
          className="Button"
          style={{ display: isPaperReady ? "inline" : "none" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewPaper;
