import "/src/Components/css/HomePage/Footer.css"

export default function Footer() {

    return (
        <div className="homepage-footer">
            <div className="creator-section">
                <p>Creator:  Simone Serra</p>
            </div>
            <div className="link-section">
                <a href="www.linkedin.com/in/simone-serra-44282036a" target="_blank">LinkedIn</a>
                <a href="https://www.freelancer.com/u/simoneSerra?frm=simoneSerra&sb=t" target="_blank">FreeLancer</a>
                <a href="https://github.com/0SimoneSerra0" target="_blank">GitHub</a>
            </div>
            <div className="space-taker"></div>
            <div className="information-section">
                <p>You can contact me at: <b>simoneserra.contactme@gmail.com</b></p>
            </div>
        </div>
    );
}