import React,{Component} from 'react';
import classes from './MultipleChoiceQuestion.css';

class MultipleChoiceQuestionForm extends Component {
    
    constructor(props){
        super(props);
        this.state= {
            questionData:{
                type: "MultipleChoiceQuestion",
                question: this.props.question?this.props.question:"",
                optionsList: this.props.optionsList?this.props.optionsList:[]
            },
            submit:false,
            optionsString: this.props.optionsStr?this.props.optionsStr:""
        }
    }

    sendData = () => {
        if(this.state.questionData.question === ""){
            alert("Question can't be Empty.");
        }
        else if(this.state.questionData.optionsList.length < 2){
            alert("There should be atleast two options in the Question.");
        }
        else if(this.props.edit){
            this.props.updateMCQOnEdit({question: this.state.questionData,index:this.props.qkey})
        }
        else
        this.props.questionDataPass(this.state.questionData);
    }

    cancelButtonHandler = () => {
        if(this.props.edit){
            this.props.updateMCQOnEdit();
        }
        else
        this.props.questionDataPass();
    }
    
    onChangeQuestionHandler = (e) => {
        const newQuestion = e.target.value;
        let oldQuestionData = this.state.questionData;
        const newQuestionData = {
            type: "MultipleChoiceQuestion",
            question: newQuestion,
            optionsList: oldQuestionData.optionsList
        }
        this.setState({questionData:newQuestionData});
    }
    
    onChangeOptionsHandler = (e) => {
        let optionsListString = e.target.value;
        let options = "";
        let newOptions = "";
        if(optionsListString){
            options = [...optionsListString.split(',')];
            newOptions = [...options];
        }
        let oldQuestionData = this.state.questionData;
        const newQuestionData = {
            type: "MultipleChoiceQuestion",
            question: oldQuestionData.question,
            optionsList: newOptions
        }
        
        this.setState({questionData:newQuestionData,optionsString: optionsListString});   
    }

    submitQuestionHandler = () => {
        this.setState({submit:true});
        this.props.questionData(this.state.questionData);
        console.log(this.state.questionData);
    }
    render(){
        let options = null;
        if(this.state.questionData.optionsList){
            options = this.state.questionData.optionsList.map(option =>{
                return (
                    <div key={option}>
                        <input type="checkbox"></input>
                        <span>{option}</span>
                    </div>
                )
            });
        }
    
        let inputForm = null;
        if(!this.state.submit){
            inputForm = <div className={classes.Text}><p >Write Question Here</p>
            <input type="text"  onChange={(e) => this.onChangeQuestionHandler(e)} value={this.state.questionData.question}></input>
            <p>Write options here in the form of comma seperated values</p>
            <input type="text" onChange={(e) => this.onChangeOptionsHandler(e)} value={this.state.optionsString}></input>
            <br></br>
            
            </div>
        }
        return (
            <div  className={classes.Text}>
                {inputForm}
                <p>Preview</p>
                <p>{this.state.questionData.question}</p>
                {options}
                <button onClick={() => this.sendData()} className={classes.Button}>Submit</button>
                <button onClick={this.cancelButtonHandler} className={classes.Button}>Cancel</button>
            </div>
        );
    }
}

export default MultipleChoiceQuestionForm;