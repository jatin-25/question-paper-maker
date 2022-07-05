import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import NewPaper from "./pages/new_paper";
import PaperResponses from "./pages/paper_responses";
import Toolbar from "./components/toolbar";
import YourPapers from "./pages/your_papers";
import QuestionPaper from "./pages/question_paper";
import Profile from "./pages/profile";
import SubmittedResponses from "./pages/submitted_responses";
import AuthForm from "./pages/authentication";
import NotFound from "./pages/not_found";
import { checkAuthState } from "./store/actions";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const App = (props) => {
  const [isViewPaperClicked, setIsViewPaperClicked] = useState(false);
  const [isViewResponseClicked, setIsViewResponseClicked] = useState(false);
  const [paperId, setPaperId] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [paperIdx, setPaperIdx] = useState(null);
  const [responseIdx, setResponseIdx] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthState());
  }, []);

  useEffect(() => {
    if (authState.token) {
      if (location.state) {
        navigate(location.state.prevPath);
      }
    }
  }, [authState.token]);

  const updateQuestionRouteDataHandler = (questionRouteData) => {
    if (questionRouteData) {
      setIsViewPaperClicked(true);
      setPaperId(questionRouteData.id);
      setPaperIdx(questionRouteData.idx);
    }
  };

  const updateResponsesRouteDataHandler = (responsesRouteData) => {
    if (responsesRouteData) {
      setIsViewResponseClicked(true);
      setResponseId(responsesRouteData.id);
      setResponseIdx(responsesRouteData.idx);
    }
  };

  return (
    <div>
      {authState.token !== null ? <Toolbar initialToolbar={true} /> : null}
      {authState.token ? (
        <Routes>
          <Route path="/" exact element={<NewPaper />} />
          <Route path="/newPaper" exact element={<NewPaper />} />
          <Route path="/response" exact element={<PaperResponses />} />
          <Route
            path="/yourPapers"
            exact
            element={
              <YourPapers
                updateQuestionRouteData={updateQuestionRouteDataHandler}
                updateResponsesRouteData={updateResponsesRouteDataHandler}
              />
            }
          />
          <Route
            path="/submittedResponses"
            exact
            element={<SubmittedResponses />}
          />
          <Route exact path="/papers/:qkey" element={<QuestionPaper />} />
          {isViewResponseClicked ? (
            <Route
              exact
              path={"/yourPapers/" + responseIdx + "/responses"}
              element={<PaperResponses qkey={responseId} />}
            />
          ) : null}
          <Route path="/profile" exact element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" exact element={<AuthForm />} />
          {localStorage.getItem("token") === null && (
            <Route
              path={"*"}
              element={
                <Navigate
                  to="/login"
                  replace
                  state={{ prevPath: location.pathname }}
                />
              }
            />
          )}
        </Routes>
      )}
    </div>
  );
};

export default App;
