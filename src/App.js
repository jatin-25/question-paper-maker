import React, { Component } from 'react';
import './App.css';
import NewPaper from './Components/NewPaper/NewPaper';
import {Route,BrowserRouter as Routers,Switch} from 'react-router-dom';
import Responses from './Components/Responses/Responses';
import Toolbar from './Components/Navigation/Toolbar/Toolbar';
import YourPapers from './Components/YourPapers/YourPapers';
import QuestionPaper from './Components/QuestionPaper/QuestionPaper';

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
  

  render() {
    return (
      <Routers>
      <div>
          <Toolbar initialToolbar = {true}/>
    
          <Switch>

          <Route path='/' exact component={NewPaper}/>
          <Route path='/newPaper' exact component={NewPaper}/>
          <Route path='/response' exact component={Responses}/>
          <Route path='/yourPapers' exact>
            <YourPapers updateQuestionRouteData = {this.updateQuestionRouteDataHandler} updateResponsesRouteData = {this.updateResponsesRouteDataHandler}/>
          </Route>
          {this.state.questionRouteData.isRouteClicked?<Route exact path={'/yourPapers/'+this.state.questionRouteData.idx}> 
          <QuestionPaper qkey = {this.state.questionRouteData.id}/>
          </Route>:null}
          {this.state.responsesRouteData.isRouteClicked?<Route exact path={'/yourPapers/'+this.state.responsesRouteData.idx+'/responses'}>
          <Responses qkey = {this.state.responsesRouteData.id}/>
          </Route>:null}
          </Switch>
      </div>
      </Routers>
    );
  }
}

export default App;
