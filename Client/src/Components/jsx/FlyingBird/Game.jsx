import { useEffect, useRef, useState } from "react";
import "/src/Components/css/FlyingBird/Game.css"

export default function Game() {
    const gameContainer = useRef(null);
    const playerCont = useRef(null);
    const playerSprite = useRef(null);


    const [score, setScore] = useState(0);
    const [gameLost, setGameLost] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const obstaclesGenerationId = useRef(null);
    const obsTimeoutIds = useRef([]);

    var obstacles = [];
    var playerV = 270;  //Player speed ( Y axis )
    const obsWidth = 5; // obstacles width
    const playerTimeoutId = useRef(null); // Used to reset the timeout in the 'handlePlayerJump' function
    const maxObstaclesNum = 7; // maximum amount of obsacles that can be present on the screen
    const obstaclesCreationInterval = 700; // ms between the executions of the obstacles generating function



    // called when the user click the first space key of the game
    function startGame(e) {
        if (e.key === ' ') {
            setGameStarted(true);
            window.removeEventListener('keypress', startGame)
        }
    }


    // Function called when the player press space on the loose screen
    function resetGame(e) {
        if (e.key === ' ') {
            setScore(0)
            setGameLost(false);
            setGameStarted(false);
            window.removeEventListener('keypress', resetGame)
        }
    }


    // Called when the player hit space during the game
    function handlePlayerJump(e) {
        if (e.key === ' ' && !e.repeat && playerCont.current !== null && gameContainer.current !== null) {

            if (playerTimeoutId.current !== null)
                clearTimeout(playerTimeoutId.current)

            let fY = playerCont.current.getBoundingClientRect().y - gameContainer.current.getBoundingClientRect().y - 0.1 * playerV;

            if (fY < 0) // to don't let the player got out the screen
                fY = 0;

            playerCont.current.style.transitionDuration = `0.1s`
            playerCont.current.style.transform = `translateY(${fY}px)`;
            playerSprite.current.style.transform = 'rotate(-25deg)';
            playerSprite.current.style.transitionDuration = `200ms`


            playerTimeoutId.current = setTimeout(function () {
                const t = (gameContainer.current.getBoundingClientRect().y + gameContainer.current.getBoundingClientRect().height -
                    playerCont.current.getBoundingClientRect().y) / playerV;

                playerCont.current.style.transitionDuration = `${t}s`
                playerCont.current.style.transform = `translateY(${gameContainer.current.getBoundingClientRect().height - playerCont.current.getBoundingClientRect().height}px)`;
                playerSprite.current.style.transform = 'rotate(25deg)';
                playerSprite.current.style.transitionDuration = `0.5s`

                playerTimeoutId.current = setTimeout(() => {    // called when the player container ends the transition that brings it to the ground
                    setGameLost(true);
                }, t * 1010);

            }, 150);
        }

    }


    useEffect(function () {
        if (!gameStarted) {
            //set up the right event listeners to start the game
            window.addEventListener('keypress', handlePlayerJump);
            window.addEventListener('keypress', startGame);

        } else if (!gameLost) {

            // Obstacles generation
            var d = gameContainer.current.getBoundingClientRect().width -   // distance between two obstacles
                Math.floor(Math.random() * (10 - 4) + 4) *
                playerCont.current.getBoundingClientRect().width;


            obstaclesGenerationId.current = setInterval(() => {

                if (playerCont.current === null || gameContainer.current === null)
                    return;


                if (obstacles.length < maxObstaclesNum &&
                    (
                        obstacles.length === 0 ||
                        obstacles.at(obstacles.length - 1)[0].getBoundingClientRect().x < d
                    )
                ) {
                    d = gameContainer.current.getBoundingClientRect().width -
                        Math.floor(Math.random() * (10 - 4) + 4) *
                        playerCont.current.getBoundingClientRect().width;


                    // crration of the divs tat compose an obstacle (top and bottom part)
                    const newObsacle = [document.createElement('div'), document.createElement('div')];

                    // space between the top and bottom div
                    const spaceBetween = Math.floor(Math.random() * (4 - 2) + 2) * playerCont.current.getBoundingClientRect().height *
                        100 / gameContainer.current.getBoundingClientRect().height;

                    const heightTopObstacle = Math.floor(Math.random() * (100 - spaceBetween - 10)) + 1;

                    newObsacle[0].classList.add("top-obstacle");
                    newObsacle[1].classList.add("bottom-obstacle");

                    newObsacle[0].style.width = `${obsWidth}rem`
                    newObsacle[0].style.height = `${heightTopObstacle}cqh`
                    newObsacle[0].style.position = "absolute";
                    newObsacle[0].style.right = `-${obsWidth}rem`

                    newObsacle[1].style.width = `${obsWidth}rem`
                    newObsacle[1].style.height = `${100 - heightTopObstacle - spaceBetween}cqh`;
                    newObsacle[1].style.position = "absolute";
                    newObsacle[1].style.right = `-${obsWidth}rem`

                    obstacles.push(newObsacle);
                    gameContainer.current.appendChild(newObsacle[0]);
                    gameContainer.current.appendChild(newObsacle[1]);

                    const v = 100; // speed of the obstacles
                    const translateString = `translateX(calc(-${gameContainer.current.getBoundingClientRect().width}px - ${obsWidth}rem))`
                    newObsacle[0].style.transition = `transform ${gameContainer.current.getBoundingClientRect().width / v}s linear`;
                    newObsacle[1].style.transition = `transform ${gameContainer.current.getBoundingClientRect().width / v}s linear`;
                    newObsacle[0].style.transform = translateString + " rotate(180deg)";
                    newObsacle[1].style.transform = translateString;


                    const obRect = newObsacle[0].getBoundingClientRect();

                    const timeToReachPlayer = (obRect.x - obRect.width - (playerCont.current.getBoundingClientRect().x + playerCont.current.getBoundingClientRect().width)) / v * 1000;

                    const _id = setTimeout(function () {

                        if (gameLost)
                            return;

                        let cont = 0;
                        let id = 0;
                        const checksInterval = obRect.width / v / 4 * 1000;

                        id = setInterval(function () {
                            if (checkCollision(newObsacle[0], playerCont.current)) {
                                setGameLost(true);
                                clearInterval(id);
                            }
                            if (checkCollision(newObsacle[1], playerCont.current)) {
                                setGameLost(true);
                                clearInterval(id);
                            }

                            cont++;

                            if (cont >= 8) {
                                setScore(prevScore => prevScore + 130)
                                clearInterval(id);
                            }
                        }, checksInterval);

                        obsTimeoutIds.current.splice(obsTimeoutIds.current.indexOf(_id), 1);
                    }, timeToReachPlayer);

                    obsTimeoutIds.current.push(_id);

                    // Removes all the obstacles that has exited the screen on the left side
                    for (let i in obstacles)
                        if (obstacles[i][0].getBoundingClientRect().x + obstacles[i][0].getBoundingClientRect().width <= 0) {
                            gameContainer.current.removeChild(obstacles[i][0]);
                            gameContainer.current.removeChild(obstacles[i][1]);
                            obstacles.splice(i, 1);
                        }
                }

            }, obstaclesCreationInterval);

        } else {

            // Stops the obstacles generation
            if (obstaclesGenerationId.current !== null) {
                clearInterval(obstaclesGenerationId.current);
            }

            obstaclesGenerationId.current = null;

            // removes all the current obstacles timeout
            // ( timeouts used to start the collision check )
            console.log(obsTimeoutIds.current);
            for (let i = 0; i < obsTimeoutIds.current.length; i++) {
                clearTimeout(obsTimeoutIds.current[i]);
            }

            obsTimeoutIds.current = [];


            window.removeEventListener('keypress', handlePlayerJump)

            // Waits for an amount of time before giving the player the chance to reset the game.
            // To make sure that he has stopped clicking to jump in the just lost game
            const waitFor = 400;
            setTimeout(() => {
                window.addEventListener('keypress', resetGame);
            }, waitFor);

        }

    }, [gameLost, gameStarted])


    // checks if two divs are colliding
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
        <>

            {
                gameLost ?

                    <div className="flyingb-lostgam-container">
                        <h1>OUCH! <br /> press <b>SPACE</b> to play again.</h1>
                        <h2>Score: {score}</h2>
                    </div>

                    :

                    <>
                        <div ref={gameContainer} className="flappyb-game-container">
                            <div ref={playerCont} className="player-container">
                                <img ref={playerSprite} src="/flyingbird.png" alt="" className="player-sprite" />
                            </div>
                        </div>
                        <div className="flyingbird-score-cotainer">
                            <h1 id="flyingbird-score">{score}</h1>
                        </div>

                        {
                            !gameStarted ?
                                <h1 id="flyingBird-start-text">Press <b>SPACE</b> to start</h1>
                                :
                                null
                        }

                    </>
            }
        </>
    );
}