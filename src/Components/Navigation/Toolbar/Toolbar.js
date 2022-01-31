import React, { Component } from "react";
import classes from './Toolbar.css';
import menuBars from '../../../assets/menu.svg';
import add from '../../../assets/plus-circle.svg';
import {NavLink} from 'react-router-dom';

class Toolbar extends Component{

    state = {
        isHovered: false
    }

    onHoverHandler = () => {
        this.setState({isHovered: true});
    }
    onHoverLeaveHandler = () => {
        this.setState({isHovered: false});
    }
    render(){
        let addQuestionTypes = null;
        if(this.props.initialToolbar === false){
            addQuestionTypes = <div className={classes.AddQuestion} onMouseEnter={this.onHoverHandler} onMouseLeave={this.onHoverLeaveHandler}>
            <img src={add} alt="Add Question"/>
            <span>Add Question</span>
            <div className={classes.QuestionTypes} style = {{transform: this.state.isHovered ? "translateY(0)": "translateY(10vh)", opacity: this.state.isHovered  ? "1": "0"}} onMouseEnter={this.onHoverHandler} onMouseLeave={this.onHoverLeaveHandler}>
            <ul>
                <li onClick={this.props.clickFunctions.scq}>Single Choice Question</li>
                <li onClick={this.props.clickFunctions.mcq}>Multiple Choice Question</li>
                <li onClick={this.props.clickFunctions.pq}>Paragraph Question</li>
            </ul>
        </div>
        </div>
        }
        return (
            <header className={classes.Toolbar}>
            <img src={menuBars} alt="Menu" onClick={this.props.clicked}/>
            <nav>
            <div className={classes.NavItems}>
            <NavLink to="/newPaper">Create Paper</NavLink>
            <NavLink to="/yourPapers">Your Papers</NavLink>
            </div>
                {addQuestionTypes}
            </nav>
        </header>
        );
    }
}
export default Toolbar;