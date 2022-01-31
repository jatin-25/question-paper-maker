import React,{Component} from 'react';
import classes from './SingleChoiceQuestion.css';

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
        console.log(this.state.questionData);
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
                        <span className={classes.Text}>{option}</span>
                    </div>
                )   
            });
        }
        
        let inputForm = null;
        if(!this.state.submit){
            inputForm = <div className={classes.Text}>
            <p>Write Feild Titles here in the form of comma seperated values.</p>
            <input type="text" onChange={(e) => this.onFeildTitleChangeHandler(e)} value={this.state.optionsString}></input>
            <br></br>
            </div>
        }
        return (
            <div className={classes.Text}>
                {inputForm}
                <button onClick={() => this.sendData()} className={classes.Button}>Submit</button>
                <button onClick={this.cancelButtonHandler} className={classes.Button}>Cancel</button>
            </div>
        );
    }
}

export default EssentialFeildInputForm;