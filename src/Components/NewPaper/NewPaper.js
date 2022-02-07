import React,{Component} from "react";
import SingleChoiceQuestionForm from "../QuestionTypes/SingleChoiceQuestion/SingleChoiceInputForm";
import SingleChoiceQuestion from "../QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import MultipleChoiceQuestionForm from "../QuestionTypes/MultipleChoiceQuestion/MultipleChoiceInputForm";
import ParagraphQuestionForm from "../QuestionTypes/ParagraphQuestion/ParagraphQuestionInputForm";
import classes from './NewPaper.css'
import Modal from "../hoc/QuestionPopUp/Modal";
import axios from '../../axios';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import { connect } from "react-redux";
import {v4 as uuid} from 'uuid';
import {Redirect} from "react-router-dom";
import add from '../../assets/plus-circle.svg';

class NewPaper extends Component{

    state = {
        title: "",
        essentialFeilds: {
            title: ['Name','Roll No.','Email Id'],
            answer: []
        },
        questionArr: [],
        singleChoiceClicked:false,
        multipleChoiceClicked:false,
        paragraphClicked:false,
        editData: {
            type: "",
            clicked: false,
            idx:null
        },
        isToggleShown: false,
        isPaperReady: false,
        isPaperSubmitted: false
    }

    updateQuestionArr = (questionObject) => {
        // console.log(questionObject);
        if(questionObject){
            let newQuestionsList = [...this.state.questionArr,questionObject];
            this.setState({questionArr:newQuestionsList});
            console.log(newQuestionsList);
            if(this.state.questionArr.length === 0){
                this.setState({isPaperReady: true});
            }
        }

        this.setState({singleChoiceClicked: false,multipleChoiceClicked: false,paragraphClicked: false})
    }

    showSingleChoiceInputForm = () => {
        if(this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked){
            alert("There is already one question form opened!");
        }
        else
        this.setState({singleChoiceClicked:true});
    }


    showMultipleChoiceInputForm = () => {
        if(this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked){
            alert("There is already one question form opened!");
        }
        else
        this.setState({multipleChoiceClicked:true});
    }


    showParagraphInputForm = () => {
        if(this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked){
            alert("There is already one question form opened!");
        }
        else
        this.setState({paragraphClicked:true});
    }

    submitQuestionPaperHandler = () => {
        if(this.state.title === ""){
            alert("Title can't be Empty.")
        }
        else{
            const questionPaper =  {
                paperId: uuid(),
                title: this.state.title,
                essentialFeilds: this.state.essentialFeilds,
                questionArr: this.state.questionArr
            }

            axios.post('/questionPapers.json?auth='+this.props.token,questionPaper).then(
            response => {
                console.log(response);
                const currentPaperId = {
                    paperId: questionPaper.paperId,
                    paperTitle: this.state.title
                };
            axios.post("/users/"+localStorage.getItem("userKey")+"/createdPapers.json?auth="+this.props.token,currentPaperId).then(response => {
                console.log(response);
                this.setState({isPaperSubmitted: true})
            }).catch(error => console.log(error));
            }).catch(error => console.log(error));
            
        }
    }


    onEditButtonClickedHandler = (editDataObject) => {
        if(this.state.editData.clicked){
            alert("There is already one question form opened!");
        }
        else{
            const newEditData = {
                type: editDataObject.type,
                clicked: true,
                idx: editDataObject.idx
            }
            this.setState({editData: newEditData});
        }
    }
    
    updateQuestionOnEdit = (questionObject) => {
        const newEditData = {
            clicked: false,
            idx: null
        }
        if(questionObject){
            let newQuestionArr = [...this.state.questionArr];
            newQuestionArr.splice(questionObject.index,1,questionObject.question);
            this.setState({questionArr:newQuestionArr});
        }
        this.setState({editData: newEditData});
    }
    
    invertToggle = () => {
        this.setState({isToggleShown: !this.state.isToggleShown});
    }

    onChangeTitleHandler = (e) => {
        this.setState({title: e.target.value});
    }

    onHoverHandler = () => {
        this.setState({ isHovered: true });
    }
    onHoverLeaveHandler = () => {
        this.setState({ isHovered: false });
    }
    render(){
        let questionsComponent = null;
        questionsComponent =  this.state.questionArr.map( ( question, i) => {
            let questionComp = null;
            switch(question.type){
                case "SingleChoiceQuestion":
                questionComp = <SingleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} key={i} qkey = {i} updateAnswer = {this.updateSingleChoiceAnswerHandler} editButtonHandler = {this.onEditButtonClickedHandler} pageOnWhichRendered = "newPaper"/>
                break;

                case "MultipleChoiceQuestion":
                    questionComp = <MultipleChoiceQuestion optionsList = {this.state.questionArr[i].optionsList} question = {this.state.questionArr[i].question} key={i} qkey = {i} updateAnswer = {this.updateMultipleChoiceAnswerHandler} editButtonHandler = {this.onEditButtonClickedHandler} pageOnWhichRendered = "newPaper"/>
                    break;

                case "ParagraphQuestion":
                    questionComp = <ParagraphQuestion question = {this.state.questionArr[i].question} key={i} qkey = {i}  updateAnswer = {this.updateParagraphAnswerHandler} editButtonHandler = {this.onEditButtonClickedHandler} pageOnWhichRendered = "newPaper"/>
                    break;
                default:
                    break;
            }
            return questionComp;
        })


        let singleChoiceQuestionForm = null;
        if(this.state.singleChoiceClicked){
            singleChoiceQuestionForm = <SingleChoiceQuestionForm questionDataPass = {this.updateQuestionArr} edit = {false}/>;
        }

        let multipleChoiceQuestionForm = null;
        if(this.state.multipleChoiceClicked){
            multipleChoiceQuestionForm = <MultipleChoiceQuestionForm questionDataPass = {this.updateQuestionArr} edit = {false}/>;
        }

        let paragraphQuestionForm = null;
        if(this.state.paragraphClicked){
            paragraphQuestionForm = <ParagraphQuestionForm questionDataPass = {this.updateQuestionArr} edit = {false}/>;
        }

        let singleChoiceEditForm = null;

        if(this.state.editData.clicked && this.state.editData.type === "SingleChoiceQuestion"){
            let optionsString = null;
            let tempOptionsString = this.state.questionArr[this.state.editData.idx].optionsList.join(",");
            optionsString = tempOptionsString.substring(0,tempOptionsString.length);
            singleChoiceEditForm = <SingleChoiceQuestionForm optionsList = {this.state.questionArr[this.state.editData.idx].optionsList} question = {this.state.questionArr[this.state.editData.idx].question} edit = {this.state.editData.clicked} updateSCQOnEdit = {this.updateQuestionOnEdit} qkey = {this.state.editData.idx} optionsStr = {optionsString}/>
        }
        let multipleChoiceEditForm = null;
        if(this.state.editData.clicked && this.state.editData.type === "MultipleChoiceQuestion"){
            let optionsString = null;
            let tempOptionsString = this.state.questionArr[this.state.editData.idx].optionsList.join(",");
            optionsString = tempOptionsString.substring(0,tempOptionsString.length);
            multipleChoiceEditForm = <MultipleChoiceQuestionForm optionsList = {this.state.questionArr[this.state.editData.idx].optionsList} question = {this.state.questionArr[this.state.editData.idx].question} edit = {this.state.editData.clicked} updateMCQOnEdit = {this.updateQuestionOnEdit} qkey = {this.state.editData.idx} optionsStr = {optionsString}/>
        }
        let paragraphEditForm = null;
        if(this.state.editData.clicked && this.state.editData.type === "ParagraphQuestion"){
            paragraphEditForm = <ParagraphQuestionForm question = {this.state.questionArr[this.state.editData.idx].question} edit = {this.state.editData.clicked}  updatePQOnEdit = {this.updateQuestionOnEdit} qkey = {this.state.editData.idx}/>
        }
        // let essentialFeildInputForm = this.state.isPaperReady?<EssentialFeildForm essentialFeilds = {this.state.essentialFeilds.title} updateAnswer = {this.updateEssentialFeildAnswerHandler}/>:null
        let paperTitle = this.state.isPaperReady?<div className={classes.Title}>
            <p>Paper Title</p>
            <input type='text' onChange={(e) => this.onChangeTitleHandler(e)}></input>
        </div> : null;
        
        let addQuestionTypes = null;
        addQuestionTypes = <div className={classes.AddQuestion} onMouseEnter={this.onHoverHandler} onMouseLeave={this.onHoverLeaveHandler}>
            <img src={add} alt="Add Question" />
            <span>Add Question</span>
            <div className={classes.QuestionTypes} style={{ transform: this.state.isHovered ? "translateY(0)" : "translateY(10vh)", opacity: this.state.isHovered ? "1" : "0" }} onMouseEnter={this.onHoverHandler} onMouseLeave={this.onHoverLeaveHandler}>
                <ul>
                    <li onClick={this.showSingleChoiceInputForm}>Single Choice Question</li>
                    <li onClick={this.showMultipleChoiceInputForm}>Multiple Choice Question</li>
                    <li onClick={this.showParagraphInputForm}>Paragraph Question</li>
                </ul>
            </div>
        </div>
        return (
            <div className={classes.QuestionArea}>
                <Toolbar clicked = {this.invertToggle} clickFunctions = {{scq: this.showSingleChoiceInputForm,mcq: this.showMultipleChoiceInputForm,pq: this.showParagraphInputForm}} initialToolbar = {false}></Toolbar>
                {/* {essentialFeildInputForm} */}
                {paperTitle}
                <div className={[classes.QuestionPaper,this.state.isPaperReady?classes.LightBlue:classes.DarkBlue].join(" ")}>
                <Modal show = {this.state.singleChoiceClicked}>
                    {singleChoiceQuestionForm}
                </Modal>
                <Modal show = {this.state.multipleChoiceClicked}>
                    {multipleChoiceQuestionForm}
                </Modal>
                <Modal show = {this.state.paragraphClicked}>
                    {paragraphQuestionForm}
                </Modal>
                <Modal show = {this.state.editData.clicked && this.state.editData.type === "SingleChoiceQuestion"}>
                    {singleChoiceEditForm}
                </Modal>
                <Modal show = {this.state.editData.clicked && this.state.editData.type === "MultipleChoiceQuestion"}>
                    {multipleChoiceEditForm}
                </Modal>
                <Modal show = {this.state.editData.clicked && this.state.editData.type === "ParagraphQuestion"}>
                    {paragraphEditForm}
                </Modal>
                
                {questionsComponent}
                </div>
                {/* {addQuestionTypes} */}
            <div className={classes.BtnArea}>
                <button onClick={() => this.submitQuestionPaperHandler()} className={classes.Button} style={{display: this.state.isPaperReady?"inline": "none"}}>Submit</button>
            </div>
            {this.state.isPaperSubmitted && <Redirect to='/yourPapers'/>}
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
export default connect(mapStateToProps)(NewPaper);