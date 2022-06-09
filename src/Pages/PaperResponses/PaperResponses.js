import React, { Component } from "react";
import './PaperResponses.css';
import Response from '../../Components/Response/Response';
import Collapse from '@kunukn/react-collapse';
import axios from '../../axios';
import { connect } from 'react-redux';
import Button from '../../Components/UI/Button/Button';
import * as actions from '../../Store/Actions/index';
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
class Responses extends Component {
    state = {
        responseData: [],
        isVisible: [],
        noResponse: false
    }

    componentDidMount() {
        this.props.setLoading(true);
        const queryParams = `?auth=${this.props.token}&orderBy="paperId"&equalTo="${this.props.qkey}"`;
        axios.get('/responses.json' + queryParams).then(response => {

            if (Object.values(response.data).length !== 0) {
                this.setState({
                    responseData: Object.values(response.data),
                    isVisible: Array(Object.values(response.data).length).fill(false)
                })
            }
            else {
                this.setState({ noResponse: true });
            }
            this.props.setLoading(false);
        }).catch(error => {
            this.props.setLoading(false);
        })
    }

    showResponseHandler = (i) => {
        let newIsVisible = [...this.state.isVisible];
        newIsVisible[i] = !newIsVisible[i];
        this.setState({ isVisible: newIsVisible });
    }

    closeResponseHandler = (i) => {
        let newIsVisible = [...this.state.isVisible];
        newIsVisible[i] = false;
        this.setState({ isVisible: newIsVisible });
    }
    render() {
        let essentialFeildTitles = null;
        if (this.state.responseData[0] !== undefined) {
            essentialFeildTitles = <div className="ResponsesTitle">{this.state.responseData[0].essentialFeilds.title.map((title, i) => {
                return (
                    <span key={i}>{title}</span>
                );
            })}<span>Responses</span></div>
        }
        let responses = null;
        if (this.state.responseData.length > 0) {
            responses = this.state.responseData.map((response, i) => {
                return (
                    <div key={i} className="Response">
                        <div className="ResponsesContent">
                            {response.essentialFeilds.answer ? response.essentialFeilds.answer.map((feild, i) => (<span key={i}>{feild}</span>)) : null}
                            <button onClick={() => this.showResponseHandler(i)}>View Response</button>
                            <button onClick={() => this.showResponseHandler(i)}>View</button>

                        </div>
                        <div className="Collapsible">
                            <Collapse isOpen={this.state.isVisible[i]} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className="CollapsibleContent">
                                <div className="MainContent">
                                    <Response isDataArrived={true} data={response.questionArr} />
                                    <Button clicked={() => this.closeResponseHandler(i)}>Close</Button>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                );
            })
        }

        return (
            <BackDrop isLoading={this.props.loading}>
                {this.state.noResponse ? <div className="noPapers"><p>You haven't got any responses yet.</p></div> :
                    <div className="Responses">
                        {essentialFeildTitles}
                        {responses}
                    </div>}
            </BackDrop>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        loading: state.auth.loading
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Responses);