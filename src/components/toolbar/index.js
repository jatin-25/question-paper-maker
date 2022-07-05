import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Q from "../../assets/q.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { setExpirationTime } from "../../store/actions";
import menuDots from "../../assets/three-dots.svg";
import Collapse from "@kunukn/react-collapse";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import "./styles.css";

const Toolbar = (props) => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const menubarWrapperRef = useRef(null);
  const sidebarWrapperRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (toggleSidebar === false) return

    function handleClickOutsideSideBar(event) {
      if (
        sidebarWrapperRef &&
        !sidebarWrapperRef.current.contains(event.target)
      ) {
        toggleSidebarHandler();
      }
    }

    document.addEventListener("mousedown", handleClickOutsideSideBar);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSideBar);
    };
  }, [toggleSidebar]);

  useEffect(() => {
    if (isMenuClicked === false) return

    function handleClickOutsideMenuBar(event) {
      if (
        menubarWrapperRef &&
        !menubarWrapperRef.current.contains(event.target)
      ) {
        toggleMenuBarHandler();
      }
    }

    document.addEventListener("mousedown", handleClickOutsideMenuBar);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenuBar);
    };
  }, [isMenuClicked]);

  const onLogoutClickedHandler = () => {
    toggleSidebar && toggleSidebarHandler();
    dispatch(setExpirationTime(0));
    navigate("/login");
  };

  const toggleSidebarHandler = () => {
    setToggleSidebar(!toggleSidebar);
  };
  const toggleMenuBarHandler = () => {
    setIsMenuClicked(!isMenuClicked);
  };

  let menuList = (
    <div ref={menubarWrapperRef}>
      <img
        src={menuDots}
        alt="Menu Icon"
        className="Icon"
        onClick={toggleMenuBarHandler}
      />
      <Collapse
        isOpen={isMenuClicked}
        transition="height 0.7s cubic-bezier(.4, 0, .2, 1)"
        className="CollapContent"
      >
        <div className="MenuContent">
          <p onClick={onLogoutClickedHandler} className="MenuItems">
            Logout
          </p>
          <NavLink
            to="/profile"
            className="MenuItems"
            onClick={toggleMenuBarHandler}
          >
            Your Profile
          </NavLink>
        </div>
      </Collapse>
    </div>
  );
  return (
    <header className="Toolbar">
      <nav>
        <div className="MenuBars">
          <FaIcons.FaBars onClick={toggleSidebarHandler} />
        </div>
        <div
          className={toggleSidebar ? "Sidebar Active" : "Sidebar"}
          ref={sidebarWrapperRef}
        >
          <div className="SideBarMenu">
            <div className="MenuItems">
              <div className="CloseSidebar" onClick={toggleSidebarHandler}>
                <AiIcons.AiOutlineClose />
              </div>
              <NavLink to="/newPaper" onClick={toggleSidebarHandler}>
                Create Paper
              </NavLink>
              <NavLink to="/yourPapers" onClick={toggleSidebarHandler}>
                Your Papers
              </NavLink>
              <NavLink to="/submittedResponses" onClick={toggleSidebarHandler}>
                Submitted Responses
              </NavLink>
              <NavLink to="/profile" onClick={toggleSidebarHandler}>
                Your Profile
              </NavLink>
              <NavLink to="/" onClick={onLogoutClickedHandler}>
                Logout
              </NavLink>
            </div>
          </div>
        </div>
        <div className="Logo">
          <img
            src={Q}
            alt="Question Paper Maker"
            className="Icon"
            onClick={props.clicked}
          />
          <span>Question Paper Maker</span>
        </div>
        <div className="NavItems">
          <NavLink to="/newPaper">Create Paper</NavLink>
          <NavLink to="/yourPapers">Your Papers</NavLink>
          <NavLink to="/submittedResponses">Submitted Responses</NavLink>
        </div>
        <div className="CornerItems">{menuList}</div>
      </nav>
    </header>
  );
};

export default Toolbar;
