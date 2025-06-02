import { useRef, useState } from "react";
import "/src/Components/css/HomePage/Game.css"


// This component is the card used to select the game at the top of the homepage
export default function Game(props) {
    /*
        EXPECTED STRUCTURE OF THE 'props' PARAMETER:

        {
            name: "name of the game",
            img: "path to the cover of the game",
            titleFont: "name of the title's font",    // tis is necessary because every game as a different font
            description: "small description of the game",
            setPage: "function that change the scene of the page to the one of the selected game", //Its definition is in App.jsx
            getFocus: "function to make this element the selected game" //Its definition is in HomePage.jsx
        }
    */

    const mainDiv = useRef(null);

    function sendGetFocus() {

        // if this component is already the selected game then the page should switch scene, else this become the selected game
        if (mainDiv.current.classList.contains('selected-game'))
            props.setPage(props.name.toLowerCase())
        else
            props.getFocus(mainDiv.current);
    }

    return (
        <>
            <div ref={mainDiv} className="game-container" onClick={sendGetFocus}>
                <img src={props.img} alt={props.name} className="game-image" />
                <h3 style={{fontFamily: `${props.titleFont}`}} className="game-title">{props.name}</h3>
                <p className="game-description">{props.description}</p>
            </div>
        </>
    );
}