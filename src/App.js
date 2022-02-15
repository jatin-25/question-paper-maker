import React, { Component } from 'react';
import './App.css';
import NewPaper from './Components/NewPaper/NewPaper';
import { Route, Switch,withRouter } from 'react-router-dom';
// import { browserHistory } from 'react-router';
// import { hashHistory } from 'react-router';
import Responses from './Components/Responses/Responses';
import Toolbar from './Components/Navigation/Toolbar/Toolbar';
import YourPapers from './Components/YourPapers/YourPapers';
import QuestionPaper from './Components/QuestionPaper/QuestionPaper';
import * as actions from './Store/Actions/index';
import {connect} from 'react-redux';
import Profile from './Components/Profile/Profile';
import SubmittedResponses from './Components/Responses/SubmittedResponses/SubmittedResponses';
import AuthForm from './Components/Authentication/AuthForm';
import NotFound from './Components/NotFound/NotFound';

// import { createBrowserHistory } from 'history';
class App extends Component {

  state = {
    questionRouteData: {
      isRouteClicked: false,
      id: null
    },
    responsesRouteData: {
      isRouteClicked: false,
      id: null
    }
  }

  updateQuestionRouteDataHandler = (questionRouteData) => {
    if(questionRouteData){
      const newRouteData = {
        isRouteClicked: true,
        idx: questionRouteData.idx,
        id: questionRouteData.id
      }

      this.setState({questionRouteData: newRouteData});
    }
  }

  updateResponsesRouteDataHandler = (responsesRouteData) => {
    if(responsesRouteData){
      const newRouteData = {
        isRouteClicked: true,
        idx: responsesRouteData.idx,
        id: responsesRouteData.id
      }

      this.setState({responsesRouteData: newRouteData});
    }
    
  }
  
  componentDidMount = () => {
    this.props.isAuthValid();
  }
  render() {

    let routes = null;
    if(this.props.isAuthenticated){
      routes = <Switch>
        <Route path='/' exact >
          <NewPaper {...this.props} />
          </Route>
        <Route path='/newPaper' exact component={NewPaper} {...this.props}/>
        <Route path='/response' exact component={Responses}/>
          <Route path='/yourPapers' exact>
          <YourPapers updateQuestionRouteData={this.updateQuestionRouteDataHandler} updateResponsesRouteData={this.updateResponsesRouteDataHandler} {...this.props}/>
          </Route>
        <Route path='/submittedResponses' component={SubmittedResponses}/>
          {<Route exact path={'/papers/:qid'}>
          <QuestionPaper {...this.props} />
          </Route>}
          {this.state.responsesRouteData.isRouteClicked?<Route exact path={'/yourPapers/'+this.state.responsesRouteData.idx+'/responses'}>
          <Responses qkey = {this.state.responsesRouteData.id}/>
          </Route>:null}
          <Route path='/profile' exact component={Profile}/>
          <Route path='*' component={NotFound} />
      </Switch>
    }
    else{
      routes = <Switch>
        <Route path='/' exact >
          <AuthForm {...this.props} />
        </Route>
        
        <Route path='*' exact >
          <AuthForm {...this.props} />
        </Route>

      </Switch>
    }
    return (
      <div>
        {this.props.isAuthenticated ? <Toolbar initialToolbar={true} {...this.props}/>:null}
        
          {routes}
      
      </div>
    );
  }
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
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
