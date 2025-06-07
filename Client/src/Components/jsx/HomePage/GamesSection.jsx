import { useState, useEffect, useRef } from "react"
import Game from "./Game"
import "/src/Components/css/HomePage/GamesSection.css"


export default function GameSection(props) {
    /*
        EXPECTED STRUCTURE OF THE 'props' PARAMETER:

        {
            setPage: "function that change the scene of the page to the one of the selected game", //Its definition is in App.jsx
        }
    */

    const [games, setGames] = useState([]);
    const gamesContainer = useRef(null);
    const selectedArrow = useRef(null);
    let selectedGame = useRef(null);

    let resetSelectedArrow = useRef(true);
    let gameSelectionOn = useRef(true);
    let scrollingTo = useRef(false);

    let initScrollDone = false;
    let lastScrollPosition = 0;


    // This function deactivate or activate the game selection section (the one at the top with all the cards)
    function toggleGameSelection(activate) {

        if (selectedArrow.current === null)
            return

        // It just style the section up to makes it look active or not
        if (activate) {
            selectedArrow.current.style.transform = 'rotate(0deg)';
            gamesContainer.current.style.opacity = 1;
            const [leftArr, rightArr] = document.querySelectorAll('.arrow');
            leftArr.style.opacity = 1;
            rightArr.style.opacity = 1;
            gamesContainer.current.style.overflowX = 'scroll';
            scrollLogic();
        } else {
            if (selectedGame !== null)
                setSelectedGame(null);
            selectedArrow.current.style.transform = 'rotate(180deg)';
            gamesContainer.current.style.opacity = 0.5;
            const [leftArr, rightArr] = document.querySelectorAll('.arrow');
            leftArr.style.opacity = 0;
            rightArr.style.opacity = 0;
            gamesContainer.current.style.overflowX = 'hidden';
        }
        gameSelectionOn.current = activate;
    }


    function setSelectedGameStyle() {
        selectedGame.current.classList.add('selected-game');
    }

    function resetSelectedGameStyle() {
        selectedGame.current.classList.remove('selected-game');
    }


    // this function dynamically set the margin of the cards (Game.jsx)
    function setGamesMargin() {

        if (gamesContainer.current === null)
            return;

        const children = gamesContainer.current.children;

        if (!children.length)
            return;

        for (let i = 0; i < children.length; i++) {
            children[i].style.margin = "1.5vw";
        }

        // This is for obtain enough space to use the arrows selection also for the first or last game
        children[0].style.marginLeft = String(gamesContainer.current.getBoundingClientRect().width / 2) + "px";
        children[children.length - 1].style.marginRight = String(gamesContainer.current.getBoundingClientRect().width / 2) + "px";
    }

    useEffect(function () {

        // List of all the game (see Game.jsx to know what parameters are needed)
        setGames([{
            name: "Tenzies", description: "Test your luck with dice!",
            img: "/Tenzies.png", titleFont: 'Josefin Sans'
        },
        {
            name: "Tic Tac Toe", description: "Challenge a friend and find out who is the smartest!",
            img: "/TicTacToe.png", titleFont: 'Gochi Hand'
        },
        {
            name: "Flying Bird", description: "Try to get the highest score while jumping between the buildings",
            img: "/FlyingBird.png", titleFont: 'sans serif'
        }
        ]);

        // observe for a dynamically change in the children list of the gamesContainer
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    setGamesMargin();

                    if (!initScrollDone)
                        // This select the game in the center of the list, the timeout is necessary,
                        // so the browser won't reset the scrollbox to the start after the game was selected
                        setTimeout(function () {
                            const game = gamesContainer.current.children[Math.floor((gamesContainer.current.children.length - 1) / 2)]
                            const offsetFromBox = game.getBoundingClientRect().left - gamesContainer.current.getBoundingClientRect().left;
                            const centerOffset = (gamesContainer.current.clientWidth / 2) - game.offsetWidth / 2;

                            gamesContainer.current.scrollTo({
                                left: gamesContainer.current.scrollLeft + offsetFromBox - centerOffset,
                                behavior: 'smooth'
                            });

                        }, 500);
                }
            }
        }).observe(gamesContainer.current, {
            childList: true,
            subtree: false
        });


        // This determinate the centering behavior of the selected game (if it isn't already at the center)
        gamesContainer.current.addEventListener("scrollend", function () {
            if (resetSelectedArrow.current)
                selectedArrow.current.style.transform = `rotate(0rad)`

            scrollingTo.current = false;
            if (selectedGame.current !== null) {
                if (selectedArrow.current.style.transform !== 'rotate(0rad)')
                    scrollToGame(selectedGame.current);
            }
        });

        // Activate or deactivate the game selection based on the y scroll of the page
        window.addEventListener('scroll', function () {
            if (this.window.scrollY > this.innerHeight / 5)
                toggleGameSelection(false)
            else
                toggleGameSelection(true)
        });

    }, []);


    function renderGames() {
        return games.map(g =>
            <Game name={g.name} description={g.description} img={g.img} getFocus={getFocus}
                setPage={props.setPage} titleFont={g.titleFont} />
        );
    }

    // funtion that handle all the aspect that change with the scroll of the gamesContainer
    function scrollLogic() {
        const children = gamesContainer.current.children;

        if (!children.length)
            return;

        // hide one of the arrows if there aren't more games on the left or rigth side of the screen
        if (children[0].getBoundingClientRect().x + children[0].getBoundingClientRect().width / 2 < gamesContainer.current.getBoundingClientRect().width / 2) {
            document.querySelector(".left-arrow").style.opacity = 1;
        } else {
            document.querySelector(".left-arrow").style.opacity = 0;
        }

        // show the arrows if there are more games on the left or rigth side of the screen
        if (children[children.length - 1].getBoundingClientRect().x > gamesContainer.current.getBoundingClientRect().width / 2) {
            document.querySelector(".right-arrow").style.opacity = 1;
        } else {
            document.querySelector(".right-arrow").style.opacity = 0;
        }


        // this section handles the opacties of the cards at the side of the screen
        const thresh = (35 * window.innerWidth / 100);
        let selectedGameChanged = false;

        for (let i = 0; i < children.length; i++) {
            const div = children[i];
            const rect = div.getBoundingClientRect();
            let op = (rect.x + rect.width) / thresh;

            op = op <= 1 ? (op >= 0 ? op : 0) : 1;  // to make sure that the opacity isn't < 0

            if (op == 1) {
                if (div.parentElement.getBoundingClientRect().width > rect.x) {
                    op = (div.parentElement.getBoundingClientRect().width - (rect.x)) / thresh;
                    op = op = op <= 1 ? (op >= 0 ? op : 0) : 1;
                } else {
                    op = 0;
                }
            }
            div.style.opacity = op;

            // selects the game at the center of the scroll box
            if (!scrollingTo.current && !selectedGameChanged &&
                rect.x + rect.width / 2 > (div.parentElement.getBoundingClientRect().width - rect.width / 1.5) / 2 &&
                rect.x + rect.width / 2 < (div.parentElement.getBoundingClientRect().width + rect.width / 1.5) / 2
            ) {

                if (selectedGame.current !== div) {
                    setSelectedGame(div);
                    selectedGameChanged = true;
                } else {
                    selectedGameChanged = true
                }

            }
        }

        if (!selectedGameChanged && !scrollingTo.current) {
            setSelectedGame(null);
        }


        // this makes the arrow at the center of the screen points in the direction of the selected game, or the closest one
        let selectedGameRect = null;
        if (selectedGame.current !== null) {
            selectedGameRect = selectedGame.current.getBoundingClientRect();
        } else {

            resetSelectedArrow.current = false;
            const children = gamesContainer.current.children;
            let closestDiv = null;
            if (gamesContainer.current.scrollLeft > lastScrollPosition) {
                closestDiv = gamesContainer.current.children[gamesContainer.current.children.length - 1];
                
                for (let i = children.length - 1; i >= 0; i--) {
                    const rect = children[i].getBoundingClientRect();
                    if (rect.x + rect.width / 2 > (children[i].parentElement.getBoundingClientRect().width + rect.width / 1.5) / 2 && children[i] !== selectedGame.current) {
                        if (rect.x < closestDiv.getBoundingClientRect().x)
                            closestDiv = children[i];
                    } else
                        break;
                }
                selectedGameRect = closestDiv.getBoundingClientRect();

            } else {

                closestDiv = gamesContainer.current.children[0];

                for (let i = 0; i < children.length; i++) {
                    const rect = children[i].getBoundingClientRect();
                    if (rect.x + rect.width / 2 < (children[i].parentElement.getBoundingClientRect().width - rect.width / 1.5) / 2 && children[i] !== selectedGame.current) {
                        if (rect.x > closestDiv.getBoundingClientRect().x)
                            closestDiv = children[i];
                    } else
                        break;
                }
                selectedGameRect = closestDiv.getBoundingClientRect();
            }
        }

        // trigonometric way to get the angle of the arrow so that it points at the game using the second theorem on right triangles
        const arrowRect = selectedArrow.current.getBoundingClientRect();
        const tan_alpha = ((arrowRect.y + arrowRect.height / 2) - (selectedGameRect.y + selectedGameRect.height)) / Math.abs(arrowRect.x + arrowRect.width / 2 - (selectedGameRect.x + selectedGameRect.width / 2));
        selectedArrow.current.style.transform = `rotate(${((arrowRect.x + arrowRect.width / 2) < (selectedGameRect.x + selectedGameRect.width / 2) ? "" : "-")}${String(Math.PI / 2 - Math.atan(tan_alpha))}rad)`

        setGamesMargin();

        lastScrollPosition = gamesContainer.current.scrollLeft;
    }

    // function that handle the deselction of the old selected game and the selection of the new one
    function setSelectedGame(newSelectedGame) {
        if (selectedGame.current !== null) {
            resetSelectedGameStyle();
        }
        selectedGame.current = newSelectedGame;
        if (selectedGame.current === null)
            return;

        setSelectedGameStyle();
    }

    // scroll the gaesContainer scroll box to the game passed as the parameter
    function scrollToGame(game) {

        resetSelectedArrow.current = true;
        const offsetFromBox = game.getBoundingClientRect().left - selectedArrow.current.getBoundingClientRect().left;
        const centerOffset = (selectedArrow.current.clientWidth / 2) - game.offsetWidth / 2;

        scrollingTo.current = true;
        gamesContainer.current.scrollTo({
            left: gamesContainer.current.scrollLeft + offsetFromBox - centerOffset,
            behavior: 'smooth'
        });
    }

    // select the closest game on the left of the screen to the center
    function moveLeft() {
        if (!gameSelectionOn.current)
            return;
        let closestDiv = gamesContainer.current.children[0];
        const children = gamesContainer.current.children;

        if (selectedGame.current === null)
            for (let i = 0; i < children.length; i++) {
                const rect = children[i].getBoundingClientRect();
                if (rect.x + rect.width / 2 < (children[i].parentElement.getBoundingClientRect().width - rect.width / 1.5) / 2 && children[i] !== selectedGame.current) {
                    if (rect.x > closestDiv.getBoundingClientRect().x)
                        closestDiv = children[i];
                } else
                    break;
            }
        else {
            let index = 0;
            for (let i = 0; i < children.length; i++) {
                if (children[i] == selectedGame.current) {
                    index = i;
                    break;
                }
            }

            if (index > 0)
                index--;

            closestDiv = children[index];
        }


        scrollToGame(closestDiv);

        setSelectedGame(closestDiv);

    }

    // select the closest game on the right of the screen to the center
    function moveRight() {
        if (!gameSelectionOn.current)
            return;
        let closestDiv = gamesContainer.current.children[gamesContainer.current.children.length - 1];
        const children = gamesContainer.current.children;

        if (selectedGame.current === null)
            for (let i = children.length - 1; i >= 0; i--) {
                const rect = children[i].getBoundingClientRect();
                if (rect.x + rect.width / 2 > (children[i].parentElement.getBoundingClientRect().width + rect.width / 1.5) / 2 && children[i] !== selectedGame.current) {
                    if (rect.x < closestDiv.getBoundingClientRect().x)
                        closestDiv = children[i];
                } else
                    break;
            }
        else {
            let index = 0;
            for (let i = 0; i < children.length; i++) {
                if (children[i] == selectedGame.current) {
                    index = i;
                    break;
                }
            }

            if (index < children.length - 1)
                index++;

            closestDiv = children[index];
        }

        scrollToGame(closestDiv);
        setSelectedGame(closestDiv);

    }

    // select the game passed as the parameter
    function getFocus(game) {
        if (!gameSelectionOn.current)
            return;
        setSelectedGame(game);
        scrollToGame(game);
    }


    return (
        <div className="main-container">
            <div className="game-selection-container">
                <div className="arrow left-arrow" onClick={moveLeft}>
                    <img src="/left-arrow.png" alt="" />
                </div>

                <div ref={gamesContainer} className="games-container" onScroll={scrollLogic} >
                    {renderGames()}
                </div>

                <div className="arrow right-arrow" onClick={moveRight}>
                    <img src="/left-arrow.png" alt="" />
                </div>
            </div>
            <img ref={selectedArrow} src="/up-arrow.png" alt="" className="selected-game-arrow" />
        </div>
    );
}