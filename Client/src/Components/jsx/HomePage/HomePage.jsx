import GameSection from "./GamesSection"
import Description from "./Description"
import Footer from "./Footer";
import "../../css/HomePage/HomePage.css"

export default function HomePage(props){
    /* 
    EXPECTED STRUCTURE OF THE 'props' PARAMETER:

        {
            setPage: "function that change the scene of the page to the one of the selected game", //Its definition is in App.jsx
        }
    */
    return(
        <>
            <GameSection setPage={props.setPage} />
            <Description />
            <Footer />
        </>
    );
}