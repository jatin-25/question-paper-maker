import React,{Component} from "react";
import SingleChoiceQuestion from "../QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import axios from '../../axios';
import classes from './QuestionPaper.css';
import EssentialFeildForm from "../EssentialFeildForm/EssentialFeildForm";
import { connect } from "react-redux";
import {v4 as uuid} from 'uuid';


class QuestionPaper extends Component{
    
    state = {
        title: "",
        essentialFeilds:{
            answer:[]
        },
        questionArr: []
    }
    componentDidMount(){
        // console.log("Hello");
        const queryParams = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${this.props.qkey}"`
        axios.get("/questionPapers.json"+queryParams).then(response => {

            const questionPaper = Object.values(response.data);
            console.log(questionPaper);

            response.data&&this.setState({
                title: questionPaper[0].title,
                essentialFeilds: questionPaper[0].essentialFeilds,
                questionArr: questionPaper[0].questionArr
        })
    })
        // axios.get("/questionPapers/"+this.props.qkey+'.json?auth='+this.props.token).then(response => response.data?console.log(response.data):null);

    }

    updateAnswerHandler = (answerObject) => {
        let oldQuestionData = this.state.questionArr[answerObject.index];
        oldQuestionData.answer = answerObject.answer;
        let newQuestionArr = [...this.state.questionArr];
        newQuestionArr.splice(answerObject.index,1,oldQuestionData);
        this.setState({questionArr:newQuestionArr});
        console.log(newQuestionArr);
    }
    
    updateEssentialFeildAnswerHandler = (answer) => {
        if(answer !== undefined && answer){
            let essentialFeild = {...this.state.essentialFeilds,answer:[]}
            essentialFeild.answer = answer;
            console.log(this.state.essentialFeilds)
            this.setState({essentialFeilds: essentialFeild});
        }
    }

    submitQuestionPaperHandler = () => {
        this.onSubmitHandler();
        if(this.onSubmitHandler()){
        const questionPaperResponse =  {
            responseId: uuid(),
            paperId: this.props.qkey,
            essentialFeilds: this.state.essentialFeilds,
            questionArr: this.state.questionArr
        }

        axios.post('/responses.json?auth='+this.props.token,questionPaperResponse).then(
            response => {
                console.log(response);
                const currentResponseId = {
                    responseId: questionPaperResponse.responseId,
                    paperTitle: this.state.title
                };
                axios.post("/users/"+localStorage.getItem("userKey")+"/submittedResponses.json?auth="+this.props.token,currentResponseId).then(response => {
                    console.log(response)
                }).catch(error => console.log(error));
            }).catch(error => console.log(error));
        }
        else{
            alert("Essential Feilds can't be Empty.");
        }
    }

    onSubmitHandler = () => {
        if(this.state.essentialFeilds.answer){
            const answers = this.state.essentialFeilds.answer;
            let isFormInvalid = false;
            for(let i = 0;i<answers.length;++i){
                if(answers[i] === undefined || answers[i] === null || answers[i] === ""){
                    console.log(i);
                    isFormInvalid = true;
                    break;
                }
            }
            if(isFormInvalid){
                return false;
            }
            return true;
        }
        else{
            console.log("out")
            return false;
        }
       
    }
    render(){

        let essentialFeildInputForm = null;
        console.log(this.state.essentialFeilds);
        if(Object.keys(this.state.essentialFeilds).indexOf('title') !== -1){
            essentialFeildInputForm = <EssentialFeildForm essentialFeilds = {this.state.essentialFeilds.title} updateAnswer = {this.updateEssentialFeildAnswerHandler}/>
        }

        let questionsComponent = null;
        questionsComponent =  this.state.questionArr.map( ( question, i) => {
            let questionComp = null;
            switch(question.type){
                case "SingleChoiceQuestion":
                questionComp = <SingleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} key={i} qkey = {i} updateAnswer = {this.updateAnswerHandler} questionNo = {i+1} pageOnWhichRendered = "questionPaper"/>
                break;

                case "MultipleChoiceQuestion":
                    questionComp = <MultipleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} key={i} qkey = {i} updateAnswer = {this.updateAnswerHandler} questionNo = {i+1} pageOnWhichRendered = "questionPaper"/>
                    break;

                case "ParagraphQuestion":
                    questionComp = <ParagraphQuestion question = {this.state.questionArr[i].question} key={i} qkey = {i}  updateAnswer = {this.updateAnswerHandler} questionNo = {i+1} pageOnWhichRendered = "questionPaper"/>
                    break;
                default:
                    break;
            }
            return questionComp;
        })


        return (
            <div className={classes.QuestionArea}>
                {console.log("Hello there")}
                {essentialFeildInputForm}
                <div className={[classes.QuestionPaper,classes.LightBlue].join(" ")}>
                {questionsComponent}
                
                </div>
                <div className={classes.BtnArea}>
                    <button onClick={this.submitQuestionPaperHandler} className={classes.Button}>Submit</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    }
}
export default connect(mapStateToProps)(QuestionPaper);