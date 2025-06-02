import "/src/Components//css/Tenzies/Header.css"

export default function Header(){
    return (
        <div className="header">
          <h1 className="title">Tenzies!</h1>
          <div className="description">
            <h3>Roll untill all the dice are the same. Click each die to hold it at its current value.</h3>
          </div>
        </div>
    );
}