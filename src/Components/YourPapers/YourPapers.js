import React,{Component} from "react";
import { NavLink } from "react-router-dom";
import axios from '../../axios';
import classes from './YourPapers.css';


class YourPapers extends Component {
    state = {
        questionData: [],
        questionKeyArr: []
    }
        componentDidMount(){
            console.log("Hello");
            axios.get("/questionPapers.json").then(response => response.data?this.setState({questionData: Object.values(response.data),questionKeyArr: Object.keys(response.data)}):null);
            axios.get("/questionPapers.json").then(response => console.log(response.data));
        }

        showData = () => {
            console.log(this.state.questionData);
        }

        showQuestionHandler = (i) => {
            console.log(this.props);
            this.props.updateQuestionRouteData({idx: i,id:this.state.questionKeyArr[i]});
            // this.props.history.push('/yourPapers/'+i)
        }
        
        showResponsesHandler = (i) => {
            console.log("Entered");
            this.props.updateResponsesRouteData({idx: i,id:this.state.questionKeyArr[i]})
            // this.props.history.push('/yourPapers/'+i+'/responses');
        }
    render(){
        let essentialFeildTitles = null;
        if(this.state.questionData[0] !== undefined){
            essentialFeildTitles = <div className={classes.Title}>
                <span>Title</span>
                <span>Question Paper</span>
                <span>Responses</span>
            </div>
        }
        let questions = null;
        if(this.state.questionData.length > 0){
            questions = this.state.questionData.map((question,i) => {
                return (
                    <div key={i} className={classes.QuestionPapers}>

                        <span>{question.title}</span>

                        <NavLink to = {'/yourPapers/'+i} className={classes.Button} onClick={() => this.showQuestionHandler(i)}>View Question Paper</NavLink>

                        <NavLink to = {'/yourPapers/'+i+'/responses'} className={classes.Button} onClick={() => this.showResponsesHandler(i)}>View Responses</NavLink>
                    </div>
                );
            })
        }
        
        return(
            <div className={classes.Content}>
                {essentialFeildTitles}
                {questions}
            </div>  
        );
    }
}

export default YourPapers;