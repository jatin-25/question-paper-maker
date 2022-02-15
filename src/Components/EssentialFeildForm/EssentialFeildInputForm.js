import React,{Component} from 'react';
import './SingleChoiceQuestion.css';

class EssentialFeildInputForm extends Component {
    constructor(props){
        super(props);
        this.state= {
            feildTitleArray: [],
            submit: false
        }
    }

    sendData = () => {
        
    }

    onFeildTitleChangeHandler = (e) => {
        const feildTitleString = e.target.value;
        let feildTitleArr = [...feildTitleString.split(",")];
        this.setState({feildTitleArray: feildTitleArr});
    }

    submitQuestionHandler = () => {
    
        this.setState({submit:true});
        this.props.questionData(this.state.questionData);
    }

    cancelButtonHandler = () => {
        this.props.questionDataPass();
    }
    render(){
        let options = null;
        if(this.state.questionData.optionsList){
            options = this.state.questionData.optionsList.map(option =>{
                return (
                    <div key={option}>
                        <input type="radio"></input>
                        <span className="Text">{option}</span>
                    </div>
                )   
            });
        }
        
        let inputForm = null;
        if(!this.state.submit){
            inputForm = <div className="Text">
            <p>Write Feild Titles here in the form of comma seperated values.</p>
            <input type="text" onChange={(e) => this.onFeildTitleChangeHandler(e)} value={this.state.optionsString}></input>
            <br></br>
            </div>
        }
        return (
            <div className="Text">
                {inputForm}
                <button onClick={() => this.sendData()} className="Button">Submit</button>
                <button onClick={this.cancelButtonHandler} className="Button">Cancel</button>
            </div>
        );
    }
}

export default EssentialFeildInputForm;