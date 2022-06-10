import React, { Component } from "react";
import SingleChoiceQuestionForm from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceInputForm";
import SingleChoiceQuestion from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import MultipleChoiceQuestionForm from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceInputForm";
import ParagraphQuestionForm from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestionInputForm";
import './NewPaper.css';
import Modal from "../../Components/hoc/QuestionPopUp/Modal";
import axios from '../../axios';
import { connect } from "react-redux";
import { v4 as uuid } from 'uuid';
import { withRouter } from "react-router-dom";
import Collapse from '@kunukn/react-collapse';
import swal from 'sweetalert';
import * as actions from '../../Store/Actions/index';


class NewPaper extends Component {

    state = {
        title: "",
        essentialFeilds: {
            title: ['Name', 'Roll No.', 'Email Id'],
            answer: []
        },
        questionArr: [],
        singleChoiceClicked: false,
        multipleChoiceClicked: false,
        paragraphClicked: false,
        editData: {
            type: "",
            clicked: false,
            idx: null
        },
        isToggleShown: false,
        isPaperReady: false,
        isPaperSubmitted: false,
        addQuestion: false
    }

    updateQuestionArr = (questionObject) => {
        if (questionObject) {
            let newQuestionsList = [...this.state.questionArr, questionObject];
            this.setState({ questionArr: newQuestionsList });
            if (this.state.questionArr.length === 0) {
                this.setState({ isPaperReady: true });
            }
        }

        this.setState({ singleChoiceClicked: false, multipleChoiceClicked: false, paragraphClicked: false })
    }

    showSingleChoiceInputForm = () => {
        if (this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked) {
            swal("Warning", "There is already one question form opened!", "warning");
        }
        else
            this.setState({ singleChoiceClicked: true });
    }


    showMultipleChoiceInputForm = () => {
        if (this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked) {
            swal("Warning", "There is already one question form opened!", "warning");
        }
        else
            this.setState({ multipleChoiceClicked: true });
    }


    showParagraphInputForm = () => {
        if (this.state.singleChoiceClicked || this.state.multipleChoiceClicked || this.state.paragraphClicked) {
            swal("Warning", "There is already one question form opened!", "warning");
        }
        else
            this.setState({ paragraphClicked: true });
    }

    submitQuestionPaperHandler = () => {
        if (this.state.title === "") {
            swal("Warning", "Title can't be Empty!", "warning");
        }
        else {
            swal({
                title: "Are you sure?",
                text: "You want to create your Paper!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willCreate) => {
                if (willCreate) {
                    this.props.setLoading(true);
                    const questionPaper = {
                        paperId: uuid(),
                        title: this.state.title,
                        essentialFeilds: this.state.essentialFeilds,
                        questionArr: this.state.questionArr
                    }

                    axios.post('/questionPapers.json?auth=' + this.props.token, questionPaper).then(response => {
                        const currentPaperId = {
                            paperId: questionPaper.paperId,
                            paperTitle: this.state.title
                        };
                        axios.post("/users/" + this.props.userKey + "/createdPapers.json?auth=" + this.props.token, currentPaperId).then(response => {
                            console.log(response)
                            this.setState({ isPaperSubmitted: true })
                            this.props.setLoading(false);
                        }).catch(error => {
                            this.props.setLoading(false);
                        })
                    }).catch(error => {
                        this.props.setLoading(false);
                    });
                    swal("Congratulations, Your Paper has been created.", {
                        icon: "success",
                        buttons: {
                            stay: "Stay Here",
                            catch: {
                                text: "Move to Your Papers",
                                value: "move"
                            }
                        }
                    }).then(value => {
                        switch (value) {
                            case "stay":
                                break;
                            case "move":
                                this.props.history.push("/yourPapers");
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        }
    }


    onEditButtonClickedHandler = (editDataObject) => {
        if (this.state.editData.clicked) {
            swal("Warning", "There is already one question form opened!", "warning");
        }
        else {
            const newEditData = {
                type: editDataObject.type,
                clicked: true,
                idx: editDataObject.idx
            }
            this.setState({ editData: newEditData });
        }
    }

    onRemoveButtonClickedHandler = (index) => {
        let questionArr = [...this.state.questionArr];
        questionArr.splice(index, 1);
        if (questionArr.length === 0) {
            this.setState({ isPaperReady: false })
        }
        this.setState({ questionArr: questionArr });
    }
    updateQuestionOnEdit = (questionObject) => {
        const newEditData = {
            clicked: false,
            idx: null
        }
        if (questionObject) {
            let newQuestionArr = [...this.state.questionArr];
            newQuestionArr.splice(questionObject.index, 1, questionObject.question);
            this.setState({ questionArr: newQuestionArr });
        }
        this.setState({ editData: newEditData });
    }

    invertToggle = () => {
        this.setState({ isToggleShown: !this.state.isToggleShown });
    }

    onChangeTitleHandler = (e) => {
        this.setState({ title: e.target.value });
    }

    render() {
        let questionsComponent = null;
        questionsComponent = this.state.questionArr.map((question, i) => {
            let questionComp = null;
            switch (question.type) {
                case "SingleChoiceQuestion":
                    questionComp = <SingleChoiceQuestion optionsList={this.state.questionArr[i].optionsList} question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateSingleChoiceAnswerHandler} onEditHandler={this.onEditButtonClickedHandler} onRemoveHandler={this.onRemoveButtonClickedHandler} pageOnWhichRendered="newPaper" />
                    break;

                case "MultipleChoiceQuestion":
                    questionComp = <MultipleChoiceQuestion optionsList={this.state.questionArr[i].optionsList} question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateMultipleChoiceAnswerHandler} onEditHandler={this.onEditButtonClickedHandler} onRemoveHandler={this.onRemoveButtonClickedHandler} pageOnWhichRendered="newPaper" />
                    break;

                case "ParagraphQuestion":
                    questionComp = <ParagraphQuestion question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateParagraphAnswerHandler} onEditHandler={this.onEditButtonClickedHandler} onRemoveHandler={this.onRemoveButtonClickedHandler} pageOnWhichRendered="newPaper" />
                    break;
                default:
                    break;
            }
            return questionComp;
        })


        let singleChoiceQuestionForm = null;
        if (this.state.singleChoiceClicked) {
            singleChoiceQuestionForm = <SingleChoiceQuestionForm questionDataPass={this.updateQuestionArr} edit={false} />;
        }

        let multipleChoiceQuestionForm = null;
        if (this.state.multipleChoiceClicked) {
            multipleChoiceQuestionForm = <MultipleChoiceQuestionForm questionDataPass={this.updateQuestionArr} edit={false} />;
        }

        let paragraphQuestionForm = null;
        if (this.state.paragraphClicked) {
            paragraphQuestionForm = <ParagraphQuestionForm questionDataPass={this.updateQuestionArr} edit={false} />;
        }

        let singleChoiceEditForm = null;
        if (this.state.editData.clicked && this.state.editData.type === "SingleChoiceQuestion") {
            let optionsString = null;
            let tempOptionsString = this.state.questionArr[this.state.editData.idx].optionsList.join(",");
            optionsString = tempOptionsString.substring(0, tempOptionsString.length);
            singleChoiceEditForm = <SingleChoiceQuestionForm optionsList={this.state.questionArr[this.state.editData.idx].optionsList} question={this.state.questionArr[this.state.editData.idx].question} edit={this.state.editData.clicked} updateSCQOnEdit={this.updateQuestionOnEdit} qkey={this.state.editData.idx} optionsStr={optionsString} />
        }
        let multipleChoiceEditForm = null;
        if (this.state.editData.clicked && this.state.editData.type === "MultipleChoiceQuestion") {
            let optionsString = null;
            let tempOptionsString = this.state.questionArr[this.state.editData.idx].optionsList.join(",");
            optionsString = tempOptionsString.substring(0, tempOptionsString.length);
            multipleChoiceEditForm = <MultipleChoiceQuestionForm optionsList={this.state.questionArr[this.state.editData.idx].optionsList} question={this.state.questionArr[this.state.editData.idx].question} edit={this.state.editData.clicked} updateMCQOnEdit={this.updateQuestionOnEdit} qkey={this.state.editData.idx} optionsStr={optionsString} />
        }
        let paragraphEditForm = null;
        if (this.state.editData.clicked && this.state.editData.type === "ParagraphQuestion") {
            paragraphEditForm = <ParagraphQuestionForm question={this.state.questionArr[this.state.editData.idx].question} edit={this.state.editData.clicked} updatePQOnEdit={this.updateQuestionOnEdit} qkey={this.state.editData.idx} />
        }

        let paperTitle = this.state.isPaperReady ? <div className="PaperTitle">
            <p>Paper Title</p>
            <input type='text' onChange={(e) => this.onChangeTitleHandler(e)}></input>
        </div> : null;

        let addQuestionTypes = null;
        addQuestionTypes = <div className="AddButton" onClick={() => this.setState({ addQuestion: !this.state.addQuestion })}>
            {/* <img src={add} alt="Add Question"/> */}
            <span>Add Question</span>
            <Collapse isOpen={this.state.addQuestion} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className="AddQuestionContent">
                <div className="QuestionTypesContent">
                    <ul>
                        <li onClick={this.showSingleChoiceInputForm}>Single Choice Question</li>
                        <li onClick={this.showMultipleChoiceInputForm}>Multiple Choice Question</li>
                        <li onClick={this.showParagraphInputForm}>Paragraph Question</li>
                    </ul>
                </div>
            </Collapse>
        </div>
        return (
            <div className="QuestionArea">
                {paperTitle}
                <Modal show={this.state.singleChoiceClicked}>
                    {singleChoiceQuestionForm}
                </Modal>
                <Modal show={this.state.multipleChoiceClicked}>
                    {multipleChoiceQuestionForm}
                </Modal>
                <Modal show={this.state.paragraphClicked}>
                    {paragraphQuestionForm}
                </Modal>
                <Modal show={this.state.editData.clicked && this.state.editData.type === "SingleChoiceQuestion"}>
                    {singleChoiceEditForm}
                </Modal>
                <Modal show={this.state.editData.clicked && this.state.editData.type === "MultipleChoiceQuestion"}>
                    {multipleChoiceEditForm}
                </Modal>
                <Modal show={this.state.editData.clicked && this.state.editData.type === "ParagraphQuestion"}>
                    {paragraphEditForm}
                </Modal>

                {this.state.isPaperReady ? <div className="NewQuestionPaper">
                    {questionsComponent}
                </div> : null}
                {addQuestionTypes}
                <div className="BtnAreaPaper">
                    <button onClick={() => this.submitQuestionPaperHandler()} className="Button" style={{ display: this.state.isPaperReady ? "inline" : "none" }}>Submit</button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userKey: state.auth.userKey,
        loading: state.auth.loading
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPaper));