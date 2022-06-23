import React from "react";
import "./BackDrop.css";
import Spinner from "../../UI/Spinner/Spinner";
const backDrop = (props) => {
  let children = null;
  if (props.isLoading) {
    children = (
      <>
        <div className="spinner">
          <Spinner />
        </div>
        <div className={["backdrop", "loading"].join(" ")}>
          <div>{props.children}</div>
        </div>
      </>
    );
  } else {
    children = <div>{props.children}</div>;
  }
  return children;
};

export default backDrop;
