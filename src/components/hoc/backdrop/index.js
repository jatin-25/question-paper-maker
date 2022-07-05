import React from "react";
import Spinner from "../../UI/spinner";
import "./styles.css";

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
