import { useEffect } from "react";
import "/src/Components/css/HomePage/Description.css"

export default function description() {

    const relations = {                         // relation between each the description div and its img
        "first-description": "react-logo",
        "second-description": "logo-img",
        "third-description": "flying-bird-img"
    };

    // This function makes the page scroll up to the game selection
    function goToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    // images transition logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = document.querySelector(`.${relations[entry.target.classList[1]]}`);
                    img.classList.add("shown");
                    img.classList.remove("not-shown");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        });

        const desc = document.querySelectorAll(".description-container");
        for (let i = 0; i < desc.length; i++) {
            observer.observe(desc[i]);
        }

    }, [])


    return (
        <div className="description-bg">

            <h1>GameHub?</h1>

            <div className="space-taker"></div> {/* the .space-taker divs make the elemets after them
                                                    wrap to the next line in the flex box*/}

            <div className="description-container first-description">
                <p id="first-description">
                    <b>GameHub</b> is a one man project made to learn the foundamentals of <b>React</b> framework. <br />
                    This <b>single page web app</b> contains a little collection of fun games that you could play with your friends!
                </p>
            </div>
            <img src="/react-logo.svg" alt="React Logo" className="react-logo right-img not-shown" />

            <div className="space-taker"></div>

            <img src="/logo.png" alt="GameHub Logo" className="logo-img left-img not-shown" />
            <div className="description-container second-description">
                <p id="second-description">
                    This project was intended to <b>never</b> be <b>released</b>, it is for educational and demostration purpose only. <br />
                    But this small web site can still be fun to explore and test, <b onClick={goToTop} className="bring-to-game-txt">try out some games!</b>
                </p>
            </div>

            <div className="space-taker"></div>

            <div className="description-container third-description">
                <h2>About Flying Bird...</h2>
                <p id="third-description">
                    Flying Bird was made using <b>only css animation</b> and a <b>JavaScript timing system</b>, that
                    allows to avoid contiinous collision checks repleacing them with timeout driven
                    events based on calculus made knowing the position of the moving object, its ending position and
                    its speed.<br /> This is far more <b>efficient</b>!
                </p>
            </div>
            <img src="/FlyingBird.png" alt="Flying Bird" className="flying-bird-img right-img not-shown" />

        </div>
    );
}