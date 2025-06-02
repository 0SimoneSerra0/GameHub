import "/src/Components/css/HomePage/Description.css"

export default function description() {

    // This function makes the page scroll up to the game selection
    function goToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }


    return (
        <div className="description-bg">

            <h1>GameHub?</h1>

            <div className="space-taker"></div> {/* the .space-taker divs make the elemets after them
                                                    wrap to the next line in the flex box*/}

            <div className="description-container">
                <p id="first-description">
                    <b>GameHub</b> is a one man project made to learn the foundamentals of <b>React</b> framework. <br />
                    This <b>single page web app</b> contains a little collection of fun games that you could play with your friends!
                </p>
            </div>
            <img src="/react-logo.svg" alt="React Logo" className="react-logo" />

            <div className="space-taker"></div>

            <img src="/logo.png" alt="GameHub Logo" className="logo-img" />
            <div className="description-container second-description">
                <p id="second-description">
                    This project was intended to <b>never</b> be <b>released</b>, it is for educational and demostration purpose only. <br />
                    But this small web site can still be fun to explore and test, <b onClick={goToTop} className="bring-to-game-txt">try out some games!</b>
                </p>
            </div>
            
        </div>
    );
}