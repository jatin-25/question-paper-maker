import React, { useEffect, useState } from "react";
import SingleChoiceQuestion from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import axios from "../../axios";
import "./QuestionPaper.css";
import EssentialFeildForm from "../../Components/EssentialFeildForm/EssentialFeildForm";
import { v4 as uuid } from "uuid";
import { setLoading } from "../../Store/Actions/index";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
import swal from "sweetalert";

const QuestionPaper = (props) => {
  const [title, setTitle] = useState("");
  const { qkey } = useParams();
  const [isSubmitted, setIsSubmitted] = useState("Not Known");
  const [essentialFeilds, setEssentialFeilds] = useState({
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
                axios
                  .get("/questionPapers.json" + queryParams2)
                  .then((response) => {
                    const questionPaper = Object.values(response.data);

                    if (response.data) {
                      setTitle(questionPaper[0].title);
                      setEssentialFeilds(questionPaper[0].essentialFeilds);
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
                setEssentialFeilds(questionPaper[0].essentialFeilds);
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

  const updateEssentialFeildAnswerHandler = (answer) => {
    if (answer !== undefined && answer) {
      let essentialFeild = { ...essentialFeilds, answer: [] };
      essentialFeild.answer = answer;
      setEssentialFeilds(essentialFeild);
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
            essentialFeilds: essentialFeilds,
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
                .then((response) => {})
                .catch((error) => {});
            })
            .catch((error) => {});
          setIsSubmitted(true);
        }
      });
    } else {
      swal("Warning", "Essential Feilds can't be Empty!", "warning");
    }
  };

  const onSubmitHandler = () => {
    if (essentialFeilds.answer) {
      const answers = essentialFeilds.answer;
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

  let essentialFeildInputForm = null;
  if (Object.keys(essentialFeilds).indexOf("title") !== -1) {
    essentialFeildInputForm = (
      <EssentialFeildForm
        essentialFeilds={essentialFeilds.title}
        updateAnswer={updateEssentialFeildAnswerHandler}
      />
    );
  }

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
            updateAnswer={updateAnswerHandler}
            questionNo={i + 1}
            pageOnWhichRendered="questionPaper"
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
            updateAnswer={updateAnswerHandler}
            questionNo={i + 1}
            pageOnWhichRendered="questionPaper"
          />
        );
        break;

      case "ParagraphQuestion":
        questionComp = (
          <ParagraphQuestion
            question={questionArr[i].question}
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
          {essentialFeildInputForm}
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
