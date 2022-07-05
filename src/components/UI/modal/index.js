import React from "react";
import "./styles.css";

const modal = (props) => {
    return (
        <div className="Modal" style={{ transform: props.show ? "translateY(0)" : "translateY(-100vh)", opacity: props.show ? "1" : "0" }}>
            {props.show ? props.children : null}
        </div>
    );
}

export default modal;