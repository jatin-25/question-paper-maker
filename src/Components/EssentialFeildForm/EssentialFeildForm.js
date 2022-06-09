import React, { Component } from "react";
import './EssentialFeildForm.css';
import { connect } from "react-redux";
class EssentialFeildForm extends Component {

    state = {
        essentialFeilds: (this.props.essentialFeilds !== undefined) ? this.props.essentialFeilds : [],
        answers: (this.props.essentialFeilds !== undefined) ? Array(this.props.essentialFeilds.length) : []
    }


    onAnswerChangeHandler = (object) => {
        let answerArr = [...this.state.answers];
        if (answerArr.indexOf(this.props.email) === -1) {
            answerArr[2] = this.props.email;
        }
        answerArr[object.idx] = object.e.target.value;
        this.setState({ answers: answerArr }, () => this.props.updateAnswer(answerArr));
    }

    render() {

        let essentialFeildForm = this.state.essentialFeilds.map((feildTitle, i) => {
            return (
                <div key={i}>
                    <p>{feildTitle}</p>
                    {i === 2 ? <input type='text' minLength={1} defaultValue={this.props.email} readOnly></input> :
                        <input type='text' onChange={(e) => this.onAnswerChangeHandler({ e: e, idx: i })} minLength={1}></input>}
                </div>
            );
        })
        return (
            <div className="EssentialFeildForm">
                {essentialFeildForm}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.auth.email
    }
}
export default connect(mapStateToProps)(EssentialFeildForm);