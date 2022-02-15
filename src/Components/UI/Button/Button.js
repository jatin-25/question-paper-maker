import React from 'react';
import './Button.css';


const button = (props) => (
    <button className={["Button",[props.btnType],props.disabled?"Disabled":null].join(" ")} disabled = {props.disabled} onClick = {props.clicked}>{props.children}</button>
);

export default button;