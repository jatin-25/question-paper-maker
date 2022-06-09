import React, { Component } from "react";
import SingleChoiceQuestion from "../../Components/QuestionTypes/SingleChoiceQuestion/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../Components/QuestionTypes/MultipleChoiceQuestion/MultipleChoiceQuestion";
import ParagraphQuestion from "../../Components/QuestionTypes/ParagraphQuestion/ParagraphQuestion";
import axios from '../../axios';
import './QuestionPaper.css';
import EssentialFeildForm from "../../Components/EssentialFeildForm/EssentialFeildForm";
import { connect } from "react-redux";
import { v4 as uuid } from 'uuid';
import * as actions from '../../Store/Actions/index';
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
import swal from "sweetalert";
class QuestionPaper extends Component {

    state = {
        title: "",
        qkey: this.props.location.pathname.slice(8),
        isSubmitted: "Not Known",
        essentialFeilds: {
            answer: []
        },
        questionArr: []
    }
    componentDidMount() {
        this.props.setLoading(true);
        const qkey = this.props.location.pathname.slice(8);
        const queryParams = `?auth=${this.props.token}`;
        axios.get("/users/" + this.props.userKey + "/submittedResponses.json" + queryParams).then(
            response => {
                if (response.data) {
                    const queryParams3 = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${qkey}"`;
                    axios.get("/users/" + this.props.userKey + "/submittedResponses.json" + queryParams3).then(response => {
                        if (Object.values(response.data).length === 0) {
                            const queryParams2 = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${qkey}"`
                            axios.get("/questionPapers.json" + queryParams2).then(response => {

                                const questionPaper = Object.values(response.data);

                                response.data && this.setState({
                                    title: questionPaper[0].title,
                                    essentialFeilds: questionPaper[0].essentialFeilds,
                                    questionArr: questionPaper[0].questionArr,
                                    isSubmitted: false
                                })

                                this.props.setLoading(false);
                            }).catch(error => {
                                this.props.setLoading(false);
                            })
                        }
                        else {
                            this.setState({ isSubmitted: true });
                            this.props.setLoading(false);
                        }
                    }).catch(error => {
                        this.props.setLoading(false);
                    })
                }
                else {
                    const queryParams2 = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${qkey}"`
                    axios.get("/questionPapers.json" + queryParams2).then(response => {

                        const questionPaper = Object.values(response.data);
                        response.data && this.setState({
                            title: questionPaper[0].title,
                            essentialFeilds: questionPaper[0].essentialFeilds,
                            questionArr: questionPaper[0].questionArr,
                            isSubmitted: false
                        })

                        this.props.setLoading(false);
                    }).catch(error => {
                        this.props.setLoading(false);
                    })
                }


            }).catch(error => this.props.setLoading(false));

    }

    updateAnswerHandler = (answerObject) => {
        let oldQuestionData = this.state.questionArr[answerObject.index];
        oldQuestionData.answer = answerObject.answer;
        let newQuestionArr = [...this.state.questionArr];
        newQuestionArr.splice(answerObject.index, 1, oldQuestionData);
        this.setState({ questionArr: newQuestionArr });
    }

    updateEssentialFeildAnswerHandler = (answer) => {
        if (answer !== undefined && answer) {
            let essentialFeild = { ...this.state.essentialFeilds, answer: [] }
            essentialFeild.answer = answer;
            this.setState({ essentialFeilds: essentialFeild });
        }
    }

    submitQuestionPaperHandler = () => {
        if (this.onSubmitHandler()) {
            swal({
                title: "Are you sure?",
                text: "You want to submit your Paper!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willSubmit) => {
                if (willSubmit) {
                    const questionPaperResponse = {
                        responseId: uuid(),
                        paperId: this.state.qkey,
                        essentialFeilds: this.state.essentialFeilds,
                        questionArr: this.state.questionArr
                    }

                    axios.post('/responses.json?auth=' + this.props.token, questionPaperResponse).then(
                        response => {
                            const currentResponseId = {
                                responseId: questionPaperResponse.responseId,
                                paperId: this.state.qkey,
                                paperTitle: this.state.title
                            };
                            axios.post("/users/" + this.props.userKey + "/submittedResponses.json?auth=" + this.props.token, currentResponseId).then(response => {
                            }).catch(error => {
                            });
                        }).catch(error => {

                        });
                    this.setState({ isSubmitted: true })
                }
            })

        }
        else {
            swal("Warning", "Essential Feilds can't be Empty!", "warning");
        }
    }

    onSubmitHandler = () => {
        if (this.state.essentialFeilds.answer) {
            const answers = this.state.essentialFeilds.answer;
            let isFormInvalid = false;
            for (let i = 0; i < answers.length; ++i) {
                if (answers[i] === undefined || answers[i] === null || answers[i] === "") {
                    isFormInvalid = true;
                    break;
                }
            }
            if (isFormInvalid) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }

    }
    render() {

        let essentialFeildInputForm = null;
        if (Object.keys(this.state.essentialFeilds).indexOf('title') !== -1) {
            essentialFeildInputForm = <EssentialFeildForm essentialFeilds={this.state.essentialFeilds.title} updateAnswer={this.updateEssentialFeildAnswerHandler} />
        }

        let questionsComponent = null;
        questionsComponent = this.state.questionArr.map((question, i) => {
            let questionComp = null;
            switch (question.type) {
                case "SingleChoiceQuestion":
                    questionComp = <SingleChoiceQuestion optionsList={this.state.questionArr[i].optionsList} question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateAnswerHandler} questionNo={i + 1} pageOnWhichRendered="questionPaper" />
                    break;

                case "MultipleChoiceQuestion":
                    questionComp = <MultipleChoiceQuestion optionsList={this.state.questionArr[i].optionsList} question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateAnswerHandler} questionNo={i + 1} pageOnWhichRendered="questionPaper" />
                    break;

                case "ParagraphQuestion":
                    questionComp = <ParagraphQuestion question={this.state.questionArr[i].question} key={i} qkey={i} updateAnswer={this.updateAnswerHandler} questionNo={i + 1} pageOnWhichRendered="questionPaper" />
                    break;
                default:
                    break;
            }
            return questionComp;
        })


        return (
            <BackDrop isLoading={this.props.loading}>
                {this.state.isSubmitted === true ? <div className="noPapers"><p>Your response has been submitted.</p></div> : null}
                {this.state.isSubmitted !== null && this.state.isSubmitted === false ? <div className="QuestionPaperArea">
                    {essentialFeildInputForm}
                    <div className={["QuestionPaper", "LightBlue"].join(" ")}>
                        {questionsComponent}
                    </div>
                    <div className="BtnArea">
                        <button onClick={this.submitQuestionPaperHandler} className="Button">Submit</button>
                    </div>
                </div> : null}
            </BackDrop>
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
export default connect(mapStateToProps, mapDispatchToProps)(QuestionPaper);