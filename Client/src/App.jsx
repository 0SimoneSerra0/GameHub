import HomePage from './Components/jsx/HomePage/HomePage'
import Tenzies from './Components/jsx/Tenzies/Tenzies'
import Header from "./Components/jsx/Header/Header"
import TicTacToe from './Components/jsx/TicTacToe/TicTacToe'
import "./index.css"
import { useRef, useState } from 'react';

export default function App() {
    const [selectedPage, setSelectedPage] = useState('homepage');
    const fade = useRef(null);



    function renderPage() {
        if (selectedPage === 'homepage')
            return <HomePage setPage={setPage} />
        else if (selectedPage === 'tenzies')
            return <Tenzies setPage={setPage} />
        else if (selectedPage === 'tic tac toe')
            return <TicTacToe setPage={setPage} />
    }


    function setPage(newPage) {
        if (newPage === selectedPage)
            return;

        // Transition for the page switch
        fade.current.style.opacity = "1";
        fade.current.style.width = "100vw";
        fade.current.style.height = "100vh";

        setTimeout(function () {

            setSelectedPage(newPage);   // actual selection of the new page

            fade.current.style.opacity = "0";
            setTimeout(function () {
                fade.current.style.width = "0";
                fade.current.style.height = "0";
            }, 1000);
        }, 1000);
    }

    return (
        <>
            <div class="bg"></div>
            <div class="bg bg2"></div>
            <div class="bg bg3"></div>

            <Header setPage={setPage} />
            <div className="header-spacing"></div> {/* since the header has position: fixed;
                                                       is necessary to have something that occupies the space
                                                       of the page under the header*/}
            {renderPage()}
            <div ref={fade} className="fade-transition"></div>
        </>
    );
}