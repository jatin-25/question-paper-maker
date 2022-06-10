import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from '../../axios';
import './YourPapers.css';
import { connect } from "react-redux";
import * as actions from '../../Store/Actions/index';
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
import * as BiIcons from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import swal from 'sweetalert';

class YourPapers extends Component {
    state = {
        questionData: [],
        questionKeyArr: [],
        noPapers: false
    }

    componentDidMount() {
        this.props.setLoading(true);
        const queryParams = `?auth=${this.props.token}`;

        axios.get("/users/" + this.props.userKey + "/createdPapers.json" + queryParams).then(response => {
            if (response.data) {
                this.setState({ questionData: Object.values(response.data), questionKeyArr: Object.keys(response.data) })
            }
            else {
                this.setState({ noPapers: true });
            }
            this.props.setLoading(false);
        }).catch(error => {
            this.props.setLoading(false);
        })
    }

    showQuestionHandler = (i) => {
        this.props.updateQuestionRouteData({ idx: i, id: this.state.questionData[i].paperId });
    }

    showResponsesHandler = (i) => {
        this.props.updateResponsesRouteData({ idx: i, id: this.state.questionData[i].paperId })
    }
    linkCopied = () => {
        swal({
            title: "Congratulations!",
            text: "The link of your paper has been copied!",
            icon: "success",
            button: "Okay!",
        });
    }
    render() {
        let essentialFeildTitles = null;
        if (this.state.questionData[0] !== undefined) {
            essentialFeildTitles = <div className="YourPapersTitle">
                <span>Title</span>
                <span>Question Paper</span>
                <span>Responses</span>
            </div>
        }
        let questions = null;
        if (this.state.questionData.length > 0) {
            questions = this.state.questionData.map((question, i) => {
                return (
                    <div key={i} className="QuestionPapers">

                        <div className="SmallScreenPaperOptions">
                            <CopyToClipboard text={window.location.origin + "/papers/" + question.paperId}
                                onCopy={() => this.linkCopied()}>
                                <div className="TitleContainer">
                                    <span>{question.paperTitle}</span>
                                    <BiIcons.BiShareAlt />
                                </div>
                            </CopyToClipboard>
                            <NavLink to={{
                                pathname: '/papers/' + this.state.questionData[i].paperId,
                            }} className="YourPapersButton" onClick={() => this.showQuestionHandler(i)}>View</NavLink>

                            <NavLink to={'/yourPapers/' + i + '/responses'} className="YourPapersButton" onClick={() => this.showResponsesHandler(i)}>View</NavLink>
                        </div>
                        <div className="TabDesktopPaperOptions">
                            <CopyToClipboard text={window.location.origin + "/papers/" + question.paperId}
                                onCopy={() => this.linkCopied()}>
                                <div className="TitleContainer">
                                    <span>{question.paperTitle}</span>
                                    <BiIcons.BiShareAlt />
                                </div>
                            </CopyToClipboard>
                            <NavLink to={{
                                pathname: '/papers/' + this.state.questionData[i].paperId,
                            }} className="YourPapersButton" onClick={() => this.showQuestionHandler(i)}>View Paper</NavLink>

                            <NavLink to={'/yourPapers/' + i + '/responses'} className="YourPapersButton" onClick={() => this.showResponsesHandler(i)}>View Responses</NavLink>
                        </div>
                    </div>
                );
            })
        }

        return (
            <BackDrop isLoading={this.props.loading}>
                {this.state.noPapers ? <div className="noPapers"><p>You haven't created any papers yet.</p></div> :
                    <div className="YourPapersContent">
                        {essentialFeildTitles}
                        {questions}
                    </div>}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(YourPapers));