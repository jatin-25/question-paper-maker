import React, { Component } from 'react';
import './App.css';
import NewPaper from './Components/NewPaper/NewPaper';
import {Route,BrowserRouter as Routers,Switch,Redirect} from 'react-router-dom';
import Responses from './Components/Responses/Responses';
import Toolbar from './Components/Navigation/Toolbar/Toolbar';
import YourPapers from './Components/YourPapers/YourPapers';
import QuestionPaper from './Components/QuestionPaper/QuestionPaper';
import * as actions from './Store/Actions/index';
import {connect} from 'react-redux';
import Profile from './Components/Profile/Profile';
import SubmittedResponses from './Components/Responses/SubmittedResponses/SubmittedResponses';
import AuthForm from './Components/Authentication/AuthForm';


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
    console.log(this.props.isAuthenticated);
    if(this.props.isAuthenticated){
      routes = <Switch>
        <Route path='/' exact >
            <NewPaper />
          </Route>
          <Route path='/newPaper' exact component={NewPaper}/>
          <Route path='/response' exact component={Responses}/>
          <Route path='/yourPapers' exact>
            <YourPapers updateQuestionRouteData = {this.updateQuestionRouteDataHandler} updateResponsesRouteData = {this.updateResponsesRouteDataHandler}/>
          </Route>
          <Route path='/submittedResponses' component={SubmittedResponses}/>
          {this.state.questionRouteData.isRouteClicked?<Route exact path={'/yourPapers/'+this.state.questionRouteData.idx}>
          <QuestionPaper qkey = {this.state.questionRouteData.id}/>
          </Route>:null}
          {this.state.responsesRouteData.isRouteClicked?<Route exact path={'/yourPapers/'+this.state.responsesRouteData.idx+'/responses'}>
          <Responses qkey = {this.state.responsesRouteData.id}/>
          </Route>:null}
          <Route path='/profile' component={Profile}/>
          <Redirect to='/newPaper'/>
      </Switch>
    }
    else{
      routes = <Switch>
        <Route path='/auth' exact component={AuthForm}/>
        <Redirect to='/auth' />
      </Switch>
    }
    return (
      <Routers>
      <div>
          {this.props.isAuthenticated?<Toolbar initialToolbar = {true}/>:null}

          {/* <Switch>

          
          {this.props.isAuthenticated?<Redirect to='/'/>:<Route path='/auth' exact component={AuthForm}/>}

          </Switch> */}
          {routes}
          {/* <AuthForm /> */}
      </div>
      </Routers>
    );
  }
}

const mapStateToProps = state => {
  return {
      isAuthenticated: state.auth.token != null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    isAuthValid: () => dispatch(actions.checkAuthState())
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
