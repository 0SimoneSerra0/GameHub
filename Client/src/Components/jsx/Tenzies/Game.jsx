import Die from "./Die.jsx"
import { useState, useRef, useEffect } from "react"
import "/src/Components//css/Tenzies/Game.css"
import Confetti from "react-confetti"

export default function Game() {
    const [gameWon, setGameWon] = useState(false);
    const [rollsCount, setRollsCount] = useState(0);

    const allDice = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [values, setValues] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // handles the reset when the user hit "New Game" in the win state of the page
    useEffect(function () {
        if (gameWon === true)
            return;

        for (let i = 0; i < allDice.length; i++) {
            allDice[i].current.classList.remove("locked");
            allDice[i].current.classList.add("unlocked");
        }
        setGameWon(false)
        RollDice();
    }, [gameWon]);



    // checks if the player has won
    function checkDice() {

        let won = true;

        // gets the count of every number that appears on all the dices
        let numberCount = Array(6).fill(0);
        for (let i = 0; i < values.length; i++) {
            numberCount[values[i] - 1] = numberCount[values[i] - 1] + 1;
        }


        // checks which number appears the most and takes it as the player choosen number
        let choosenNum = 1;
        for (let i = 0; i < numberCount.length; i++) {
            if (numberCount[i] > numberCount[choosenNum - 1])
                choosenNum = i + 1;
        }

        // change the style of every die based on their value,if they are of the choosen value
        // they get a the style of .right-die, else the one of .wrong-die
        for (let i = 0; i < allDice.length; i++) {
            if (values[i] != choosenNum) {
                allDice[i].current.classList.add('wrong-die');
                won = false;
            } else {
                allDice[i].current.classList.add('right-die');
            }
        }
        return won;
    }


    // generate new random values for the unlocked dice and, if they are all locked, it checks if te user
    // has won.
    // this function returns a boolean, indicating if it's possible to roll the dice (not all the dice are locked)
    // and in this case it returns true, else false
    function RollDice() {

        let newValues = [];
        let lockedCount = 0;

        for (let i = 0; i < values.length; ++i) {

            if (allDice[i].current.classList.contains("unlocked")) {

                let newValue = Math.ceil(Math.random() * 6);

                while (newValue === values[i])      // while the randomly generated value is equal to the previous one it gets changed
                    newValue = Math.ceil(Math.random() * 6);

                newValues.push(newValue);

            } else {
                lockedCount++;
                newValues.push(values[i]);
            }
        }


        if (lockedCount === allDice.length)
            return false;

        for (let i = 0; i < allDice.length; i++) {
            // this part resets the style of the dice when the 'Roll' button gets clicked
            allDice[i].current.classList.remove('wrong-die');
            allDice[i].current.classList.remove('right-die');
        }
        setValues(newValues);
        return true;
    }


    // function called by the onClick evet of the 'Roll' button (or 'New Game' if the user has won)
    function rollLogic() {
        // if gameWon == true that means that the button is currently displaying 'New Game'
        if (gameWon) {
            setGameWon(false);
            setRollsCount(0);
            return;
        }

        let diceRolled = RollDice();

        if (diceRolled)
            setRollsCount(prevRollsCount => prevRollsCount + 1);
    }


    function toggle(event) {

        if (gameWon)
            return;
        
        // switch the state of the clicked die (locked to unloced, unlocked to locked)
        if (event.currentTarget.classList.contains("locked")) {
            event.currentTarget.classList.remove("locked");
            event.currentTarget.classList.remove('wrong-die');
            event.currentTarget.classList.add("unlocked");
        } else {
            event.currentTarget.classList.remove("unlocked");
            event.currentTarget.classList.add("locked");
        }

        // checks if all the dice are locked and they are all of the same value
        let allLocked = true;
        for (let i = 0; i < allDice.length; i++) {
            if (allDice[i].current.classList.contains('unlocked')) {
                allLocked = false;
                break;
            }
        }

        if (allLocked && checkDice()) {
            setGameWon(true);
        }
    }

    return (
        <>
            {gameWon ? <Confetti /> : null}


            <div className="main-tenzies-container">
                <h2 className="rolls-count">Rolls: {rollsCount}</h2>
                <div className="dice">
                    <div className="dice-row">
                        <Die value={values[0]} ref={allDice[0]} toggle={toggle} />
                        <Die value={values[1]} ref={allDice[1]} toggle={toggle} />
                        <Die value={values[2]} ref={allDice[2]} toggle={toggle} />
                        <Die value={values[3]} ref={allDice[3]} toggle={toggle} />
                        <Die value={values[4]} ref={allDice[4]} toggle={toggle} />
                        <Die value={values[5]} ref={allDice[5]} toggle={toggle} />
                    </div>
                    <div className="dice-row">
                        <Die value={values[6]} ref={allDice[6]} toggle={toggle} />
                        <Die value={values[7]} ref={allDice[7]} toggle={toggle} />
                        <Die value={values[8]} ref={allDice[8]} toggle={toggle} />
                        <Die value={values[9]} ref={allDice[9]} toggle={toggle} />
                        <Die value={values[10]} ref={allDice[10]} toggle={toggle} />
                        <Die value={values[11]} ref={allDice[11]} toggle={toggle} />
                    </div>
                </div>
                <button className="reroll-btn" onClick={rollLogic}>{gameWon ? "New Game" : "Roll"}</button>
            </div>
        </>
    );
}