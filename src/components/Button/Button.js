import React from 'react';
import classes from './Button.module.css'

const Button = (props) => {
    return (
      <button
        onClick={props.click}
        disabled={props.disabled}
        className={props.added ? classes.BtnRemove : classes.BtnAdd}>
        {props.added ? <i class="fas fa-trash-alt"></i> : "Nominate"}
      </button>
    )
}

export default Button;
