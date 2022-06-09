import React, { Component } from "react";
import './Toolbar.css';
import Q from '../../../assets/q.svg';
import { NavLink, withRouter } from 'react-router-dom';
import * as actions from '../../../Store/Actions/index';
import { connect } from 'react-redux';
import menuDots from '../../../assets/three-dots.svg';
import Collapse from '@kunukn/react-collapse';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.sidebarWrapperRef = React.createRef();
        this.menubarWrapperRef = React.createRef();
        this.handleClickOutsideSideBar = this.handleClickOutsideSideBar.bind(this);
        this.handleClickOutsideMenuBar = this.handleClickOutsideMenuBar.bind(this);
    }
    state = {
        isMenuClicked: false,
        toggleSidebar: false
    }

    componentDidMount = () => {
        document.addEventListener("mousedown", this.handleClickOutsideSideBar);
        document.addEventListener("mousedown", this.handleClickOutsideMenuBar);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutsideSideBar);
        document.removeEventListener("mousedown", this.handleClickOutsideMenuBar);
    }

    handleClickOutsideSideBar(event) {
        if (this.sidebarWrapperRef && !this.sidebarWrapperRef.current.contains(event.target)) {
            this.state.toggleSidebar && this.toggleSidebarHandler()
        }
    }

    handleClickOutsideMenuBar(event) {
        if (this.menubarWrapperRef && !this.menubarWrapperRef.current.contains(event.target)) {
            this.state.isMenuClicked && this.toggleMenuBarHandler()
        }
    }

    onLogoutClickedHandler = () => {
        this.state.toggleSidebar && this.toggleSidebarHandler()
        this.props.history.push("/");
        this.props.onLogoutClicked(0);
    }

    toggleSidebarHandler = () => {
        this.setState({ toggleSidebar: !this.state.toggleSidebar });
    }
    toggleMenuBarHandler = () => {
        this.setState({ isMenuClicked: !this.state.isMenuClicked });
    }

    render() {
        let menuList = <div ref={this.menubarWrapperRef}>
            <img src={menuDots} alt="Menu Icon" className="Icon" onClick={this.toggleMenuBarHandler} />
            <Collapse isOpen={this.state.isMenuClicked} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" className="CollapContent">
                <div className="MenuContent">
                    <p onClick={() => this.onLogoutClickedHandler()} className="MenuItems">Logout</p>
                    <NavLink to="/profile" className="MenuItems" onClick={this.toggleMenuBarHandler}>Your Profile</NavLink>
                </div>
            </Collapse>
        </div>
        return (
            <header className="Toolbar">
                <nav>
                    <div className="MenuBars">
                        <FaIcons.FaBars onClick={() => this.toggleSidebarHandler()} />
                    </div>
                    <div className={this.state.toggleSidebar ? "Sidebar Active" : "Sidebar"} ref={this.sidebarWrapperRef}>
                        <div className="SideBarMenu">
                            <div className="MenuItems">
                                <div className="CloseSidebar" onClick={() => this.toggleSidebarHandler()} >
                                    <AiIcons.AiOutlineClose />
                                </div>
                                <NavLink to="/newPaper" onClick={this.toggleSidebarHandler}>Create Paper</NavLink>
                                <NavLink to="/yourPapers" onClick={this.toggleSidebarHandler}>Your Papers</NavLink>
                                <NavLink to="/submittedResponses" onClick={this.toggleSidebarHandler}>Submitted Responses</NavLink>
                                <NavLink to="/profile" onClick={this.toggleSidebarHandler}>Your Profile</NavLink>
                                <NavLink to="/" onClick={() => this.onLogoutClickedHandler()}>Logout</NavLink>
                            </div>
                        </div>
                    </div>
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
export default withRouter(connect(null, mapDispatchToProps)(Toolbar));