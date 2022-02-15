import React, { Component } from "react";
import './Toolbar.css';
import Q from '../../../assets/q.svg';
import {NavLink,withRouter} from 'react-router-dom';
import * as actions from '../../../Store/Actions/index';
import {connect} from 'react-redux';
import menuDots from '../../../assets/three-dots.svg';
import Collapse from '@kunukn/react-collapse';

class Toolbar extends Component{

    state = {
        isMenuClicked: false
    }

    onLogoutClickedHandler = () => {
        this.props.history.push("/");
        this.props.onLogoutClicked(0);
    }
    render(){
        let menuList = <div>
               <img src={menuDots} alt="Menu Icon" className="Icon" onClick={() => this.setState({isMenuClicked: !this.state.isMenuClicked})}/>
               <Collapse isOpen={this.state.isMenuClicked} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className="CollapContent">
                <div className="MenuContent" onMouseLeave={() => this.setState({ isMenuClicked: false })}>
                   <p onClick={() => this.onLogoutClickedHandler()} className="MenuItems">Logout</p>
                       <NavLink to="/profile" className="MenuItems">Your Profile</NavLink>
                   </div>
               </Collapse>
        </div>
        return (
            <header className="Toolbar">
                <nav>
                    <div className="Logo">

                        <img src={Q} alt="Question Paper Maker" className="Icon" onClick={this.props.clicked} />
                        <span>Question Paper Maker</span>
                    </div>
            <div className="NavItems">
            <NavLink to="/newPaper">Create Paper</NavLink>
            <NavLink to="/yourPapers">Your Papers</NavLink>
            <NavLink to="/submittedResponses">Submitted Responses</NavLink>
            </div>
                <div className="CornerItems">
                {/* {addQuestionTypes} */}
                {/* <img src={menuDots} alt="Menu Icon" className="Icon"/>
                <span onClick={() => this.onLogoutClickedHandler()}>Logout</span>
                <NavLink to="/profile">Your Profile</NavLink> */}
                        {menuList}
                </div>
            </nav>
        </header>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogoutClicked: (expirationTime) => dispatch(actions.setExpirationTime(expirationTime))
    }
}
export default withRouter(connect(null,mapDispatchToProps)(Toolbar));