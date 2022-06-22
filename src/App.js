import React, { useEffect } from 'react';
import './App.css';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import NewPaper from './Pages/NewPaper/NewPaper';
import PaperResponses from './Pages/PaperResponses/PaperResponses';
import Toolbar from './Components/Navigation/Toolbar/Toolbar';
import YourPapers from './Pages/YourPapers/YourPapers';
import QuestionPaper from './Pages/QuestionPaper/QuestionPaper';
import Profile from './Pages/Profile/Profile';
import SubmittedResponses from './Pages/SubmittedResponses/SubmittedResponses';
import AuthForm from './Pages/Authentication/AuthForm';
import NotFound from './Pages/NotFound/NotFound';
import * as actions from './Store/Actions/index';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
const App = (props) => {

  const [questionRouteData, setQuestionRouteData] = useState({
    isRouteClicked: false,
    id: null
  });

  const [responsesRouteData, setResponsesRouteData] = useState({
    isRouteClicked: false,
    id: null
  })
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    props.isAuthValid();
  }, [])

  useEffect(() => {
    if (props.isAuthenticated) {
      if (location.state)
        history.push(location.state.prevPath);
      else
        history.push('/newPaper');
    }
  }, [props.isAuthenticated])

  const updateQuestionRouteDataHandler = (questionRouteData) => {
    if (questionRouteData) {
      const newRouteData = {
        isRouteClicked: true,
        idx: questionRouteData.idx,
        id: questionRouteData.id
      }

      setQuestionRouteData(newRouteData);
    }
  }

  const updateResponsesRouteDataHandler = (responsesRouteData) => {
    if (responsesRouteData) {
      const newRouteData = {
        isRouteClicked: true,
        idx: responsesRouteData.idx,
        id: responsesRouteData.id
      }

      setResponsesRouteData(newRouteData);
    }

  }

  let routes = props.isAuthenticated ? (
    <Switch>
      <Route path='/' exact >
        <NewPaper {...this.props} />
      </Route>
      <Route path='/newPaper' exact >
        <NewPaper {...this.props} />
      </Route>
      <Route path='/response' exact>
        <PaperResponses />
      </Route>
      <Route path='/yourPapers' exact>
        <YourPapers updateQuestionRouteData={() => updateQuestionRouteDataHandler(questionRouteData)} updateResponsesRouteData={() => updateResponsesRouteDataHandler(responsesRouteData)} {...props} />
      </Route>
      <Route path='/submittedResponses' >
        <SubmittedResponses />
      </Route>
      {<Route exact path={'/papers/:qid'}>
        <QuestionPaper {...props} />
      </Route>}
      {responsesRouteData.isRouteClicked ? <Route exact path={'/yourPapers/' + responsesRouteData.idx + '/responses'}>
        <PaperResponses qkey={responsesRouteData.id} />
      </Route> : null}
      <Route path='/profile' exact>
        <Profile />
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  ) :
    <Switch>
      <Route path='/login' exact>
        <AuthForm />
      </Route>
      <Route path={'*'} component={() => <Redirect to={{
        pathname: "/login",
        state: { prevPath: location.pathname }
      }} />} />
    </Switch>

  return (
    <div>
      {props.isAuthenticated ? <Toolbar initialToolbar={true} {...props} /> : null}
      {routes}

    </div >
  );
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    isAuthValid: () => dispatch(actions.checkAuthState())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

