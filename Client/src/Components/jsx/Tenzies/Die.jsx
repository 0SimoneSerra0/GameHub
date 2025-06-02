import { useState, useEffect } from "react"
import "/src/Components//css/Tenzies/Die.css"

export default function Die(props) {
    /*
        EXPECTED STRUCTURE OF THE 'props' PARAMETER:

        {
            value: "value of the die to render"
        }
    */
    let dots = new Array(props.value).fill(<span className="dot"> </span>);
    
    return (
        <button ref={props.ref} className={"die unlocked face-" + props.value} onClick={props.toggle}>
            {dots}
        </button>
    );
}