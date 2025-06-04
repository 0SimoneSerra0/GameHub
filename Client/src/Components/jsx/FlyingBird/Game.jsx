import { useEffect, useRef } from "react";
import "/src/Components/css/FlyingBird/Game.css"

export default function Game() {
    const gameContainer = useRef(null);
    var obstacles = [];
    var playerV = 270;
    var d = innerWidth - (50 - Math.floor(Math.random() * 25)) * innerWidth / 100;
    var timeoutId = null;
    const maxObstaclesNum = 7; // maximum amount of obsacles that can be present on the screen
    const playerCont = useRef(null);
    const playerSprite = useRef(null);


    // Obstacles generation
    setInterval(() => {

        if (playerCont === null || gameContainer === null)
            return;

        if (obstacles.length < maxObstaclesNum &&
            (obstacles.length === 0 || obstacles.at(obstacles.length - 1)[0].getBoundingClientRect().x < d)
        ) {
            const obsWidth = 5;
            d = innerWidth - (50 - Math.floor(Math.random() * 25)) * innerWidth / 100;

            const newObsacle = [document.createElement('div'), document.createElement('div')];
            const spaceBetween = Math.floor(Math.random() * (50 - 30) + 30);
            const heightTopObstacle = Math.floor(Math.random() * (100 - spaceBetween - 10)) + 1;

            newObsacle[0].style.width = "5rem"
            newObsacle[0].style.height = `${heightTopObstacle}cqh`
            newObsacle[0].style.backgroundColor = "red";
            newObsacle[0].style.position = "absolute";

            newObsacle[1].style.width = "5rem"
            newObsacle[1].style.height = `${100 - heightTopObstacle - spaceBetween}cqh`;
            newObsacle[1].style.backgroundColor = "red";
            newObsacle[1].style.position = "absolute";
            newObsacle[1].style.x = newObsacle[0].style.x;

            newObsacle[0].classList.add("top-obstacle");
            newObsacle[1].classList.add("bottom-obstacle");

            obstacles.push(newObsacle);
            gameContainer.current.appendChild(newObsacle[0]);
            gameContainer.current.appendChild(newObsacle[1]);

            const a = 100 / newObsacle[0].getBoundingClientRect().width * gameContainer.current.getBoundingClientRect().width;
            const v = 100;
            newObsacle[0].style.transition = `transform ${gameContainer.current.getBoundingClientRect().width / v}s linear`;
            newObsacle[1].style.transition = `transform ${gameContainer.current.getBoundingClientRect().width / v}s linear`;
            newObsacle[0].style.transform = `translateX(-${a}%)`;
            newObsacle[1].style.transform = `translateX(-${a}%)`;

            const rect1 = newObsacle[0].getBoundingClientRect();

            const _t = (rect1.left - playerCont.current.getBoundingClientRect().right) / v * 1000;

            setTimeout(function () {
                let cont = 0;
                let id = 0;
                const interval = newObsacle[0].getBoundingClientRect().width / v / 4 * 1000;
                id = setInterval(function () {
                    if (checkCollision(newObsacle[0], playerCont.current)) {
                        console.log("You loose")
                    }
                    if (checkCollision(newObsacle[1], playerCont.current)) {
                        console.log("You loose")
                    }

                    cont++;

                    if (cont >= 4) {
                        clearInterval(id);
                    }
                },);
            }, _t)

            for (let i in obstacles)
                if (obstacles[i][0].getBoundingClientRect().x + obstacles[i][0].getBoundingClientRect().width <= 0) {
                    gameContainer.current.removeChild(obstacles[i][0]);
                    gameContainer.current.removeChild(obstacles[i][1]);
                    obstacles.splice(i, 1);
                }
        }

    }, 700);

    window.addEventListener('keypress', e => {
        if (e.key === ' ') {
            if (timeoutId !== null)
                clearTimeout(timeoutId)

            const fy = 0.1 * playerV;
            playerCont.current.style.transitionDuration = `0.1s`
            playerCont.current.style.transform = `translateY(${playerCont.current.getBoundingClientRect().y - gameContainer.current.getBoundingClientRect().y - fy}px)`;
            playerSprite.current.style.transform = 'rotate(-25deg)';
            playerSprite.current.style.transitionDuration = `0.2s`

            timeoutId = setTimeout(function () {
                const t = (gameContainer.current.getBoundingClientRect().y + gameContainer.current.getBoundingClientRect().height -
                    playerCont.current.getBoundingClientRect().y) / playerV;
                playerCont.current.style.transitionDuration = `${t}s`
                playerCont.current.style.transform = `translateY(${gameContainer.current.getBoundingClientRect().height - playerCont.current.getBoundingClientRect().height}px)`;
                playerSprite.current.style.transform = 'rotate(25deg)';
                playerSprite.current.style.transitionDuration = `0.5s`
                timeoutId = null
            }, 150);
        }
    })

    function checkCollision(a, b) {
        const rect1 = a.getBoundingClientRect();
        const rect2 = b.getBoundingClientRect();

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }



    return (
        <div ref={gameContainer} className="flappyb-game-container">
            <div ref={playerCont} className="player-container">
                <img ref={playerSprite} src="/flyingbird.png" alt="" className="player-sprite" />
            </div>
        </div>
    );
}