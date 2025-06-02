import "/src/Components/css/HomePage/Footer.css"

export default function Footer() {

    return (
        <div className="homepage-footer">
            <div className="creator-section">
                <p>Creator:  Simone Serra</p>
            </div>
            <div className="link-section">
                <a href="https://www.linkedin.com/in/simone-serra-823736340">LinkedIn</a>
                <a href="http://">FreeLancer</a>
                <a href="http://">GitHub</a>
            </div>
            <div className="space-taker"></div>
            <div className="information-section">
                <p>You can contact me at: <b>simoneserra.contactme@gmail.com</b></p>
            </div>
        </div>
    );
}