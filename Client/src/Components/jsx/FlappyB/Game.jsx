import { useEffect, useRef } from "react";
import "/src/Components/css/FlappyB/Game.css"

export default function Game() {
    const gameContainer = useRef(null);
    var obstacles = [];
    const maxObstaclesNum = 7; // maximum amount of obsacles that can be present on the screen

    setInterval(() => {

        if(gameContainer === null)
            return;


        if (obstacles.length < maxObstaclesNum) {

            // At the moment the code works only if there is this console.log
            console.log(obstacles.length)

            if (obstacles.length > 0) {
                if (obstacles.at(obstacles.length - 1)[0].getBoundingClientRect().x < innerWidth - 2*innerWidth/100) {
                    const newObsacle = [document.createElement('div'), document.createElement('div')];

                    newObsacle[0].style.width = "5rem"
                    newObsacle[0].style.height = "40%"
                    newObsacle[0].style.backgroundColor = "red";


                    newObsacle[1].style.width = "5rem"
                    newObsacle[1].style.height = "40%"
                    newObsacle[1].style.backgroundColor = "red";

                    newObsacle[0].classList.add("top-obstacle");
                    newObsacle[1].classList.add("bottom-obstacle");

                    obstacles.push(newObsacle);
                    gameContainer.current.appendChild(newObsacle[0]);
                    gameContainer.current.appendChild(newObsacle[1]);
                }
            } else {
                const newObsacle = [document.createElement('div'), document.createElement('div')];

                newObsacle[0].style.width = "5rem"
                newObsacle[0].style.height = "40%"
                newObsacle[0].style.backgroundColor = "red";

                newObsacle[1].style.width = "5rem"
                newObsacle[1].style.height = "40%"
                newObsacle[1].style.backgroundColor = "red";

                newObsacle[0].classList.add("top-obstacle");
                newObsacle[1].classList.add("bottom-obstacle");

                obstacles.push(newObsacle);
                gameContainer.current.appendChild(newObsacle[0]);
                gameContainer.current.appendChild(newObsacle[1]);

            }
        }

    }, 1000);

    return (
        <div ref={gameContainer} className="flappyb-game-container">

        </div>
    );
}