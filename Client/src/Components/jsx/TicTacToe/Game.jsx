import { useEffect, useRef, useState } from "react";
import "/src/Components/css/TicTacToe/Game.css"

export default function Game(props) {
    const [gameWon, setGameWon] = useState(false);
    const [drawGame, setDrawGame] = useState(false)
    const [redPoints, setRedPoints] = useState(0);
    const [bluePoints, setBluePoints] = useState(0);

    const grid = useRef(null);
    const redTurn = useRef(props.redTurn);
    const redSymbol = useRef(null);

    let gameMap = [["11", "12", "13"], ["21", "22", "23"], ["31", "32", "33"]];

    // swicthes the color of the grid
    function updateGrid() {
        grid.current.style.backgroundImage = `url(/ttt-${redTurn.current ? "red" : "blue"}-grid.png)`;
    }



    useEffect(function () {
        // chooses the symbols of the two colors
        if (!gameWon && !drawGame) {
            if (redTurn.current) {
                redSymbol.current = "X";
            } else {
                redSymbol.current = "O";
            }

            updateGrid();
        }
    }, [gameWon, drawGame])


    function checkGame() {
        const imgs = document.querySelectorAll(".grid-element");
        let result = ""; // this string contains the state of the game: "rw" = red wins; "bw" = bluewins; "d" = draw

        if (gameMap[0][0] === gameMap[1][1] && gameMap[0][0] === gameMap[2][2]) { // checks the main diagonal
            result = gameMap[0][0] === 'r' ? "rw" : "bw";
            imgs[0].classList.add('ttt-win-element');
            imgs[4].classList.add('ttt-win-element');
            imgs[8].classList.add('ttt-win-element');
        } else if (gameMap[0][2] === gameMap[1][1] && gameMap[0][2] === gameMap[2][0]) { // cjecks the other diagonal
            result = gameMap[0][2] === 'r' ? "rw" : "bw";
            imgs[2].classList.add('ttt-win-element');
            imgs[4].classList.add('ttt-win-element');
            imgs[6].classList.add('ttt-win-element');
        } else {
            // checks the colums
            for (let i = 0; i < gameMap[0].length; i++) {
                if (gameMap[0][i] === gameMap[1][i] && gameMap[0][i] === gameMap[2][i]) {
                    result = gameMap[0][i] === 'r' ? "rw" : "bw";
                    imgs[i].classList.add('ttt-win-element');
                    imgs[3 + i].classList.add('ttt-win-element');
                    imgs[6 + i].classList.add('ttt-win-element');
                    break;
                }
            }

            if (result === "") {
                // checks the rows
                for (let i = 0; i < gameMap[0].length; i++) {
                    if (gameMap[i][0] === gameMap[i][1] && gameMap[i][0] === gameMap[i][2]) {
                        result = gameMap[i][0] === 'r' ? "rw" : "bw";
                        imgs[3 * i].classList.add('ttt-win-element');
                        imgs[3 * i + 1].classList.add('ttt-win-element');
                        imgs[3 * i + 2].classList.add('ttt-win-element');
                        break;
                    }
                }
            }
        }

        if (result === "") {
            // checks if it is a draw game, if there aren't any blank spaces left then it's a draw
            let draw = true
            for (let i = 0; i < gameMap.length; i++) {
                for (let j = 0; j < gameMap[i].length; j++) {
                    if (gameMap[i][j] !== "r" && gameMap[i][j] !== "b") {
                        draw = false;
                    }
                }
            }
            result = draw ? "d" : "";
        }

        return result;
    }


    // set the image of a grid element
    function setImage(e) {
        const target = e.currentTarget;

        // if the target already has a symbol then the selection is invalid
        if (target.src.substring(target.src.lastIndexOf("/")) !== "/transparent.png") {
            return;
        }

        // each element constains its matrix coordinate in the second element of className
        const elementCoordinate = target.classList[1];
        gameMap[Number(elementCoordinate.charAt(0)) - 1][Number(elementCoordinate.charAt(1)) - 1] = redTurn.current ? "r" : "b";

        if (redTurn.current) {
            target.src = `/red-${redSymbol.current}.png`;
        } else {
            target.src = `/blue-${redSymbol.current === "X" ? "O" : "X"}.png`;
        }

        target.style.cursor = "default";


        let gameState = checkGame();
        switch (gameState) {
            case "rw":
                setGameWon(true);
                setRedPoints(prevPoints => prevPoints + 1);
                break;
            case "bw":
                setGameWon(true);
                setBluePoints(prevPoints => prevPoints + 1);
                break;
            case "d":
                setDrawGame(true);
                break;
            case "":
                redTurn.current = !redTurn.current;
                updateGrid();
                break;
        }
    }

    // clean the grid up and reset states and variable
    function reset() {
        const imgs = document.querySelectorAll(".grid-element");
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = "/transparent.png";
            imgs[i].style.cursor = "pointer";
            imgs[i].classList.remove('ttt-win-element');
        }

        gameMap = [["11", "12", "13"], ["21", "22", "23"], ["31", "32", "33"]];

        if (gameWon)
            setGameWon(false);
        else
            setDrawGame(false);

        redTurn.current = !redTurn.current;
        updateGrid();
    }

    return (
        <div className="ttt-main-container">

            <div className="ttt-points-counter ttt-red-points">
                <h1>RED: {redPoints}</h1>
            </div>

            <div ref={grid} className="ttt-center-element ttt-grid">
                <img src="/transparent.png" alt="" className="grid-element 11" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 12" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 13" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 21" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 22" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 23" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 31" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 32" onClick={setImage} />
                <img src="/transparent.png" alt="" className="grid-element 33" onClick={setImage} />

                {
                    gameWon ?
                        <div className="ttt-win-div">
                            <h1 style={{ color: redTurn.current ? "red" : "blue" }} className="ttt-winner-text">{redTurn.current ? "Red" : "Blue"}</h1>
                            <h1 className="ttt-win-text">Win!</h1>
                            <div class="ttt-break-item"></div>
                            <button onClick={reset} className="ttt-rst-btn">Play Againg</button>
                        </div> :
                        drawGame ?
                            <div className="ttt-draw-div">
                                <h1 id="ttt-draw-text">Draw</h1>
                                <div class="ttt-break-item"></div>
                                <button onClick={reset} className="ttt-rst-btn">Play Againg</button>
                            </div>
                            : null
                }

            </div>

            <div className="ttt-points-counter ttt-blue-points">
                <h1>BLUE: {bluePoints}</h1>
            </div>

        </div >
    );
}