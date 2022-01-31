import React,{Component} from "react";
import SingleChoiceQuestion from "../QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import axios from '../../axios';
import classes from './QuestionPaper.css';
import EssentialFeildForm from "../EssentialFeildForm/EssentialFeildForm";

class QuestionPaper extends Component{
    
    state = {
        questionData: {
        },
        essentialFeilds:{
            answer:[]
        },
        questionArr: []
    }
    componentDidMount(){
        // console.log("Hello");
        axios.get("/questionPapers/"+this.props.qkey+'.json').then(response => response.data?this.setState({
            essentialFeilds: response.data.essentialFeilds,
            questionArr: response.data.questionArr
        }):null)
        axios.get("/questionPapers/"+this.props.qkey+'.json').then(response => response.data?console.log(response.data):null);
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
            essentialFeilds: this.state.essentialFeilds,
            questionArr: this.state.questionArr
        }
            axios.post('/questionPapers/'+this.props.qkey+'/responses.json',questionPaperResponse).then(
                response => console.log(response)).catch(error => console.log(error));
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

export default QuestionPaper;