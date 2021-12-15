import React from "react";
import mouse from "../../assets/mouse-svgrepo-com.svg";
import keyboard from "../../assets/keyboard.svg";

class BackgroundAnimation extends React.Component {
    render(): React.ReactNode {
        return <div className="animation-wrapper">
            <img alt="mouse" className="svg" src={mouse} />
            <img alt="keyboard" className="svg" src={keyboard} />
            <img alt="mouse" className="svg" src={mouse} />
            <img alt="keyboard" className="svg" src={keyboard} />
            <img alt="mouse" className="svg" src={mouse} />
            <img alt="keyboard" className="svg" src={keyboard} />
            <img alt="mouse" className="svg" src={mouse} />
            <img alt="keyboard" className="svg" src={keyboard} />
        </div>
    }
}

export default BackgroundAnimation;