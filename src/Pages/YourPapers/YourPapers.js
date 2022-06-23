import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../axios";
import "./YourPapers.css";
import { setLoading } from "../../Store/Actions/index";
import { useSelector, useDispatch } from "react-redux";
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
import * as BiIcons from "react-icons/bi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import swal from "sweetalert";

const YourPapers = (props) => {
  const [questionData, setQuestionData] = useState([]);
  // const [questionKeyArr, setQuestionKeyArr] = useState([]);
  const [doPaperExists, setDoPaperExists] = useState(false);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const queryParams = `?auth=${authState.token}`;

    axios
      .get("/users/" + authState.userKey + "/createdPapers.json" + queryParams)
      .then((response) => {
        if (response.data) {
          setQuestionData(Object.values(response.data));
          // setQuestionKeyArr(Object.keys(response.data));
        } else {
          setDoPaperExists(true);
        }
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setLoading(false));
      });
  }, []);

  const showQuestionHandler = (i) => {
    props.updateQuestionRouteData({
      idx: i,
      id: questionData[i].paperId,
    });
  };

  const showResponsesHandler = (i) => {
    props.updateResponsesRouteData({
      idx: i,
      id: questionData[i].paperId,
    });
  };

  const linkCopied = () => {
    swal({
      title: "Congratulations!",
      text: "The link of your paper has been copied!",
      icon: "success",
      button: "Okay!",
    });
  };
  let essentialFeildTitles = null;
  if (questionData[0] !== undefined) {
    essentialFeildTitles = (
      <div className="YourPapersTitle">
        <span>Title</span>
        <span>Question Paper</span>
        <span>Responses</span>
      </div>
    );
  }
  let questions = null;
  if (questionData.length > 0) {
    questions = questionData.map((question, i) => {
      return (
        <div key={i} className="QuestionPapers">
          <div className="SmallScreenPaperOptions">
            <CopyToClipboard
              text={window.location.origin + "/papers/" + question.paperId}
              onCopy={() => linkCopied()}
            >
              <div className="TitleContainer">
                <span>{question.paperTitle}</span>
                <BiIcons.BiShareAlt />
              </div>
            </CopyToClipboard>
            <NavLink
              to={{
                pathname: "/papers/" + questionData[i].paperId,
              }}
              className="YourPapersButton"
              onClick={() => showQuestionHandler(i)}
            >
              View
            </NavLink>

            <NavLink
              to={"/yourPapers/" + i + "/responses"}
              className="YourPapersButton"
              onClick={() => showResponsesHandler(i)}
            >
              View
            </NavLink>
          </div>
          <div className="TabDesktopPaperOptions">
            <CopyToClipboard
              text={window.location.origin + "/papers/" + question.paperId}
              onCopy={() => linkCopied()}
            >
              <div className="TitleContainer">
                <span>{question.paperTitle}</span>
                <BiIcons.BiShareAlt />
              </div>
            </CopyToClipboard>
            <NavLink
              to={{
                pathname: "/papers/" + questionData[i].paperId,
              }}
              className="YourPapersButton"
              onClick={() => showQuestionHandler(i)}
            >
              View Paper
            </NavLink>

            <NavLink
              to={"/yourPapers/" + i + "/responses"}
              className="YourPapersButton"
              onClick={() => showResponsesHandler(i)}
            >
              View Responses
            </NavLink>
          </div>
        </div>
      );
    });
  }

  return (
    <BackDrop isLoading={authState.loading}>
      {doPaperExists ? (
        <div className="noPapers">
          <p>You haven't created any papers yet.</p>
        </div>
      ) : (
        <div className="YourPapersContent">
          {essentialFeildTitles}
          {questions}
        </div>
      )}
    </BackDrop>
  );
};

export default YourPapers;
