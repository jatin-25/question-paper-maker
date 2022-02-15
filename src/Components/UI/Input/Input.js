import React from 'react';
import './Input.css';

const input = props => {

    let inputElement = null;
    let inputClasses = ["InputElement",props.isInvalid && props.isTouched?"Invalid":null].join(" ");
    switch(props.elementType){
        case 'type':
            inputElement = <input 
            className={inputClasses} 
            {...props.elementConfig}
            value = {props.value}
            onChange={(event) => props.changed(event,props.identifier)}
            />
            break;
        case 'textarea':
            inputElement = <textarea 
            className={inputClasses} 
            {...props.elementConfig} 
            value = {props.value}
            onChange={(event) => props.changed(event,props.identifier)}
            />
            break;
        case 'select':
        inputElement = <select 
        className={classes.InputElement} 
        onChange={(event) => props.changed(event,props.identifier)}
        >
            {props.elementConfig.options.map((option,i) => {
                return <option key={i} value={option.value} >{option.displayValue}</option>
            })}


        </select>;
        break;
        default:
            inputElement = <input 
            className={inputClasses} 
            {...props.elementConfig} 
            onChange={(event) => props.changed(event,props.identifier)}
            value = {props.value}/>
    }
    return (
        <div>{inputElement}
        </div>
    );
}

export default input;