import React,{Component} from 'react';
import swal from 'sweetalert';
class ParagraphQuestionForm extends Component {
   
    constructor(props){
        super(props);
        this.state= {
            questionData:{
                type: "ParagraphQuestion",
                question: this.props.question?this.props.question:"",
            },
            submit:false,
        }
    }

    sendData = () => {
        if (this.state.questionData.question === "") {
            swal("Warning", "Question can't be Empty!", "warning");
        }
        else if(this.props.edit){
            this.props.updatePQOnEdit({question: this.state.questionData,index:this.props.qkey})
        }
        else
        this.props.questionDataPass(this.state.questionData);
    }

    onChangeQuestionHandler = (e) => {
        const newQuestion = e.target.value;
        const newQuestionData = {
            type: "ParagraphQuestion",
            question: newQuestion
        }
        this.setState({questionData:newQuestionData});
    }
    
    cancelButtonHandler = () => {
        if(this.props.edit){
            this.props.updatePQOnEdit();
        }
        else
        this.props.questionDataPass();
    }
    submitQuestionHandler = () => {
        this.setState({submit:true});
        this.props.questionData(this.state.questionData);
    }
    render(){
        
        
        let inputForm = null;
        if(!this.state.submit){
            inputForm = <div><p>Write Question Here</p>
            <input type="text"  onChange={(e) => this.onChangeQuestionHandler(e)} value={this.state.questionData.question}></input>
            <br></br>
            
            </div>
        }
        return (
            <div className="Text">
                {inputForm}
                <p>Preview</p>
                <p>{this.state.questionData.question}</p>
                <button onClick={() => this.sendData()} className="Button">Submit</button>
                <button onClick={this.cancelButtonHandler} className="Button">Cancel</button>
            </div>
        );
    }
}

export default ParagraphQuestionForm;