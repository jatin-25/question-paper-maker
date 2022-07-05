import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { SCQuestion, MCQuestion, PGQuestion } from "../../components/question_types";
import ResponderInfoForm from "../../components/forms/responder_info_form";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../store/actions";
import { useParams } from "react-router-dom";
import BackDrop from "../../components/hoc/backdrop";
import { v4 as uuid } from "uuid";
import swal from "sweetalert";
import "./styles.css";

const QuestionPaper = (props) => {
  const [title, setTitle] = useState("");
  const { qkey } = useParams();
  const [isSubmitted, setIsSubmitted] = useState("Not Known");
  const [responderInfoFeilds, setResponderInfoFeilds] = useState({
    answer: [],
  });
  const [questionArr, setQuestionArr] = useState([]);

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const queryParams = `?auth=${authState.token}`;
    axios
      .get(
        "/users/" + authState.userKey + "/submittedResponses.json" + queryParams
      )
      .then((response) => {
        if (response.data) {
          const queryParams3 = `?auth=${authState.token}&orderBy="paperId"&equalTo="${qkey}"`;
          axios
            .get(
              "/users/" +
              authState.userKey +
              "/submittedResponses.json" +
              queryParams3
            )
            .then((response) => {
              if (Object.values(response.data).length === 0) {
                const queryParams2 = `?auth=${authState.token}&orderBy="paperId"&equalTo="${qkey}"`;
                axios.get("/questionPapers.json" + queryParams2).then((response) => {
                  const questionPaper = Object.values(response.data);

                  if (response.data) {
                    setTitle(questionPaper[0].title);
                    setResponderInfoFeilds(questionPaper[0].responderInfoFeilds);
                    setQuestionArr(questionPaper[0].questionArr);
                    setIsSubmitted(false);
                  }

                  dispatch(setLoading(false));
                })
                  .catch((error) => {
                    dispatch(setLoading(false));
                  });
              } else {
                setIsSubmitted(true);
                dispatch(setLoading(false));
              }
            })
            .catch((error) => {
              dispatch(setLoading(false));
            });
        } else {
          const queryParams2 = `?auth=${authState.token}&orderBy="paperId"&equalTo="${qkey}"`;
          axios
            .get("/questionPapers.json" + queryParams2)
            .then((response) => {
              const questionPaper = Object.values(response.data);
              if (response.data) {
                setTitle(questionPaper[0].title);
                setResponderInfoFeilds(questionPaper[0].responderInfoFeilds);
                setQuestionArr(questionPaper[0].questionArr);
                setIsSubmitted(false);
              }

              dispatch(setLoading(false));
            })
            .catch((error) => {
              dispatch(setLoading(false));
            });
        }
      })
      .catch((error) => dispatch(setLoading(false)));
  }, [qkey]);

  const updateAnswerHandler = (answerObject) => {
    let oldQuestionData = questionArr[answerObject.index];
    oldQuestionData.answer = answerObject.answer;
    let newQuestionArr = [...questionArr];
    newQuestionArr.splice(answerObject.index, 1, oldQuestionData);
    setQuestionArr(newQuestionArr);
  };

  const updateResponderInfoFeildAnswerHandler = (answer) => {
    if (answer !== undefined && answer) {
      let responderInfoFeild = { ...responderInfoFeilds, answer: [] };
      responderInfoFeild.answer = answer;
      setResponderInfoFeilds(responderInfoFeild);
    }
  };

  const submitQuestionPaperHandler = () => {
    if (onSubmitHandler()) {
      swal({
        title: "Are you sure?",
        text: "You want to submit your Paper!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willSubmit) => {
        if (willSubmit) {
          const questionPaperResponse = {
            responseId: uuid(),
            paperId: qkey,
            responderInfoFeilds: responderInfoFeilds,
            questionArr: questionArr,
          };

          axios
            .post(
              "/responses.json?auth=" + authState.token,
              questionPaperResponse
            )
            .then((response) => {
              const currentResponseId = {
                responseId: questionPaperResponse.responseId,
                paperId: qkey,
                paperTitle: title,
              };
              axios
                .post(
                  "/users/" +
                  authState.userKey +
                  "/submittedResponses.json?auth=" +
                  authState.token,
                  currentResponseId
                )
                .then((response) => { })
                .catch((error) => { });
            })
            .catch((error) => { });
          setIsSubmitted(true);
        }
      });
    } else {
      swal("Warning", "Essential Feilds can't be Empty!", "warning");
    }
  };

  const onSubmitHandler = () => {
    if (responderInfoFeilds.answer) {
      const answers = responderInfoFeilds.answer;
      let isFormInvalid = false;
      for (let i = 0; i < answers.length; ++i) {
        if (
          answers[i] === undefined ||
          answers[i] === null ||
          answers[i] === ""
        ) {
          isFormInvalid = true;
          break;
        }
      }
      if (isFormInvalid) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };

  let responderInfoInputForm = null;
  if (Object.keys(responderInfoFeilds).indexOf("title") !== -1) {
    responderInfoInputForm = (
      <ResponderInfoForm
        feilds={responderInfoFeilds.title}
        updateAnswer={updateResponderInfoFeildAnswerHandler}
      />
    );
  }

  let questionsComponent = null;
  questionsComponent = questionArr.map((question, i) => {
    let questionComp = null;
    switch (question?.type) {
      case "SingleChoiceQuestion":
        questionComp = (
          <SCQuestion
            optionsList={questionArr[i]?.optionsList}
            question={questionArr[i]?.question}
            key={i}
            qkey={i}
            updateAnswer={updateAnswerHandler}
            questionNo={i + 1}
            pageOnWhichRendered="questionPaper"
          />
        );
        break;

      case "MultipleChoiceQuestion":
        questionComp = (
          <MCQuestion
            optionsList={questionArr[i]?.optionsList}
            question={questionArr[i]?.question}
            key={i}
            qkey={i}
            updateAnswer={updateAnswerHandler}
            questionNo={i + 1}
            pageOnWhichRendered="questionPaper"
          />
        );
        break;

      case "ParagraphQuestion":
        questionComp = (
          <PGQuestion
            question={questionArr[i]?.question}
            key={i}
            qkey={i}
            updateAnswer={updateAnswerHandler}
            questionNo={i + 1}
            pageOnWhichRendered="questionPaper"
          />
        );
        break;
      default:
        break;
    }
    return questionComp;
  });

  return (
    <BackDrop isLoading={authState.loading}>
      {isSubmitted === true ? (
        <div className="noPapers">
          <p>Your response has been submitted.</p>
        </div>
      ) : null}
      {isSubmitted !== null && isSubmitted === false ? (
        <div className="QuestionPaperArea">
          {responderInfoInputForm}
          <div className={["QuestionPaper", "LightBlue"].join(" ")}>
            {questionsComponent}
          </div>
          <div className="BtnArea">
            <button onClick={submitQuestionPaperHandler} className="Button">
              Submit
            </button>
          </div>
        </div>
      ) : null}
    </BackDrop>
  );
};

export default QuestionPaper;
