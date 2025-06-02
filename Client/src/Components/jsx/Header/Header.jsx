import "/src/Components/css/Header/Header.css"

export default function Header(props){
    /*
     EXPECTED STRUCTURE OF THE 'props' PARAMETER:

        {
            setPage: "function that change the scene of the page to the one of the selected game", //Its definition is in App.jsx
        }
    */
    
    function returnToHomepage(){
        props.setPage('homepage');
    }

    return (
        <div className="header-container">
            <div className="logo-anchor" onClick={returnToHomepage}>
                <img src="/logo.png" alt="GameHub" />
            </div>
            <div className="text-anchor" onClick={returnToHomepage}>GameHub</div>
        </div>
    );
}